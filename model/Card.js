const { CallTracker } = require('assert')
const fs = require('fs')
const path = require('path')

const dir = path.join(__dirname, '..', 'data', 'card.json')

class Card {
    static async add(product) {
        let card = await Card.getCard()
        const idx = card.products.findIndex(item => item.id === product.id) // agar yo'q bo'sa -1

        if (idx === -1) {
            // demak kitob baza yo'q uni cout = 1 qilib yangi object qilib qo'shamiz
            product.count = 1
            card.products.push(product)
        } else {
            // demak idx qandaydur index kalit (idx = 2) kitob bazada bor // faqat count ni +1
            product.count = card.products[idx].count + 1
            card.products[idx] = product
        }
        
        card.price = card.price + +product.price
        card.count += 1
        
        return new Promise((res, rej) => {
            fs.writeFile(dir, JSON.stringify(card), (err) => {
                if (err) rej(err)
                else res()
            })
        })
    }

    static async getCard() {
        return new Promise((res, rej) => {
            fs.readFile(dir, 'utf-8', (err, data) => {
                if (err) rej(err)
                else res(JSON.parse(data))
            })
        })
    }

    static async removeById(id) {
        const card = await Card.getCard() // {books[], price}

        const idx = card.products.findIndex(product => product.id === id)

        card.price = card.price - +card.products[idx].price
        
        if (card.products[idx].count === 1) {
            // demak kitob soni 1 ta uni baza o'chiramiz
            card.products = card.products.filter(product => product.id !== id)
        } else {
            // demak kitob 1 tadan ko'p uni sonini 1 ga kamaytiramiz
            card.products[idx].count--
        }
        if(card.products.length > 0){
            card.count--
        }
      
        return new Promise((res, rej) => {
            fs.writeFile(dir, JSON.stringify(card), (err) => {
                if (err) rej(err)
                else res(card)
            })
        })

    }
}

module.exports = Card