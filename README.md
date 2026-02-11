# 1. Project Overview
Project Name: Vibe Check
Team ID: [Enter Team ID]
One-Liner: AI-powered student feedback analysis platform delivering real-time sentiment insights and categorization.

# 2. Technical Architecture
Cloud Provider: AWS (Lambda), Vercel
Frontend: React, Tailwind CSS
Backend: Node.js, Express, Serverless Framework
Database: Neon (PostgreSQL)

# 3. Proof of "Zero-Cost" Cloud Usage
We engineered this solution to operate entirely within free-tier limits while maintaining enterprise-grade scalability:

*   **AWS Lambda**: Utilized for serverless backend compute (Always Free Tier: 1M requests/month).
*   **Vercel**: Zero-cost frontend hosting with global edge network.
*   **Neon**: Serverless PostgreSQL database (Free Tier).
*   **Google Gemini API**: Free tier access for generative AI processing.

**Scalability for 800+ Users:**
We achieved high concurrency by deploying our Node.js backend to **AWS Lambda**. This serverless architecture allows the application to auto-scale instantly, spinning up new isolated instances to handle traffic spikes (800+ concurrent requests) without provisioning servers. We also utilized **Docker** to containerize the application, which enables the system to scale efficiently by running concurrent containers on the infrastructure to handle increased loads.

# 4. Important Links
Live Demo Link: https://hackathon-cloud-six.vercel.app
GitHub Repository: https://github.com/Sourya07/hackathon-cloud/
