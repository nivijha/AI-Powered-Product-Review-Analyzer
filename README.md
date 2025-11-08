# 🧠 AI-Powered Product Review Analyzer

An intelligent, serverless web application that analyzes customer product reviews using **AWS Comprehend** to extract **sentiment** (Positive, Negative, Neutral, Mixed) and **key phrases**. The app provides a clean dashboard for visualizing sentiment trends and insights — built with a fully serverless AWS architecture and a modern React frontend.

<img width="1649" height="1310" alt="Architecture-diagram" src="https://github.com/user-attachments/assets/fd45f48b-1906-4139-ab30-95e5470875d9" />

---

## 🚀 Features

- 🗣 **AI-Powered Sentiment Analysis** using AWS Comprehend
- ☁️ **Serverless Backend** with AWS Lambda, API Gateway, and DynamoDB
- 📊 **Interactive Dashboard** for visualizing sentiment distribution
- 💬 **Real-Time Review Analysis** with sentiment confidence scores
- 🌐 **Deployed Frontend on Vercel**
  
---

## 🧰 Tech Stack Summary

| Layer | Technology | Description |
|-------|-------------|-------------|
| **Frontend** | React (hosted on Vercel) | User interface for submitting and viewing reviews |
| **API Layer** | AWS API Gateway | Manages REST API endpoints |
| **Compute** | AWS Lambda (Node.js) | Processes review text and handles data retrieval |
| **AI / NLP** | AWS Comprehend | Performs sentiment & key phrase extraction |
| **Database** | AWS DynamoDB | Stores review text, sentiment, and analysis results |
| **Logging** | AWS CloudWatch | Monitors Lambda executions and errors |
| **Auth & Permissions** | AWS IAM | Manages secure access between AWS services |

---

## ⚙️ Architecture Overview

The system follows a **serverless and event-driven architecture** using AWS services.

### 🧱 Architecture Diagram

The architecture diagram above illustrates the complete data flow:

**Frontend Layer (Vercel):**
- React App with multiple UI states (Loading, Error, Empty, Result)
- Dashboard with filters, sentiment chart, and review list
- Optional features: Search, pagination, CSV export, dark mode
- Review Form for user input

**AWS Cloud Environment:**
- **API Gateway**: Entry point for all HTTP requests
- **Lambda Functions**: 
  - `analyzeReview`: Processes POST requests for sentiment analysis
  - `getReviews`: Handles GET requests for retrieving stored reviews
- **AWS Comprehend**: AI service for sentiment and key phrase extraction
- **DynamoDB**: NoSQL database storing ProductReviews data
- **CloudWatch**: Centralized logging and monitoring
- **IAM Role**: Secure permissions management

---

### 🧩 Architecture Summary

The AI-Powered Product Review Analyzer follows a fully serverless architecture using AWS services. A React frontend hosted on Vercel communicates with AWS API Gateway endpoints that invoke Lambda functions for sentiment analysis and data retrieval. Reviews are processed through AWS Comprehend for sentiment and key phrase extraction, stored in DynamoDB, and visualized on an interactive dashboard with real-time analytics and user feedback states.

---

### ⚙️ Technical Workflow Explanation

**Review Submission Flow:**

1. User submits a product review through the React frontend (hosted on Vercel)
2. Frontend sends POST request to AWS API Gateway endpoint `/analyze`
3. API Gateway triggers the `analyzeReview` Lambda function
4. Lambda function calls AWS Comprehend to analyze the review text
5. Comprehend returns sentiment classification (POSITIVE/NEGATIVE/NEUTRAL/MIXED), confidence scores, and key phrases
6. Lambda stores the complete analysis result in DynamoDB `ProductReviews` table
7. Response with sentiment data is returned to frontend
8. Frontend displays the result with appropriate UI state

**Dashboard Retrieval Flow:**

1. Frontend sends GET request to API Gateway endpoint `/reviews`
2. API Gateway triggers the `getReviews` Lambda function
3. Lambda queries DynamoDB to retrieve all stored reviews
4. Aggregated sentiment data is calculated and returned
5. Frontend visualizes data using sentiment chart and review list components
6. Users can filter, search, and paginate through reviews (optional features)

