const http = require('http')
const url = require('url')
const fs = require('fs')

const replaceHTML = require('./helpers/replaceHTML')

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
                let cards = parsedData.map((product) => replaceHTML(cardHTML, product)).join('')
                const output = overviewHTML.replace(/{__CARD__}/g, cards)
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

            let replacedProductHTML = replaceHTML(productHTML, selectedFruit)

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
