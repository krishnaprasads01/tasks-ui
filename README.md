# Task Management UI

A modern React TypeScript application for managing tasks, built with Vite and designed for deployment on Google Cloud Platform (GCP).

## Features

- 📋 **Task Management**: Create, read, update, and delete tasks
- 🔍 **Search & Filter**: Search tasks by title/description and filter by status  
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile devices
- 🚀 **Modern Stack**: Built with React 18, TypeScript, and Vite
- ☁️ **Cloud-Ready**: Optimized for GCP deployment with GitHub Actions
- 🎨 **Beautiful UI**: Clean, modern interface with intuitive navigation

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v6
- **State Management**: TanStack Query (React Query)
- **HTTP Client**: Axios
- **Styling**: CSS3 with CSS Variables
- **Deployment**: Docker + Google Cloud Run
- **CI/CD**: GitHub Actions

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Backend API running (Spring Boot API)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
# The .env.development file is already configured
# Update VITE_API_BASE_URL if your API runs on a different port
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run build:gcp` - Build optimized for GCP deployment

## API Integration

This application integrates with the Spring Boot Task API with the following endpoints:

- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/{id}` - Get task by ID
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task
- `GET /api/tasks/status/{status}` - Get tasks by status
- `GET /api/tasks/search?keyword={keyword}` - Search tasks

### Task Object Structure

```typescript
interface Task {
  id: number;
  title: string;
  description?: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
}
```

## Deployment to Google Cloud Platform

### Prerequisites

1. **GCP Project Setup**:
   - Create a GCP project
   - Enable Cloud Run and Container Registry APIs
   - Create a service account with necessary permissions

2. **GitHub Secrets Setup**:
   Add these secrets to your GitHub repository:
   - `GCP_PROJECT_ID`: Your GCP project ID
   - `GCP_SA_KEY`: Service account JSON key
   - `API_BASE_URL`: Your deployed API URL (e.g., https://your-api.run.app/api)

### Automatic Deployment

The GitHub Actions workflow (`.github/workflows/deploy.yml`) automatically deploys to GCP when you push to the `main` branch:

1. Runs tests and builds the application
2. Creates a Docker image
3. Pushes to Google Container Registry
4. Deploys to Cloud Run

## Project Structure

```
src/
├── api/                 # API client and configuration
├── components/          # React components
│   ├── TaskList.jsx    # Main task listing
│   ├── TaskForm.jsx    # Create/edit tasks
│   ├── TaskDetail.jsx  # Task details view
│   ├── TaskCard.jsx    # Individual task card
│   └── common/         # Shared components
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── App.jsx            # Main app component
└── main.jsx           # Application entry point
```

## Development

### Running with Backend API

1. Start your Spring Boot API on port 8080
2. Start the React development server:
```bash
npm run dev
```

### Running with Docker

#### Option 1: Using Docker directly

```bash
# Build the Docker image
docker build -t tasks-ui .

# Run the container (standalone)
docker run --rm -p 3000:8080 \
  -e API_BASE_URL=https://springboot-gcp-api-service-b02c0d80-1005440968570.us-central1.run.app/api \
  -e PORT=8080 \
  tasks-ui
```

#### Option 2: Using Docker Compose (Recommended)

```bash
# Start both UI and API services
docker-compose up --build

# Stop services
docker-compose down
```

The UI will be available at `http://localhost:3000`

#### Environment Variables

- `API_BASE_URL`: Backend API URL (default: `https://springboot-gcp-api-service-b02c0d80-1005440968570.us-central1.run.app/api`)
- `PORT`: Port the nginx server listens on (default: `8080`)
- `VITE_APP_ENV`: Application environment (development/production)

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -m 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request
