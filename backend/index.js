require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const serverless = require('serverless-http');
const jwt = require('jsonwebtoken');
const db = require('./db');
const authRoutes = require('./auth');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);


app.get('/analytics', async (req, res) => {
    try {
        const { branch, type } = req.query;

        // Base Query Conditions
        let conditions = [];
        let params = [];

        if (branch && branch !== 'All') {
            conditions.push(`branch = $${conditions.length + 1}`);
            params.push(branch);
        }

        if (type && type !== 'All') {
            conditions.push(`feedback_type = $${conditions.length + 1}`);
            params.push(type);
        }

        const whereClause = conditions.length > 0 ? ' WHERE ' + conditions.join(' AND ') : '';

        // 1. Overall Stats Query
        const overallQuery = `SELECT category, COUNT(*) as count FROM feedback${whereClause} GROUP BY category`;
        const overallResult = await db.query(overallQuery, params);

        const stats = {
            Appreciation: 0,
            Concerns: 0,
            Suggestions: 0,
            Total: 0
        };

        overallResult.rows.forEach(row => {
            const cat = row.category || 'Concerns';
            if (stats[cat] !== undefined) {
                stats[cat] = parseInt(row.count);
                stats.Total += parseInt(row.count);
            }
        });

        // 2. Branch-wise Distribution Query
        // Only run if not filtering by a specific branch (or if you want to show comparison even when filtered)
        const branchQuery = `SELECT branch, category, COUNT(*) as count FROM feedback${whereClause} GROUP BY branch, category`;
        const branchResult = await db.query(branchQuery, params);

        const branchData = [];
        const branchesMap = {};

        branchResult.rows.forEach(row => {
            const b = row.branch || 'Unknown';
            if (!branchesMap[b]) {
                branchesMap[b] = { branch: b, Appreciation: 0, Concerns: 0, Suggestions: 0 };
                branchData.push(branchesMap[b]);
            }
            if (row.category && branchesMap[b][row.category] !== undefined) {
                branchesMap[b][row.category] = parseInt(row.count);
            }
        });

        // 3. Type-wise Distribution Query
        const typeQuery = `SELECT feedback_type, category, COUNT(*) as count FROM feedback${whereClause} GROUP BY feedback_type, category`;
        const typeResult = await db.query(typeQuery, params);

        const typeData = [];
        const typesMap = {};

        typeResult.rows.forEach(row => {
            const t = row.feedback_type || 'Other';
            if (!typesMap[t]) {
                typesMap[t] = { type: t, Appreciation: 0, Concerns: 0, Suggestions: 0 };
                typeData.push(typesMap[t]);
            }
            if (row.category && typesMap[t][row.category] !== undefined) {
                typesMap[t][row.category] = parseInt(row.count);
            }
        });

        // 4. 7-Day Trend Analysis Query
        // Postgres: Use to_char(created_at, 'YYYY-MM-DD') for date grouping
        // Filter for last 7 days from NOW()
        const trendWhereClause = conditions.length > 0
            ? whereClause + ` AND created_at >= NOW() - INTERVAL '7 days'`
            : ` WHERE created_at >= NOW() - INTERVAL '7 days'`;

        // Note: Using the same params array is tricky if we add more conditions. 
        // Ideally, rebuild params or ensure index alignment. Here, simplistic append works if no new params are needed for date.
        // Actually, date logic is static, so existing params work fine with the appended AND.

        const trendQuery = `
            SELECT to_char(created_at, 'Mon DD') as date, category, COUNT(*) as count 
            FROM feedback
            ${trendWhereClause}
            GROUP BY 1, category
            ORDER BY MIN(created_at) ASC
        `;

        const trendResult = await db.query(trendQuery, params);

        // Process Trend Data to ensure all dates have entries (optional, but good for charts)
        // For simplicity, we'll just map existing data. A robust solution normally fills gaps.
        const trendMap = {}; // Key: "Mon DD"
        const trendData = [];

        // Initialize last 7 days placeholders if needed (skipping for now to rely on query data)

        trendResult.rows.forEach(row => {
            const d = row.date;
            if (!trendMap[d]) {
                trendMap[d] = { date: d, Appreciation: 0, Concerns: 0, Suggestions: 0 };
                trendData.push(trendMap[d]);
            }
            if (row.category && trendMap[d][row.category] !== undefined) {
                trendMap[d][row.category] = parseInt(row.count);
            }
        });

        res.json({
            ...stats,
            branchData,
            typeData,
            trendData
        });

    } catch (err) {
        console.error("Analytics Error:", err);
        res.status(500).json({ error: "Failed to fetch analytics" });
    }
});

