# AI-Enhanced Note Editor

A sophisticated note-taking application built with Laravel 11, React, and OpenAI integration. This project demonstrates modern full-stack development with AI-powered features, real-time streaming, and advanced analytics.

## 🚀 Features

### Core Functionality

-   **Google OAuth Authentication** - Secure login with Google accounts
-   **Complete Note Management** - Full CRUD operations with validation
-   **Auto-save Feature** - Automatic saving every 2 seconds with visual feedback
-   **Real-time Search** - Search across all notes with instant results
-   **Advanced Analytics** - Raw PHP component for performance-critical statistics

### AI-Powered Enhancements

-   **AI Text Summarization** - Generate concise summaries with real-time streaming
-   **Content Improvement** - Enhance writing clarity and grammar with AI assistance
-   **Automatic Tag Generation** - AI-generated tags for better organization
-   **Real-time Streaming** - Live AI responses with progressive loading

### Technical Features

-   **Modern UI/UX** - Clean, responsive design with loading states
-   **Authorization Policies** - Secure access control for note operations
-   **Raw PHP Integration** - Standalone analytics engine for performance
-   **Real-time Updates** - Auto-save indicators and progress feedback

## 🛠 Tech Stack

### Backend

-   **Laravel 11** - Modern PHP framework
-   **SQLite** - Lightweight database
-   **Laravel Sanctum** - API authentication
-   **OpenAI PHP SDK** - AI integration with streaming support

### Frontend

-   **React 18** - Modern JavaScript library
-   **Inertia.js** - The modern monolith approach
-   **Tailwind CSS** - Utility-first CSS framework
-   **Vite** - Fast build tool and dev server

### AI & Analytics

-   **OpenAI GPT-3.5-turbo** - Language model for AI features
-   **Raw PHP Analytics** - Standalone performance component
-   **Streaming Responses** - Real-time AI content generation

## 📦 Installation

### Prerequisites

-   PHP 8.2+
-   Node.js 18+
-   Composer
-   OpenAI API Key
-   Google OAuth Credentials

### Setup Instructions

1. **Clone the repository**

    ```bash
    git clone <repository-url>
    cd ai-notes
    ```

2. **Install PHP dependencies**

    ```bash
    composer install
    ```

3. **Install Node.js dependencies**

    ```bash
    npm install
    ```

4. **Environment Configuration**

    ```bash
    cp .env.example .env
    php artisan key:generate
    ```

5. **Configure Environment Variables**

    ```env
    # Database
    DB_CONNECTION=sqlite
    DB_DATABASE=/absolute/path/to/database.sqlite

    # Google OAuth
    GOOGLE_CLIENT_ID=your_google_client_id
    GOOGLE_CLIENT_SECRET=your_google_client_secret
    GOOGLE_REDIRECT_URI=http://localhost:8000/auth/google/callback

    # OpenAI
    OPENAI_API_KEY=your_openai_api_key
    ```

6. **Database Setup**

    ```bash
    touch database/database.sqlite
    php artisan migrate
    ```

7. **Build Assets**

    ```bash
    npm run build
    ```

8. **Start Development Server**
    ```bash
    php artisan serve
    ```

## 🚀 Usage

### Basic Operations

1. **Login** - Use Google OAuth to authenticate
2. **Create Notes** - Add new notes with title and content
3. **Edit Notes** - Modify existing notes with auto-save
4. **Search Notes** - Find notes using the search functionality
5. **Delete Notes** - Remove notes with confirmation

### AI Features

1. **Summarize** - Get AI-generated summaries with streaming
2. **Improve Content** - Enhance writing with AI assistance
3. **Generate Tags** - Auto-create relevant tags for notes

### Analytics

-   Access comprehensive analytics via the Analytics page
-   View writing statistics, productivity insights, and content analysis

## 🔧 Configuration

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:8000/auth/google/callback`

### OpenAI API Setup

1. Sign up at [OpenAI](https://openai.com/)
2. Generate an API key
3. Add the key to your `.env` file

## 🚦 API Endpoints

### Authentication

-   `GET /auth/google` - Initiate Google OAuth
-   `GET /auth/google/callback` - Handle OAuth callback
-   `POST /logout` - User logout

### Notes Management

-   `GET /dashboard` - Notes dashboard
-   `GET /notes/create` - Create note form
-   `POST /notes` - Store new note
-   `GET /notes/{id}/edit` - Edit note form
-   `PUT /notes/{id}` - Update note
-   `DELETE /notes/{id}` - Delete note
-   `POST /notes/{id}/auto-save` - Auto-save functionality

### AI Features

-   `POST /notes/{id}/ai/summarize` - Streaming text summarization
-   `POST /notes/{id}/ai/improve` - Streaming content improvement
-   `POST /notes/{id}/ai/tags` - Generate tags

### Analytics

-   `GET /analytics` - Analytics dashboard

## 🔒 Security

-   **CSRF Protection** - All forms protected with CSRF tokens
-   **Authorization Policies** - Route-level access control
-   **Input Validation** - Server-side validation for all inputs
-   **Secure Authentication** - OAuth 2.0 with Google

## 🐛 Troubleshooting

### Common Issues

1. **OpenAI API Errors**

    - Verify API key is correct
    - Check API usage limits
    - Ensure proper model name (`gpt-3.5-turbo`)

2. **Google OAuth Issues**

    - Verify redirect URI matches exactly
    - Check client ID and secret
    - Ensure Google+ API is enabled

3. **Database Issues**
    - Ensure SQLite file exists and is writable
    - Run migrations if tables are missing
    - Check file permissions

## 📄 License

This project is open-source software licensed under the MIT license.

---

**Project Status**: ✅ Complete - All major features implemented and tested

This AI-Enhanced Note Editor demonstrates modern full-stack development with cutting-edge AI integration, real-time features, and professional-grade architecture suitable for production deployment.

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
