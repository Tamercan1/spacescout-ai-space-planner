# AI Space Planner

AI Space Planner is a web application that allows users to explore space-related information through natural-language requests. Instead of requiring users to know which NASA API to use or how to structure a query, the application uses an AI model to interpret the user's request, determine what information is needed, retrieve relevant information from NASA APIs, and organize the results into a structured Space Plan.

The application provides a React-based interface where users can submit questions, view generated space discoveries, explore NASA media and information, and revisit previously generated plans through a history sidebar. User accounts and saved plans are handled by a Django backend and database.

## Distinctiveness and Complexity

AI Space Planner is distinct from the other CS50W projects because it is neither a social network nor an e-commerce application. Its primary purpose is to act as an AI-assisted interface for exploring external scientific data, rather than connecting users socially or facilitating transactions.

The application is also substantially different from the course's earlier projects. It does not primarily consist of creating, editing, or displaying user-generated posts, listings, messages, or products. Instead, the central feature is a multi-step AI and API workflow. A user provides a natural-language request, the backend sends the request to an AI planner, the planner determines what information is relevant, appropriate NASA APIs are called, the returned information is organized into structured data, and the resulting Space Plan is saved to the database and displayed by the React frontend.

The project is more complex than a typical CRUD application because several independent systems must work together. The Django backend handles authentication, authorization, database persistence, API endpoints, and the application logic. The AI layer interprets natural-language requests and produces structured planning information. Pydantic is used to validate structured data before it is stored. The backend also communicates with multiple NASA APIs, including APOD, NeoWs, and DONKI. Finally, the React frontend manages authentication state, API communication, loading and error states, responsive navigation, history, and interactive discovery cards.

The project also requires coordination between multiple layers of the application. For example, when a user asks a question about space, the request travels from the React frontend to Django, through the AI planning process, potentially to one or more NASA APIs, back through the backend where the result is structured and stored, and finally back to React for presentation. This makes the application more than a simple frontend consuming a single API.

The application includes user authentication and user-specific data access as well. Each user's saved Space Plans are associated with their account, and backend authorization prevents users from retrieving or deleting plans belonging to another user.

## Features

* User registration and login
* JWT-based authentication
* Natural-language space requests
* AI-assisted planning
* Integration with NASA APOD, NeoWs, and DONKI APIs
* Structured Space Plans
* Interactive discovery cards
* NASA images and other available media
* Saved plan history
* View previously generated plans
* View the original prompt used to create a plan
* Delete saved plans
* Responsive history sidebar
* Loading and error states
* Mobile-responsive interface

## Technologies Used

### Backend

* Python
* Django
* Django REST Framework
* Django ORM
* Simple JWT
* Pydantic

### Frontend

* React
* TypeScript
* Axios
* React Router
* CSS

### External Services

* Google Gemini
* Openrouter
* Configurable AI provider
* NASA APOD API
* NASA Near Earth Object Web Service (NeoWs)
* NASA DONKI

## File Structure

The project is divided into a Django backend and a React frontend.

### Backend

`backend/manage.py`
The Django command-line entry point used to run the development server, migrations, and other Django commands.

`backend/api/`
The main Django application containing the application's models, API logic, serializers, authentication-related functionality, and planner implementation.

`backend/api/engine/space_planner.py`
Contains the main AI Space Planner logic. It processes user requests, works with the configured AI model, determines the required NASA data, and produces the structured planner result.

`backend/api/models.py`
Contains the database models used by the application, including users, Space Plans, and discoveries.

`backend/api/serializers.py`
Contains Django REST Framework serializers used to convert database objects to and from API data.

`backend/api/views.py`
Contains the API views responsible for handling authentication, Space Plan creation, retrieval, and deletion.

`backend/api/urls.py`
Defines the API routes for the Django application.

`backend/api/migrations/`
Contains Django database migrations for the application's models.

### Frontend

`frontend/src/api/`
Contains the Axios configuration and functions used to communicate with the Django backend.

`frontend/src/components/`
Contains reusable React components such as the navigation bar, history sidebar, discovery cards, and other interface components.

`frontend/src/context/`
Contains React context used for application-wide state such as authentication.

`frontend/src/pages/`
Contains the major application pages, including authentication and the main Space Planner interface.

`frontend/src/styles/`
Contains the CSS used to style the application's components and pages.

`frontend/src/types/`
Contains TypeScript type definitions for data received from the backend, including Space Plans and discoveries.

`frontend/src/App.tsx`
Defines the main React application structure and routing.

`frontend/src/main.tsx`
The entry point of the React application.

`frontend/package.json`
Contains the frontend dependencies and scripts required to run the React application.

## How to Run

### Requirements

The following should be installed:

* Python 3
* Node.js and npm
* Git

### 1. Clone the repository

```bash
git clone https://github.com/Tamercan1/ai-nasa-space-planner-cs50w.git
cd ai-space-planner
```

### 2. Set up the backend

```bash
cd backend
python -m venv venv
```

On Windows:

```bash
venv\Scripts\activate
```

On macOS/Linux:

```bash
source venv/bin/activate
```

Install the Python dependencies:

```bash
pip install -r requirements.txt
```

Create the required environment variables for Django, the NASA API, and the configured AI provider.

Run the database migrations:

```bash
python manage.py migrate
```

Start the Django development server:

```bash
python manage.py runserver
```

### 3. Set up the frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend will then be available at the local address provided by Vite.

Both the Django backend and React frontend must be running for the application to function.

## Additional Information

The application requires API credentials for the external services used by the project. These credentials should be stored in environment variables and should not be committed to the repository.

The AI Space Planner expects structured information from the AI layer. Pydantic validation is used to help ensure that the planner output follows the expected structure before it is saved to the database.

The project uses JWT authentication to protect user-specific functionality. A user's saved Space Plans are associated with their account, and backend filtering is used to ensure that users can only access their own plans.

The current version is the **CS50W MVP (v1)**. The project may be developed further after the course with additional deployment, performance, and functionality improvements, but those improvements are outside the scope of this submission.

This project was created as the final project for **CS50's Web Programming with Python and JavaScript (CS50W)**.
