//document selectors
const productContainer = document.querySelector(".product-container");

//get product id from URL queries
const productURL = new URL(window.location.href);
const path = productURL.pathname;
const pathSections = path.split('/');
const pid = pathSections[pathSections.length - 1];

//got to cart button funcionality
const goToCartButton = document.querySelector(".goToCartButton");
const cartId = goToCartButton.getAttribute("id");
goToCartButton.setAttribute("href", `/cart/${cartId}`);

// product managment functions
let product;
const getProduct = async (pidRef) => {
    const url = `/api/products/` + pidRef;
    const headers = {
        'Content-Type': 'application/json'
    };
    const method = 'GET';

    fetch(url, {
        headers,
        method
    })
    .then(response => response.json())
    .then(data => {
        product = data.payload;
        showProduct()
    })
    .catch(error => console.log(error))
};

const showProduct = () => {
    if(!product) {
        productContainer.innerHTML = `<p class="error-text">¡Lo sentimos! Momentámeamente no podemos mostrarte este producto. Regresa más tarde. 😔</p>`
        return;
    }

    const productCard = document.createElement("div");
    productCard.classList.add("card");
    productCard.innerHTML = 
    `<div class="product-image">
        <img src="${product.thumbnail[0]}" alt="Imagen de ${product.name}">
    </div>
    <div class="product-info">
        <p class="product-features"><strong>Nombre: ${product.name}</strong></p>
        <p class="product-features">Características:  ${product.description}</p>
        <p class="product-features">Categoría:  ${product.category}</p>
        <p class="product-features">Precio:  ${product.price.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        <p class="product-features">Disponible:  ${product.stock} unidades</p>
    </div>
    <div class="actions">
        <button class="cartButton" id="${product.id}">Agregar al carrito</button>
    </div>`
    productContainer.appendChild(productCard);

    const btn_addToCart = document.querySelector(".cartButton");

    btn_addToCart.addEventListener('click', e => {
        e.preventDefault();
        const eventId = btn_addToCart.getAttribute("id");
        addToCart(eventId);
    });
};

const addToCart = async (pid) => {
    try {
        const url = `/api/carts/${cartId}/product/${pid}`;
        const headers = {
            'Content-Type': 'application/json'
        }
        const method = 'POST';
        
        await fetch(
            url, {
                headers,
                method
            });
    } catch (error) {
        console.log(error);
    }
};


//main functionality runtime
getProduct(pid);



