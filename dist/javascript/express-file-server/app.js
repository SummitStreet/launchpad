"use strict";

/* global */
/* eslint-env node */
/* eslint-disable no-console */

var express = require("express");
var app = express();

app.use(express.static(__dirname + "/public"));
console.log("Starting Node/Express file server...");
app.listen(8000);

