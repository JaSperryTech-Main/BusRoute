// api/index.js
const app = require("../index"); // Import your Express app
const serverless = require("serverless-http"); // Serverless HTTP for Express
module.exports.handler = serverless(app); // Export handler for Vercel
