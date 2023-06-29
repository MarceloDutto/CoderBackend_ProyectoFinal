//document selectors
const purchaseButton = document.querySelector("#purchase-button");

if(purchaseButton) {
    purchaseButton.addEventListener('click', e => {
        const cartId = purchaseButton.getAttribute('cart-id');
        e.preventDefault();

        const url = `/api/carts/${cartId}/purchase`;
        const method = 'GET';
        const headers = {
            'Content-Type': 'application/json'
        }

        fetch(url, {
            headers,
            method
        })
        .then(response => response.json())
        .then(data => {
            if(data.status === 'error') {
                console.log(data.message, data.payload);
                return
            } 
            console.log(data.message, data.payload)
        })
        .catch(error => console.log(error))
    });
};