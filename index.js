const http = require('http')
const url = require('url')
const fs = require('fs')

const PORT = process.env.PORT || 4000

const cardHTML = fs.readFileSync('./templates/card.html', 'utf-8')
const overviewHTML = fs.readFileSync('./templates/overview.html', 'utf-8')
const productHTML = fs.readFileSync('./templates/product.html', 'utf-8')

const server = http.createServer((req, res) => {
    // url.parse 의 두 번째 인자로 true 값을 주면, querystring의 값이 객체로 파싱된다.
    const { pathname, query } = url.parse(req.url, true)

    if (pathname === '/' || pathname === '/overview') {
        fs.readFile('./mocks/db.json', 'utf-8', (err, data) => {
            if (err) {
                res.writeHead(500).end('eternal server error')
            } else {
                const parsedData = JSON.parse(data)
                let cards = ''
                parsedData.map(({ id, productName, image, from, nutrients, quantity, price, organic, description }) => {
                    let replacedCardHTML = cardHTML
                        .replace(/{__CARD__IMGAGE__}/g, image)
                        .replace(/{__CARD__TITLE__}/g, productName)
                        .replace(/{__CARD__QUANTITY__}/g, quantity)
                        .replace(/{__CARD__PRICE__}/g, price)
                        .replace(/{__CARD__ID__}/g, id)

                    if (!organic) {
                        replacedCardHTML = replacedCardHTML.replace('{__IS__ORGANIC__}', 'not-organic')
                    }

                    cards += replacedCardHTML
                })

                const output = overviewHTML.replace('{__CARD__}', cards)
                res.writeHead(200, {
                    'Content-Type': 'text/html',
                }).end(output)
            }
        })
    } else if (pathname === '/product') {
        const { id } = query

        fs.readFile('./mocks/db.json', 'utf-8', (err, data) => {
            const parsedData = JSON.parse(data)

            const selectedIdx = parsedData.findIndex((d) => d.id === parseInt(id, 10))
            const selectedFruit = parsedData[selectedIdx]
            const { productName, image, from, nutrients, quantity, price, organic, description } = selectedFruit

            let replacedProductHTML = productHTML
                .replace(/{__PRODUCT__IMAGE__}/g, image)
                .replace(/{__PRODUCT__TITLE__}/g, productName)
                .replace(/{__PRODUCT__QUANTITY__}/g, quantity)
                .replace(/{__PRODUCT__PRICE__}/g, price)
                .replace(/{__PRODUCT__ID__}/g, id)
                .replace(/{__PRODUCT__FROM__}/g, from)
                .replace(/{__PRODUCT__DESCRIPTION__}/g, description)
                .replace(/{__PRODUCT__NUTRIENTS__}/g, nutrients)

            res.writeHead(200, {
                'Content-Type': 'text/html',
            })
            res.end(replacedProductHTML)
        })
    } else {
        res.writeHead(404)
        res.end('404 page not found')
    }
})

server.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})
