module.exports = (html, product) => {
    const { id, productName, image, from, nutrients, quantity, price, organic, description } = product
    let replacedHTML = html
        .replace(/{__IMAGE__}/g, image)
        .replace(/{__TITLE__}/g, productName)
        .replace(/{__QUANTITY__}/g, quantity)
        .replace(/{__PRICE__}/g, price)
        .replace(/{__ID__}/g, id)
        .replace(/{__FROM__}/g, from)
        .replace(/{__DESCRIPTION__}/g, description)
        .replace(/{__NUTRIENTS__}/g, nutrients)

    if (!organic) {
        replacedHTML = replacedHTML.replace(/{__IS__ORGANIC__}/g, 'not-organic')
    }

    return replacedHTML
}
