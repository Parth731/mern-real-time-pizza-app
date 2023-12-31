const express = require('express')
const ejs = require('ejs')
const path = require('path')
const expressLayout = require('express-ejs-layouts')


// constant
const app = express()
const PORT = process.env.PORT || 3300
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// set Template engine
app.use(expressLayout)
app.set('views', path.join(__dirname, '/resources/views'))
app.set('view engine', 'ejs')



// Assets
app.use(express.static('public'))

// routes
app.use("/home", (req, res) => {
    res.render("home")
})

app.use("/cart", (req, res) => {
    res.render("customers/cart")
})

app.use("/login", (req, res) => {
    res.render("auth/login")
})

app.use("/register", (req, res) => {
    res.render("auth/register")
})



app.listen(PORT, () => {
    console.log(`listing on port ${PORT}`);
})
