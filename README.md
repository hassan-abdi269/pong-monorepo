# Pong Monorepo

A Pong game with React/Vite/Tailwind web, React Native/Expo mobile, shared JavaScript game logic, and a Flask/SQLite API.

## Requirements

- Node.js 18+
- Python 3.11+
- Pipenv
- Expo Go (for physical-device mobile testing)

## Run the backend

```bash
cd backend
pipenv install
pipenv run python app.py
```

The API runs at `http://localhost:5000`.

## Run the web app

```bash
cd web
npm install
npm run dev
```

The web app runs at the Vite URL, usually `http://localhost:5173`.

## Run the mobile app

```bash
cd mobile
npm install
npm start
```

For a physical phone, set `EXPO_PUBLIC_API_URL` to the computer's LAN IP, for example:

```bash
EXPO_PUBLIC_API_URL=http://192.168.1.25:5000/api npm start
```

The mobile player controls the left paddle by dragging. The web player can use the mouse or arrow keys.
