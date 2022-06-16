const express = require("express")
const app = express()
const path = require('path')
const { create } = require('express-handlebars')
// Importing routes
const homeRouter = require('./routes/home')
const aboutRouter = require('./routes/about')
const productsRouter = require('./routes/products')
const cardRouter = require('./routes/card')
// Hbs working
const exhbs = create({
    extname: 'hbs',
    defaultLayout: 'layout',
    runtimeOptions: {
        allowProtoMethodsByDefault: true,
        allowProtoPropertiesByDefault: true
    }
})
// View engine
app.engine('hbs', exhbs.engine)
app.set('view engine', 'hbs');
app.set('views', './views');
// Static folder
app.use(express.static(path.join(__dirname, 'public')))
// Middlewares 
const authMiddleware = require('./middleware/auth')
// app.use(authMiddleware)
// json format
app.use(express.json()) 
// urlencoded request
app.use(express.urlencoded({ extended: true }))
// Routing
app.use('/404', (req, res) => {
    res.render('404', {
        title: 404
    })
})
app.use('/', homeRouter)
app.use('/about', aboutRouter)
app.use('/api/products', productsRouter)
app.use('/api/card', cardRouter)
try{
    const port = process.env.PORT || 7777
 app.listen(port, ()=> {
    console.log('Server working on port', port);
 })
}catch (error){
    console.error(error);
}