**Monitoring & Security:**
- CloudWatch logs all Lambda executions and errors for debugging
- IAM roles enforce least-privilege access between AWS services
- API Gateway handles CORS configuration for secure frontend-backend communication

The React interface provides an interactive user experience with distinct states (loading, error, empty, result), and includes optional enhancements like filtering, searching, pagination, and dark mode. Together, these components create a scalable, serverless application that integrates AI-powered sentiment analysis with dynamic data visualization.

---

## 📂 Project Structure

```
ai-product-review-analyzer/
│
├── frontend/                      # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── ReviewForm.jsx
│   │   │   ├── ReviewResult.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ReviewList.jsx
│   │   │   └── SentimentChart.jsx
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── tailwind.config.js
│
├── backend/                       # AWS Lambda functions
│   ├── analyzeReview/
│   │   ├── index.js
│   │   └── package.json
│   ├── getReviews/
│   │   ├── index.js
│   │   └── package.json
│   └── utils/
│       └── dynamoClient.js
│
├── architecture-diagram.png
├── README.md
└── .gitignore
```

---

## 🔧 Setup and Deployment

### 1. **Frontend Setup (React)**

```bash
cd frontend
npm install
npm start
```

Update your `.env` file:

```ini
REACT_APP_API_URL=<Your API Gateway base URL>
```

### 2. **Backend Setup (AWS)**

#### Step 1: Create Lambda Functions

1. Create two Lambda functions:
   - `analyzeReview`
   - `getReviews`

2. Assign IAM Role with permissions for:
   - AWS Comprehend
   - DynamoDB (Read/Write)
   - CloudWatch Logs

#### Step 2: Create DynamoDB Table

- **Table name:** `ProductReviews`
- **Partition key:** `id` (String)
- **Enable:** On-demand billing or provisioned capacity

#### Step 3: Set Up API Gateway

1. Create REST API
2. Create endpoints:
   - `POST /analyze` → triggers `analyzeReview` Lambda
   - `GET /reviews` → triggers `getReviews` Lambda
3. **Enable CORS** on both endpoints
4. Deploy API to a stage (e.g., `prod`)

### 3. **Deploy Frontend**

Deploy your React app on **Vercel** (or Netlify):

1. Connect GitHub repository
2. Configure environment variable: `REACT_APP_API_URL`
3. Deploy

---

## 💾 DynamoDB Schema

| Attribute | Type | Description |
|-----------|------|-------------|
| `id` | String | Unique identifier (UUID) |
| `reviewText` | String | Original user review |
| `sentiment` | String | Sentiment category (POSITIVE/NEGATIVE/NEUTRAL/MIXED) |
| `sentimentScores` | Map | Confidence scores for each sentiment |
| `keyPhrases` | List | Extracted key phrases |
| `timestamp` | String | ISO timestamp |

---

## 📊 Dashboard Features

- ✅ Pie chart displaying sentiment distribution
- ✅ Review list with color-coded sentiment tags
- ✅ Filter reviews by sentiment type
- ✅ View individual key phrases and confidence scores
- ✅ Optional: search, pagination, dark mode

---

## 🌟 Future Enhancements

- 🔔 **Email notifications** using AWS SES for weekly sentiment summaries
- 📦 **S3 storage integration** for storing exported reports
- 🧠 **Multi-language support** with Comprehend language detection
- 🔐 **Authentication** using AWS Cognito for admin dashboard access
- 📈 **Advanced analytics** with trend analysis over time
- 🤖 **Automated responses** to negative reviews using AI

---

## 👩‍💻 Author

**Nivi Jha**

- 🌐 [GitHub](https://github.com/nivi-jha)
- 💼 [LinkedIn](https://linkedin.com/in/nivi-jha)

---

## 📄 License

This project is licensed under the **MIT License** — you are free to modify and use it for learning and portfolio purposes.

---

## 🏁 Summary

The **AI-Powered Product Review Analyzer** demonstrates how AI and serverless architecture can be seamlessly integrated to create a scalable, intelligent, and interactive cloud application. Built with **AWS Lambda**, **DynamoDB**, **Comprehend**, and a modern **React** frontend, it serves as an excellent showcase of applied cloud computing and natural language processing.

Perfect for portfolios, internships, and demonstrating full-stack serverless development skills! 🚀
