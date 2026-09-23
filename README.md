# SpaceScout

SpaceScout is an AI-powered space exploration web application that lets users ask questions about space in natural language and receive structured discoveries from NASA APIs.

Instead of requiring users to know which NASA API or dataset to search, SpaceScout interprets the request, selects the appropriate tools, queries NASA's APIs, and presents the results in a structured interface.

## Features

* Natural-language space queries
* AI-powered tool selection and response generation
* NASA Astronomy Picture of the Day (APOD)
* NASA Near Earth Object Web Service (NeoWs)
* NASA DONKI solar flare data
* Saved space plans and query history
* User authentication with JWT
* Responsive React interface

## Tech Stack

**Frontend**

* React
* TypeScript
* Axios

**Backend**

* Django
* Django REST Framework
* Python
* SQLite
* Pydantic

**AI**

* OpenRouter
* OpenAI SDK

**APIs**

* NASA APIs

## How It Works

```text
User Prompt
    ↓
React Frontend
    ↓
Django REST API
    ↓
AI Planner
    ↓
NASA API Tools
    ↓
Structured Discoveries
    ↓
React Interface
```

The AI planner determines which NASA data sources are relevant to the user's request. The backend then calls the appropriate NASA APIs and stores the resulting space plan and discoveries.

# Project Screenshots 
### Home Page 
![Home Page](images/homepage.png) 
### Discoveries 
![Discoveries](images/space-discoveries.png) 
### Discovery Expanded Example 
![Discovery Example](images/space-discovery-apod.png)

---

# Complete Setup

## Requirements
* Python 3
* Node.js and npm
* Git
* A NASA API key
* An OpenRouter API key

---

# 1. Clone the Repository

```bash
git clone https://github.com/Tamercan1/spacescout-ai-space-planner.git
cd spacescout-ai-space-planner
```

---

# 2. NASA API Setup

The project uses NASA APIs to retrieve space-related information.

NASA provides an API key through its API portal.

### Get a NASA API Key

1. Go to the NASA API portal:
   https://api.nasa.gov/
2. Enter your name and email address.
3. Request an API key.
4. Copy the generated API key.

NASA also provides a `DEMO_KEY`, but using your own key is recommended for normal development because the demo key has lower usage limits.

Add your key to your backend environment file.

Example:

```env
NASA_API_KEY=your_nasa_api_key
```

#### More of the .env at `4. Environment Variables`

---

# 3. OpenRouter Setup

The project uses OpenRouter to access the configured AI model.

### Get an OpenRouter API Key

1. Create an account at:
   https://openrouter.ai/
2. Open your account's API key section.
3. Create a new API key.
4. Copy the key.

Add it to your backend environment file.

Example:

```env
OPENROUTER_API_KEY=your_openrouter_api_key
```

Optionally, you will also want to configure the AI model/provider

For example:

```env
# This is optional - default is openrouter/free for free models
LLM_MODEL=your_model_name (optional) - default is openrouter/free for free models
```

Use the model name supported by your current OpenRouter configuration.

---

# 4. Environment Variables

Create a `.env` file inside the backend directory.

Provide:

```env

# NASA
NASA_API_KEY=your_nasa_api_key

# AI Provider
OPENROUTER_API_KEY=your_openrouter_api_key

# This is optional - default is openrouter/free for free models
LLM_MODEL=your_model_name 
```

---

# 5. Backend Setup

Open a terminal:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

### Windows

```bash
venv\Scripts\activate
```

### macOS/Linux

```bash
source venv/bin/activate
```

Install the required Python packages:

```bash
pip install -r requirements.txt
```

Run Django migrations:

```bash
python manage.py migrate
```

Start the backend:

```bash
python manage.py runserver
```

The Django development server will normally run at:

```text
http://127.0.0.1:8000/
```

Keep this terminal running.

---

# 6. Frontend Setup

Open another terminal and go to the frontend:

```bash
cd frontend
```

Install the JavaScript dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The terminal will display the local frontend URL, normally something similar to:

```text
http://localhost:5173/
```

Paste that in your browser.

Both the Django backend and React frontend must be running.

---

# 7. Create an Account

After opening the frontend:

1. Register a new account.
2. Log in.
3. Enter a natural-language space request.
4. Submit the request.
5. Wait for the AI planner and NASA APIs to process the request.
6. Explore the generated discoveries.
7. Open the history sidebar to revisit previous plans.

---

# Example Prompts

You can try prompts such as:

```text
Show me interesting astronomy events from this week.
```

```text
What asteroids are currently passing relatively close to Earth?
```

```text
Tell me about an interesting NASA image from today.
```

```text
What solar activity has NASA recently recorded?
```

The AI planner determines whether the request requires NASA data and which available NASA services are relevant.

## Project Background

SpaceScout was originally built as my final project for **CS50's Web Programming with Python and JavaScript**. I continued developing it beyond the course as a way to explore AI-powered applications, API integration, and full-stack development.

I built SpaceScout out of my interest in astronomy and the idea of making NASA's publicly available data easier to explore through natural-language interaction.

## Status

SpaceScout is an ongoing project. The current version focuses on the core experience, with further improvements planned for usability, deployment, and additional space-data integrations.
