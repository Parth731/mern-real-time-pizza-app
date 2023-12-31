const express = require('express')
const ejs = require('ejs')
const path = require('path')
const expressLayout = require('express-ejs-layouts')


// constant
const app = express()
const PORT = process.env.PORT || 3300
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// Assets
app.use(express.static('public'))

// routes
app.use("/", (req, res) => {
    res.render("home")
})


// set Template engine
app.use(expressLayout)
app.set('views', path.join(__dirname, '/resources/views'))
app.set('view engine', 'ejs')

app.listen(PORT, () => {
    console.log(`listing on port ${PORT}`);
})
