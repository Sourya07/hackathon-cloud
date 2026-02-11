# Vibe Check Backend

This is the backend API for the Vibe Check Dashboard, built with:
- **Node.js**: As the runtime environment.
- **Express**: To handle HTTP requests.
- **Serverless Framework**: To deploy as an AWS Lambda function.
- **OpenAI API**: For categorizing student feedback using GPT-4o-mini.

## Prerequisites
- Node.js installed.
- OpenAI API Key (optional for development, required for production).

## Setup
1.  Navigate to the directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Set up environment variables:
    If you have an OpenAI API Key, replace `your_openai_api_key_here` in `.env` with your actual key.
    If not, the backend will use mock data for testing.

## Running Locally
```bash
npm start
```
The server will run on `http://localhost:3000`.

## Deployment (AWS Lambda)
To deploy the backend to AWS Lambda:
```bash
npm run deploy
```
This requires AWS credentials configured on your machine.
After deployment, update the `fetch` URL in `frontend/src/App.jsx` with the returned endpoint URL.
