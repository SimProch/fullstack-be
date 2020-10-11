const express = require('express');
const router = express.Router();
const indexRoute = require("./index");
const usersRoute = require("./users");
const jwtAuthRoute = require("./jwtAuth");
const dashboardRoute = require("./dashboard");

router.use('/', indexRoute);
router.use('/users', usersRoute);
router.use('/auth', jwtAuthRoute);
router.use('/dashboard', dashboardRoute)

module.exports = router;
