const cards = document.getElementById('cards')
const items = document.getElementById('items')
const footer = document.getElementById('footer')
const templateCard = document.getElementById('template-card').content
const fragment = document.createDocumentFragment()
const templateFooter = document.getElementById('cart-footer').content
const templateCart = document.getElementById('cart-template').content
let cart = {}

books = [
    {
        "id": 1,
        "title": "El señor de los anillos la comunidad del anillo",
        "author": "J.R.R. Tolkin",
        "editorial": "Minotauro",
        "precio": 273,
        "urlimg": "https://static2planetadelibroscommx.cdnstatics.com/usuaris/libros/fotos/145/original/144084_portada_el-senor-de-los-anillos-i-la-comunidad-del-anillo_j-r-r-tolkien_201505211338.jpg"
    },
    {
        "id": 2,
        "title": "El señor de los anillos las dos torres",
        "author": "J.R.R. Tolkin",
        "editorial": "Minotauro",
        "precio": 293,
        "urlimg": "https://static2planetadelibroscommx.cdnstatics.com/usuaris/libros/fotos/358/original/357931_portada_el-senor-de-los-anillos-n-0203-las-dos-torres-ne_j-r-r-tolkien_202203111314.jpg"
    },
    {
        "id": 3,
        "title": "El señor de los anillos el retorno del rey",
        "author": "J.R.R. Tolkin",
        "editorial": "Minotauro",
        "precio": 313,
        "urlimg": "https://static2planetadelibroscommx.cdnstatics.com/usuaris/libros/fotos/359/original/358921_portada_el-senor-de-los-anillos-n-0303-el-retorno-del-rey-ne_j-r-r-tolkien_202203111320.jpg"
    },
    {
        "id": 4,
        "title": "El Hobbit",
        "author": "J.R.R. Tolkin",
        "editorial": "Minotauro",
        "precio": 250,
        "urlimg": "https://static2planetadelibroscommx.cdnstatics.com/usuaris/libros/fotos/145/original/144737_portada_el-hobbit_j-r-r-tolkien_201505211341.jpg"
    }

]


/*
DOMContentLoaded es un evento que se ejecuta cuando el HTML ha sido completamente cargado. 
*/
document.addEventListener('DOMContentLoaded', () => {
    getProducts()
    if (localStorage.getItem('cart')) {
        cart = JSON.parse(localStorage.getItem('cart'))
        paintCart()
    }
})

cards.addEventListener('click', (e) => {
    addToCart(e)
})

const getProducts = async () => {
    let URL = 'https://fakestoreapi.com/products'
    try {
        const res = await fetch(URL)
        const data = await res.json()

        paintCard(data)
    } catch (error) {
        console.log(error)
    }
}

items.addEventListener('click', (e) => {
    btnAction(e)
})

const paintCard = (data) => {
    data.forEach(product => {
        // templateCard.querySelector('img').setAttribute('src', product.image)
        templateCard.querySelector('h3').textContent = product.title
        templateCard.querySelector('p').textContent = product.price
        templateCard.querySelector('.btn-add').dataset.id = product.id
        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    });
    cards.appendChild(fragment)
}

const addToCart = (e) => {
    if (e.target.classList.contains('btn-add')) {
        // obtiene todo el div con los datos del producto
        product = e.target.parentElement
        setCart(product)
    }
    e.stopPropagation()
}

const setCart = (product) => {
    const objProduct = {
        id: product.querySelector('.btn-add').dataset.id,
        title: product.querySelector('h3').textContent,
        price: product.querySelector('p').textContent,
        amount: 1
    }

    if (cart.hasOwnProperty(objProduct.id)) {
        objProduct.amount = cart[objProduct.id].amount + 1
    }

    cart[objProduct.id] = { ...objProduct } // se copia el obj
    paintCart()
}

const paintCart = () => {
    items.innerHTML = ''
    Object.values(cart).forEach(product => {
        templateCart.querySelector('th').textContent = product.id
        templateCart.querySelectorAll('td')[0].textContent = product.title
        templateCart.querySelectorAll('td')[1].textContent = product.amount
        templateCart.querySelector('#btn-more').dataset.id = product.id
        templateCart.querySelector('#btn-less').dataset.id = product.id
        templateCart.querySelector('span').textContent = product.amount * product.price
        const clone = templateCart.cloneNode(true)
        fragment.appendChild(clone)
    })
    items.appendChild(fragment)
    paintFooter()
    localStorage.setItem('cart', JSON.stringify(cart))
}

const paintFooter = () => {
    footer.innerHTML = ''
    if (Object.keys(cart).length === 0) {
        footer.innerHTML = `<th scope="row">Carrito vacío</th>`
        return
    }

    const amountProducts = Object.values(cart).reduce((acc, { amount }) => acc + amount, 0)
    const totalPrice = Object.values(cart).reduce((acc, { amount, price }) => acc + amount * price, 0)

    templateFooter.querySelectorAll('td')[0].textContent = amountProducts
    templateFooter.querySelector('span').textContent = totalPrice

    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)
    footer.appendChild(fragment)

    const btnClear = document.getElementById('btn-clear')
    btnClear.addEventListener('click', () => {
        cart = {}
        paintCart()
    })
}

const btnAction = (e) => {
    if (e.target.classList.contains('btn-more')) {
        const product = cart[e.target.dataset.id]
        product.amount++
        cart[e.target.dataset.id] = { ...product }
        paintCart()
    }

    if (e.target.classList.contains('btn-less')) {
        const product = cart[e.target.dataset.id]
        product.amount--

        if (product.amount === 0) {
            delete cart[e.target.dataset.id]
        }
        paintCart()
    }
    e.stopPropagation()
} 