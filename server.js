// const express = require('express')
import express from 'express';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import expressLayout from 'express-ejs-layouts';


// constant
const app = express()
const PORT = process.env.PORT || 3300
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// routes
app.use("/", (req, res) => {
    res.render("home")
})


// set Template engine
app.use(expressLayout)
app.set('views', join(__dirname, '/resources/views'))
app.set('view engine', 'ejs')

app.listen(PORT, () => {
    console.log(`listing on port ${PORT}`);
})
