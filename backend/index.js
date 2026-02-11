require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const serverless = require('serverless-http');
const jwt = require('jsonwebtoken'); // Added for auth verification
const db = require('./db');
const authRoutes = require('./auth');

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);

// Analytics Endpoint
app.get('/analytics', async (req, res) => {
    try {
        const { branch, type } = req.query; // Optional filters

        let query = 'SELECT category, COUNT(*) as count FROM feedback';
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

        query += ' GROUP BY category';

        const result = await db.query(query, params);

        // Format results
        const stats = {
            Appreciation: 0,
            Concerns: 0,
            Suggestions: 0,
            Total: 0
        };

        result.rows.forEach(row => {
            const cat = row.category || 'Concerns'; // Fallback
            if (stats[cat] !== undefined) {
                stats[cat] = parseInt(row.count);
                stats.Total += parseInt(row.count);
            }
        });

        res.json(stats);
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
        // Expecting feedback to be an array of strings
        // feedback_type: 'Subject', 'Staff', 'Infra'
        // branch: 'AIML', 'CS', etc.

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
                category = "Error"; // Or default to Concerns
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
