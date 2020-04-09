const http = require('http')
const url = require('url')
const fs = require('fs')

const PORT = process.env.PORT || 4000

const overviewHTML = fs.readFileSync('./templates/overview.html', 'utf-8')
const productHTML = fs.readFileSync('./templates/product.html', 'utf-8')

const server = http.createServer((req, res) => {
    // url.parse 의 두 번째 인자로 true 값을 주면, querystring의 값이 객체로 파싱된다.
    const { pathname, query } = url.parse(req.url, true)

    if (pathname === '/' || pathname === '/overview') {
        res.end(overviewHTML)
    } else if (pathname === '/product') {
        res.end(productHTML)
    } else {
        res.end('404 page not found')
    }
})

server.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})