// Get Feedback History Endpoint
app.get('/feedback', async (req, res) => {
    try {
        const { branch, type } = req.query;

        let query = 'SELECT content as text, category, created_at FROM feedback';
        let params = [];
        let conditions = [];

        if (branch && branch !== 'All') {
            conditions.push(`branch = $${conditions.length + 1}`);
            params.push(branch);
        }

        if (type && type !== 'All') {
            conditions.push(`feedback_type = $${conditions.length + 1}`);
            params.push(type);
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        query += ' ORDER BY created_at DESC LIMIT 50'; // Limit to recent 50

        const result = await db.query(query, params);
        res.json({ results: result.rows });
    } catch (err) {
        console.error("Feedback Fetch Error:", err);
        res.status(500).json({ error: "Failed to fetch feedback" });
    }
});

let genAI;
let model;
if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here') {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
}

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Protected Analyzation Route
app.post('/analyze-feedback', authenticateToken, async (req, res) => {
    try {
        const { feedback, feedback_type, branch } = req.body;

        if (!feedback || !Array.isArray(feedback)) {
            return res.status(400).json({ error: 'Invalid input. Expected an array of feedback strings.' });
        }

        const userId = req.user.id;

        // Mock data fallback if no API key is provided
        if (!model) {
            console.log('Using mock data (No Gemini API Key found)');
            const mockCategories = ["Concerns", "Appreciation", "Suggestions"];

            const results = await Promise.all(feedback.map(async (text) => {
                const category = mockCategories[Math.floor(Math.random() * mockCategories.length)];


                try {
                    await db.query(
                        'INSERT INTO feedback (user_id, content, category, feedback_type, branch) VALUES ($1, $2, $3, $4, $5)',
                        [userId, text, category, feedback_type || 'General', branch || 'Unknown']
                    );
                } catch (dbErr) {
                    console.error("DB Save Error:", dbErr);
                }

                return { text, category };
            }));

            // Simulate delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            return res.json({ results, message: "Feedback saved successfully (Mock Mode)" });
        }

        const promises = feedback.map(async (text) => {
            let category = "Concerns";
            try {
                const prompt = `Categorize this student feedback into exactly one of these three categories: 'Concerns', 'Appreciation', or 'Suggestions'. Respond with ONLY the category name. Feedback: "${text}"`;

                const result = await model.generateContent(prompt);
                const response = await result.response;
                category = response.text().trim();

                // Normalize category
                if (category.toLowerCase().includes("appreciation")) category = "Appreciation";
                else if (category.toLowerCase().includes("suggestion")) category = "Suggestions";
                else if (category.toLowerCase().includes("concern")) category = "Concerns";
                else category = "Concerns"; // Default

            } catch (err) {
                console.error(`Error processing feedback: "${text}"`, err);
                category = "Error";
            }

            // Save to DB
            try {
                await db.query(
                    'INSERT INTO feedback (user_id, content, category, feedback_type, branch) VALUES ($1, $2, $3, $4, $5)',
                    [userId, text, category, feedback_type || 'General', branch || 'Unknown']
                );
            } catch (dbErr) {
                console.error("DB Save Error:", dbErr);
            }

            return { text, category };
        });

        const results = await Promise.all(promises);
        res.json({ results, message: "Feedback analyzed and saved successfully." });

    } catch (error) {
        console.error('Error analyzing feedback:', error);
        res.status(500).json({ error: 'Failed to analyze feedback' });
    }
});

// For local testing
if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
