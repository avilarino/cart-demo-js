const cards = document.getElementById('cards')
const items = document.getElementById('items')
const footer = document.getElementById('footer')
const templateCard = document.getElementById('template-card').content
const templateFooter = document.getElementById('template-footer').content
const templatecarrito = document.getElementById('template-carrito').content
const fragment = document.createDocumentFragment()

let carrito = []

document.addEventListener('DOMContentLoaded', e => { fetchData() });
cards.addEventListener('click', e => { addcarrito(e) });
items.addEventListener('click', e => { btnAumentarDisminuir(e) })

// conexion api 
const fetchData = async () => {
    const res = await fetch('./json/products.json');
    const data = await res.json()
    renderCards(data)
}

const renderCards = data => {
    data.forEach(item => {
        templateCard.querySelector('h5').textContent = item.title
        templateCard.querySelector('p').textContent = item.price
        templateCard.querySelector('button').dataset.id = item.id
        templateCard.querySelector('img').setAttribute('src', item.img)

        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    })
    cards.appendChild(fragment)
}


// primero marcamos la card cards.addEventListener('') le pasamos el evento
// luego buscamos el boton para agregar al carrito
const addcarrito = e => {
    if (e.target.classList.contains('btn-dark')) {
        setcarrito(e.target.parentElement)
    }
    e.stopPropagation()
}

// armoamos el producto le pasamos el item 
const setcarrito = item => {
    const producto = {
        title: item.querySelector('h5').textContent,
        precio: item.querySelector('p').textContent,
        id: item.querySelector('button').dataset.id,
        cantidad: 1
    }
    if (carrito.hasOwnProperty(producto.id)) {
        producto.cantidad = carrito[producto.id].cantidad + 1
    }

    carrito[producto.id] = { ...producto }
    
    renderCart()
}

// armar carrito 

const renderCart = () => {
    items.innerHTML = ''

    Object.values(carrito).forEach(producto => {
        templatecarrito.querySelector('th').textContent = producto.id
        templatecarrito.querySelectorAll('td')[0].textContent = producto.title
        templatecarrito.querySelectorAll('td')[1].textContent = producto.cantidad
        templatecarrito.querySelector('span').textContent = producto.precio * producto.cantidad
        
        // cart buttons !
        templatecarrito.querySelector('.btn-info').dataset.id = producto.id
        templatecarrito.querySelector('.btn-danger').dataset.id = producto.id

        const clone = templatecarrito.cloneNode(true)
        fragment.appendChild(clone)
    
    })
    items.appendChild(fragment)

    renderFooter()
}

const renderFooter = () => {
    footer.innerHTML = ''
    
    if (Object.keys(carrito).length === 0) {
        footer.innerHTML = `
        <th scope="row" colspan="5">Empty carrito</th>
        `
        return
    }
    
    // sumar cantidad y sumar totales
    const nCantidad = Object.values(carrito).reduce((acc, { cantidad }) => acc + cantidad, 0)
    const nPrecio = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + cantidad * precio ,0)
  

    templateFooter.querySelectorAll('td')[0].textContent = nCantidad
    templateFooter.querySelector('span').textContent = nPrecio

    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)

    footer.appendChild(fragment)

    const boton = document.querySelector('#vaciar-carrito')
    boton.addEventListener('click', () => {
        carrito = []
        renderCart()
    })

}

const btnAumentarDisminuir = e => {
 
    if (e.target.classList.contains('btn-info')) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad++
        carrito[e.target.dataset.id] = { ...producto }
        renderCart()
    }

    if (e.target.classList.contains('btn-danger')) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad--
        if (producto.cantidad === 0) {
            delete carrito[e.target.dataset.id]
        } else {
            carrito[e.target.dataset.id] = {...producto}
        }
        renderCart()
    }
    e.stopPropagation()
}













