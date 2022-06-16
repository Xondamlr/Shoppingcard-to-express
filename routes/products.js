const express = require('express')
const router = express.Router()
const Joi = require('joi')
const authMiddleware = require('../middleware/auth')
const Products = require('../model/Products')
const Card = require("../model/Card");

// View all books
router.get('/', async (req, res) => {
    const products = await Products.getAll()
    const card = await Card.getCard();
    res.render('products', {
        card,
        title: 'All products',
        products,
    })
})

router.get('/add', async(req, res) => {
    const card = await Card.getCard();
    res.render('formProducts', {
        card,
        title: 'Add new product',
    })
})

// Get book by id
router.get('/:id', async (req, res) => {
    const card = await Card.getCard();
    Products.findById(req.params.id)
        .then(product => {
            res.render('product', {
                card,
                product,
                title: product.name
            })
        })
        .catch(err => {
            console.log(err);
            res.status(400).redirect('/404')
        })
})

// POST request
router.post('/add', authMiddleware, async (req, res) => {
    // Baza chaqiramiz
    // let allBooks = books  // []

    // Validatsiya // hiyalaymiz
    let productSchema = Joi.object({
        name: Joi.string().min(3).required(),
        img: Joi.string(),
        price: Joi.number().integer().required()
    })

    const result =  productSchema.validate(req.body)
    // console.log(!!result.error);  // error bor bo'lsa true yo'q bo'lsa false deydi

    if (result.error) {
        res.status(400).send(result.error.message);
        return
    }

    const product = new Products(
        req.body.name,
        req.body.price,
        req.body.img,
        
       
    )

    await product.save()
    res.status(201).redirect('/api/products')
})

router.get('/update/:id', authMiddleware, async (req, res) => {
    const oldProduct = await Products.findById(req.params.id)
    const card = await Card.getCard();
    res.render('updateproduct', {
        card,
        oldProduct,
        title: oldProduct.name
    })
})

// Update book
router.post('/update/', authMiddleware, async (req, res) => {
    // Validatsiya // hiyalaymiz
    let productSchema = Joi.object({
        name: Joi.string().min(3).required(),
        img: Joi.string(),
        id: Joi.string(),
        price: Joi.number().integer().required()
    })

    validateBody(req.body, productSchema, res)

    await Products.updateById(req.body.id, req.body)
    res.redirect('/api/products')
})

// Remove book
router.get('/remove/:id', authMiddleware, async (req, res) => {
    const id = req.params.id
    Products.removeById(id).then(() => {
        res.redirect('/api/products')
    }).catch(err => {
        console.log(err)
        res.redirect('/404')
    })
})

function validateBody(body, productSchema, res) {
    const result = productSchema.validate(body)
    // console.log(!!result.error);  // error bor bo'lsa true yo'q bo'lsa false deydi

    if (result.error) {
        res.status(400).send(result.error.message);
        return
    }
}

module.exports = router