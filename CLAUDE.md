# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a workout tracking application with a Node.js/Express backend and vanilla JavaScript frontend. Users can create and manage exercises and workouts, track sets/reps/weights, and monitor their training progress.

## Running the Application

### Local Development
```bash
node server.js
```
Server runs on port 5507 by default (configurable via PORT environment variable).

### Docker
```bash
docker build -t entrainement .
docker run -p 5507:5507 entrainement
```

### Environment Variables
Create a `.env` file with:
- `DB`: MongoDB connection string (e.g., `mongodb://localhost:27017/Entrainement`)
- `OPENWEBUI_API_KEY`: OpenAI API key (for AI helper functionality)
- `OPENWEBUI_URL`: OpenAI API base URL

## Architecture

### Backend Structure

**Server Entry Point**: `server.js`
- Express server with CORS enabled
- Serves static files from `public/` directory
- Routes mounted at `/workouts` and `/exercises`

**Database Layer**:
- `mongooseConnect.js`: Establishes MongoDB connection on startup
- `workoutModel.js`: Workout schema with exercises array, completion tracking
- `exerciseModel.js`: Exercise schema with sets array, movement type, rest intervals
- Custom `_id` field uses epoch timestamps (not MongoDB ObjectIds)

**API Routes**:
- `routes/workout.js`: CRUD operations for workouts
  - `POST /workouts/` - List all workouts for user
  - `POST /workouts/view/:workoutid` - Get single workout
  - `POST /workouts/add` - Create workout
  - `POST /workouts/update` - Update workout
  - `POST /workouts/delete` - Delete workout
  - `POST /workouts/find` - Search workouts by name (regex)
- `routes/exercise.js`: CRUD operations for exercises (similar endpoints)

**AI Integration**:
- `aiHelper.js`: OpenAI client configured for custom base URL (OpenWebUI compatible)

### Frontend Structure

**Client-Side Architecture**:
- Vanilla JavaScript with jQuery
- LocalStorage used for client-side state management and caching
- Multi-page application with full page navigation

**HTML Pages** (in `public/views/`):
- `index.html` - Landing/home page
- `workoutList.html` - Browse all workouts
- `workout.html` - Create/edit workout
- `exerciseList.html` - Browse all exercises
- `exercise.html` - Create/edit exercise
- `workingOut.html` - Active workout session interface

**JavaScript Organization** (in `public/js/`):
- `APIs/` - Backend communication layer
  - `exercise.js` - Exercise CRUD fetch calls
  - `workout.js` - Workout CRUD fetch calls
- `root/` - Shared utilities across pages
  - `models.js` - Object factories, array management, data enhancement
  - `utilities.js` - Helper functions
  - `translation.js` - I18n support
  - `templates.js` - HTML template generators
  - `buttons.js` - Common button handlers
  - `hamburger.js` - Mobile menu
  - `jQuery.js`, `jquery.min.js` - jQuery library
- Page-specific modules (e.g., `exercisePage/`, `workoutPage/`, `workingOut/`)
  - `init.js` - Page initialization
  - `handler.js` - Event handlers
  - `template.js` - Page-specific templates

### Data Flow

1. **User Management**: User identifier stored in `localStorage.getItem('user')`
2. **Data Fetching**: On page load, client fetches exercises first, then workouts (chained)
3. **LocalStorage Cache**: Both exercises and workouts arrays cached in localStorage
4. **Object Enhancement**: Client adds methods (`update()`, `add()`, `delete()`) to domain objects after fetching
5. **Current Object Pattern**: Active workout/exercise stored as `currentWorkout`/`currentExercise` in localStorage
6. **Backup Pattern**: Temp objects (`tempWorkout`/`tempExercise`) store state for cancel operations

### Key Patterns

**Custom IDs**: Uses epoch timestamps for `_id` instead of MongoDB ObjectIds
```javascript
let newID = Math.floor(+new Date());
```

**Object Cleaning**: Before sending to backend, remove client-side methods and properties:
```javascript
delete obj.type;
delete obj.label;
delete obj.update;
delete obj.add;
delete obj.delete;
```

**Workout-Exercise Relationship**:
- Workouts contain an `exercises` array of exercise `_id` references
- When deleting exercise, must clean references from all workouts (`deleteDeadExerciseFromWorkouts()`)

**Active Workout Session**:
- `workingOut.html` handles active workout sessions
- Tracks set completion in real-time
- `silentExerciseUpdate()` saves progress without navigation
- Custom numpad interface in `workingOut/numPad.js`
- Chronometer functionality in `workingOut/chrono.js`

## Database Schema

### Workout Collection
- `_id`: Number (epoch timestamp)
- `name`: String
- `active`: Number (0 or 1)
- `completed`: Number (0 or 1)
- `lastUpdate`: String (date)
- `completedDate`: String (date)
- `exercises`: Array of exercise IDs
- `user`: String (user identifier)

### Exercise Collection
- `_id`: Number (epoch timestamp)
- `name`: String
- `movement`: String (exercise type/category)
- `active`: Number (0 or 1)
- `lastUpdate`: String (date)
- `restInterval`: Number (seconds)
- `sets`: Array of set objects `{weight, reps, completed, lastUpdate}`
- `user`: String (user identifier)

## Important Notes

- All API endpoints use POST method (even for read operations)
- User filtering is handled by passing `user` field in request body
- Frontend uses full page navigation (no SPA routing)
- jQuery is used throughout the frontend
- No test suite currently exists (`npm test` exits with error)
