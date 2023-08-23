# Google-OAuth-2.0
# User Authentication & Authorization Web App

This is a web application built using Express.js and Passport.js that implements user authentication and authorization. Users can register, log in, and submit secrets that can be viewed by authenticated users.

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)

## Features

- User registration and login using local authentication strategy.
- Google OAuth2.0 authentication for easy sign-in with Google accounts.
- Users can submit their secrets after logging in.
- Users can view secrets submitted by other authenticated users.

## Getting Started

1. **Clone the Repository**:
git clone https://github.com/harshabapatla/Google-OAuth-2.0.git
cd your-repo-name

2. **Install Dependencies**:
npm install


3. **Set Up Environment Variables**:
Rename the `.env.example` file to `.env` and fill in the required credentials, such as Google OAuth2.0 client ID and secret.

4. **Start the Server**:
npm start

5. **Access the App**:
Open your web browser and go to `http://localhost:3000` to access the application.

## Usage

- Register a new user account or log in with an existing one.
- Use the Google OAuth2.0 authentication option for quick sign-in.
- Submit secrets that will be displayed to other authenticated users.
- Log out to end the session.

## Technologies Used

- Express.js: Web application framework.
- EJS: Embedded JavaScript for templating.
- MongoDB: Database for storing user data and secrets.
- Passport.js: Authentication middleware for user authentication.
- Google OAuth2.0: Authentication strategy for Google sign-in.

## Contributing

Contributions are welcome! If you find any issues or want to add improvements, please create a pull request.
