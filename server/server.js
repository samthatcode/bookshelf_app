const express = require('express');
const cors = require('cors');
require('dotenv').config();

const path = require('path');
const { OAuth2Client } = require('google-auth-library');
const UserRoute = require('./routes/api/UserRoute');
const apiRoute = require('./routes/api/ApiRoute');

const { connectWithRetry } = require('./config/connection');
// Retrieve client id and client secret from environment variables
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

const app = express();
const PORT = process.env.PORT || 3000;


// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
    cors({
        // origin: ["https://bookshelf-registry.onrender.com", "https://bookshelf-registry-backend-server.onrender.com"],
        origin: ["http://localhost:5173", "http://localhost:3000"],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
);

// const redirectUrl = `http://localhost:3000/oauth2callback`
// const redirectUrl = `https://bookshelf-registry-backend-server.onrender.com/oauth2callback`

// Define your Google OAuth2Client
const oAuth2Client = new OAuth2Client(
    CLIENT_ID,
    CLIENT_SECRET,
    'postmessage',
);

const scopes = ['https://www.googleapis.com/auth/userinfo.profile openid', 'https://www.googleapis.com/auth/books'];

// Redirect users to Google OAuth authentication
app.get('/', (req, res) => {
    const authorizationUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
        prompt: 'consent',
        // Enable incremental authorization. Recommended as a best practice.
        include_granted_scopes: true
    });

    // console.log('Authorization URL:', authorizationUrl);
    res.redirect(authorizationUrl);
    // res.json({ url: authorizationUrl });
});


// Obtain user data using the access token
const getUserData = async (access_token) => {
    try {
        const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo`, {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        });

        if (response.ok) {
            const userData = await response.json();
            // console.log("User Data:", userData);
            return userData;
        } else {
            throw new Error('Failed to fetch user data');
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
};


// Callback route for handling OAuth response from Google
app.post('/oauth2callback', async (req, res) => {
    const code = req.body.code;

    try {
        // Exchange authorization code for access token
        const tokenResponse = await oAuth2Client.getToken(code);
        // console.log("Token Response", tokenResponse.tokens);

        const accessToken = tokenResponse.tokens.access_token;
        // console.log("Access Token", accessToken);

        // Set the obtained credentials on the OAuth2 client
        await oAuth2Client.setCredentials(accessToken);

        // Check if the access token is expiring soon
        if (oAuth2Client.isTokenExpiring()) {
            // Refresh the access token
            const { credentials } = await oAuth2Client.refreshAccessToken();
            // Set the refreshed credentials on the OAuth2 client
            oAuth2Client.setCredentials(credentials);
        }

        // Get user data using the refreshed access token
        const userData = await getUserData(accessToken);
        // console.log("User Data:", userData);       


        // Here you can do something with the user data, such as saving it to a database or returning it in the response
        res.json(userData);
    } catch (error) {
        console.error('Error handling OAuth callback:', error);
        res.status(500).send('Error handling OAuth callback');
    }
});

// Routes
app.use('/api/v1', UserRoute);
app.use('/api/v1', apiRoute);

// Start server
const startServer = async () => {
    try {
        await connectWithRetry(); // Connect to database
        app.listen(PORT, () => {
            console.log(`🌍 Now listening on port ${PORT}`);
        });
    } catch (error) {
        console.error('Error starting server:', error);
        process.exit(1); // Exit the process if connection fails
    }
};

startServer();
