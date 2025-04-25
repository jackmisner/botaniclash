# 🌿 BotaniClash

A plant-based card game where players battle with plant stats! Players collect plant cards and compete by comparing various attributes like soil pH range, light requirements, and nutrient needs.

## 🎮 About the Game

BotaniClash is a strategic card game using real plant data from the Trefle API. Players:
- Battle with cards representing different plant species
- Choose which plant attribute to compare in each round
- Win cards from opponents when their plant has better stats
- Track their game statistics on the leaderboard

## 🏗️ Project Structure

This repo contains two applications:

- 🖥️ A frontend React App - User interface for the game
- 🔌 A backend API server - Go-based server handling game logic and plant data

These two applications communicate through HTTP requests and need to be run separately.

## 📋 Requirements

- Node.js (v20+) 
- Go (latest version)
- PostgreSQL

## 🚀 Quickstart

### 📥 Install Node.js

If you haven't already, make sure you have node and NVM installed.

1. Install Node Version Manager (NVM)
   ```
   brew install nvm
   ```
   Then follow the instructions to update your `~/.bash_profile`.
2. Open a new terminal
3. Install the latest version of Node.js
   ```
   nvm install 20
   ```

### 📥 Install Go

Follow the instructions here: https://go.dev/doc/install

### 🛠️ Set up your project

1. Have one team member fork this repository
2. Every team member clone the fork to their local machine
3. Install dependencies for both the `frontend` and `api` applications:
   ```
   cd frontend
   npm install
   cd ../api
   go get .
   ```
4. Install an ESLint plugin for your editor, for example
   [ESLint for VSCode](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
5. Start PostgreSQL

   ```
   brew services start postgresql
   ```

6. Create your databases:
   ```
   createdb botaniclash
   createdb botaniclash_test
   ```

### ⚙️ Setting up environment variables

We need to create two `.env` files, one in the frontend and one in the api (and also a .env.test file for the api)

#### Frontend

Create a file `frontend/.env` with the following contents:

```
VITE_BACKEND_URL="http://localhost:8082"
```

#### Backend
You'll need to sign up for a trefle account to get an API key. You must keep this private. Never put your key in any file outside the .env!

Create a file `api/.env` with the following contents:

```
POSTGRES_URL="postgresql://localhost:5432/botaniclash"
JWT_SECRET="secret"
TREFLE_API_TOKEN="your api token here"
```

#### Backend Test Environment

Create a file `api/.env.test` with the following contents:

```
POSTGRES_URL="postgresql://localhost:5432/botaniclash_test"
JWT_SECRET="test_secret"
```

This separate test database ensures your tests don't interfere with your development data.

## 🏃‍♂️ Running the Application

1. Start the server application (in the `api` directory):

```
cd api
go run main.go
```

2. Start the front end application (in the `frontend` directory)

In a new terminal session:

```
cd frontend
npm run dev
```

You should now be able to open your browser and go to `http://localhost:5173/signup` to create a new user.

After signing up, you can log in by going to `http://localhost:5173/login` and start playing!

## 🧪 Running Tests

To run the Go backend tests:

```
cd api
go test ./... | grep -v '\[no test files\]'
```

For verbose output:

```
go test -v ./... | grep -v '\[no test files\]'
```

To force running tests instead of using cached results:

```
go test -count=1 ./... | grep -v '\[no test files\]'
```

## 🙏 Credits
This project uses data from Trefle, a plants API. See their website here: https://trefle.io/

Thank you Trefle!

## 📌 Card Wall
- [link here](https://trello.com/b/KIUyGIWL/botaniclash-board)

## 👥 Contributors
- [@jackmisner](https://github.com/jackmisner)
- [@lukehoweth](LukeHoweth)
- [@abbiefinlayson1](https://github.com/abbiefinlayson1)
- [@Michal-P-1](https://github.com/Michal-P-1)
- [@AMcGill3](https://github.com/AMcGill3)
- [@I-Lovell](https://github.com/I-Lovell)