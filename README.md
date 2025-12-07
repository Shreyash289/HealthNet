# HealthNet AI - Intelligent Provider Verification Platform

A modern, AI-powered healthcare provider verification platform built with Next.js. HealthNet AI uses intelligent algorithms to validate healthcare providers across multiple data sources including NPI registry, website verification, and phone validation.

## 🚀 Features

- **AI-Powered Verification**: Intelligent multi-source validation using advanced algorithms
- **Real-time Analysis**: Concurrent processing of multiple providers with live progress tracking
- **Comprehensive Validation**: 
  - NPI Registry verification
  - Website availability and content analysis
  - Phone number format validation
  - Confidence scoring system
- **Modern UI/UX**: Beautiful, responsive design with real-time feedback
- **Export Capabilities**: Download verification results as CSV
- **Performance Optimized**: Serverless architecture with efficient concurrent processing

## 🛠️ Tech Stack

- **Framework**: Next.js 14
- **Styling**: Tailwind CSS
- **API Integration**: Axios
- **Deployment**: Vercel (serverless functions)

## 📦 Installation

1. Clone the repository
```bash
git clone <repository-url>
cd HealthNet
```

2. Install dependencies
```bash
npm install
```

3. Run development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🚢 Deployment

### Deploy to Vercel

1. Push this repository to GitHub
2. Import the project on [Vercel](https://vercel.com)
3. Vercel will automatically detect Next.js and configure the deployment
4. Your application will be live!

## 📊 How It Works

1. **Add Providers**: Enter provider information (name, phone, website, NPI, address)
2. **AI Verification**: The system validates each provider across multiple sources:
   - NPI Registry API for official provider verification
   - Website analysis for availability and content matching
   - Phone number format validation
3. **Confidence Scoring**: Each provider receives a confidence score based on verification results
4. **Results**: View detailed verification results with AI-powered insights
5. **Export**: Download results as CSV for further analysis

## 🎯 API Routes

- `/api/npi` - NPI Registry verification proxy
- `/api/proxy` - Website content analysis proxy

## ⚠️ Notes

- Be mindful of external API rate limits when processing large batches
- NPI verification uses the official CMS NPI Registry API
- Website verification includes timeout protection and error handling

## 📝 License

This project is private and proprietary.
