# Vibe Check - Project Documentation

## 1. Project Overview
**Vibe Check** is an AI-powered student feedback analysis platform delivering real-time sentiment insights and categorization. It leverages Google's Gemini API for advanced natural language processing to understand student feedback at scale.

## 2. Key Features
- **Real-time Sentiment Analysis**: Instantly analyze student feedback to gauge overall sentiment (Positive, Neutral, Negative).
- **AI-Powered Summarization**: Generates concise summaries of feedback using Google Gemini.
- **Categorization**: Automatically categorizes feedback into relevant topics (e.g., Curriculum, Facilities, Teaching).
- **Visual Dashboard**: Interactive charts and graphs to visualize sentiment trends over time.
- **Scalable Architecture**: Built on a serverless architecture to handle high concurrency.

## 3. Technology Stack

### Frontend
- **Framework**: React 19 (via Vite)
- **Styling**: Tailwind CSS, Vanilla CSS
- **Routing**: React Router DOM
- **Visualization**: Recharts

### Backend
- **Runtime**: Node.js 18
- **Framework**: Express.js, Serverless Framework
- **Database**: Neon (Serverless PostgreSQL)
- **AI Engine**: Google Gemini API
- **Containerization**: Docker

### Infrastructure
- **Cloud Provider**: AWS (Lambda, API Gateway)
- **Frontend Hosting**: Vercel

## 4. Setup & Installation

### Prerequisites
- Node.js (v18+)
- npm or yarn
- Docker (optional, for containerized run)
- AWS CLI (configured for deployment)
- Serverless Framework (`npm install -g serverless`)

### Environment Variables
Create a `.env` file in the `backend` directory with the following variables:
```env
GEMINI_API_KEY=your_gemini_api_key
DATABASE_URL=your_neon_database_url
JWT_SECRET=your_jwt_secret
```

### Local Development

#### Backend
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The backend will run on `http://localhost:3000`.

#### Frontend
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`.

## 5. Deployment Guide

### Deployment to AWS Lambda (Serverless)
The backend is configured to be deployed as a serverless application on AWS Lambda.

1. **Configure AWS Credentials**: Ensure your AWS CLI is configured with appropriate permissions.
   ```bash
   aws configure
   ```
2. **Deploy**:
   Run the following command in the `backend` directory:
   ```bash
   npm run deploy
   ```
   This command uses the Serverless Framework to package and deploy the application to AWS. It will output the API Gateway URL upon completion.

### Deployment to Vercel (Frontend)
1. **Push to GitHub**: Ensure your project is pushed to a GitHub repository.
2. **Import in Vercel**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard).
   - Click **"Add New..."** -> **"Project"**.
   - Import your GitHub repository.
3. **Configure Build Settings**:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `vite build`
   - **Output Directory**: `dist`
4. **Deploy**: Click **Deploy**. Vercel will build and host your frontend.

### Docker Deployment
You can containerize the backend for deployment on any container orchestration platform (e.g., ECS, Kubernetes) or for local testing.

1. **Build the Docker Image**:
   Navigate to the `backend` directory and run:
   ```bash
   docker build -t vibechack-backend .
   ```

2. **Run the Container**:
   ```bash
   docker run -p 3000:3000 --env-file .env vibechack-backend
   ```
   The backend will be accessible at `http://localhost:3000`.

## 6. API Documentation
The backend exposes a RESTful API. Common endpoints include:
- `POST /analyze`: Submit feedback for sentiment analysis.
- `GET /summary`: Retrieve AI-generated summaries of feedback.
- `GET /trends`: Get sentiment trends over time.

*(Note: Add specific endpoint details as the API evolves)*
