"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | CLARUSWAY FullStack Team
------------------------------------------------------- */
//* Project Starter Command
/*
    $ cp .env-sample .env
    $ npm init -y
    $ npm i express dotenv mongoose express-async-errors
    $ npm i morgan swagger-autogen swagger-ui-express redoc-express
    $ mkdir logs
    $ nodemon
*/
//* Use _projectStarter folder
/*
    $ cp .env-sample .env
    $ mkdir logs
    $ npm install
    $ nodemon
*/

const express = require("express");
const app = express();

/* ------------------------------------------------------- */
// Required Modules:

// envVariables to process.env:
require("dotenv").config();
const PORT = process.env?.PORT || 8000;

// asyncErrors to errorHandler:
require("express-async-errors");

/* ------------------------------------------------------- */
// Configrations:

// Connect to DB:
const { dbConnection } = require("./src/configs/dbConnection");
dbConnection();

/* ------------------------------------------------------- */
// Middlewares:

// Accept JSON:
app.use(express.json());

// Logger:
app.use(require("./src/middlewares/logging"));

// Auhentication:
app.use(require("./src/middlewares/authentication"));

// findSearchSortPage / res.getModelList:
app.use(require("./src/middlewares/queryHandler"));

/* ------------------------------------------------------- */

//Email:

const nodemailer = require("nodemailer");

// nodemailer.createTestAccount().then((data) => console.log(data));
// {
//   user: 'i6lewdenbhtzvkf6@ethereal.email',
//   pass: 'y1gcZwxrGxcZ8zZrNC',
//   smtp: { host: 'smtp.ethereal.email', port: 587, secure: false },
//   imap: { host: 'imap.ethereal.email', port: 993, secure: true },
//   pop3: { host: 'pop3.ethereal.email', port: 995, secure: true },
//   web: 'https://ethereal.email',
//   mxEnabled: false
// }
const transporter = nodemailer.createTransport({
	host: "smtp.ethereal.email",
	port: 587,
	secure: false, // Use `true` for port 465, `false` for all other ports
	auth: {
		user: "i6lewdenbhtzvkf6@ethereal.email",
		pass: "y1gcZwxrGxcZ8zZrNC",
	},
});
/* ------------------------------------------------------- */
// Routes:

// HomePath:
app.all("/", (req, res) => {
	res.send({
		error: false,
		message: "Welcome to PIZZA API",
		docs: {
			swagger: "/documents/swagger",
			redoc: "/documents/redoc",
			json: "/documents/json",
		},
		user: req.user,
	});
});

// routes/index.js:
//app.use(require('./src/routes/'))//* default yazmadığımızda kök route u esas alır.
app.use("/", require("./src/routes/"));

//* eşleşmeyen routeları yakalar
app.use((req, res, next) => {
	res.status(404).send({
		error: true,
		message: "Route not found!",
	});
});

/* ------------------------------------------------------- */

// errorHandler:
app.use(require("./src/middlewares/errorHandler"));

// RUN SERVER:
app.listen(PORT, () => console.log("http://127.0.0.1:" + PORT));

/* ------------------------------------------------------- */
// Syncronization (must be in commentLine):
// require('./src/helpers/sync')() // !!! It clear database.
