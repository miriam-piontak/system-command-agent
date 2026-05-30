// Server setup for the System Command Agent backend.
// This file configures Express middleware, enables CORS, and mounts the agent route.
const express = require('express');
const cors = require('cors');
const agentRoute = require('./routes/agent.route');
const errorHandler = require('./utils/error-handler');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/agent', agentRoute);

app.use(errorHandler);

module.exports = app;
