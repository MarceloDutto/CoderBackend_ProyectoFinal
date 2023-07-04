//document selectors
const purchaseButton = document.querySelector("#purchase-button");
const emptyCartButton = document.querySelector("#empty-cart")
const deleteProductBtns = document.querySelectorAll(".btn-delete-product")
console.log(deleteProductBtns)


//event listeners
if(purchaseButton) {
    const cartId = purchaseButton.getAttribute('cart-id');
    purchaseButton.addEventListener('click', e => {
        console.log(cartId)
        e.preventDefault();
        
        const url = `/api/carts/${cartId}/purchase`;
        const method = 'GET';
        const headers = {
            'Content-Type': 'application/json'
        };

        fetch(url, {
            headers,
            method
        })
        .then(response => response.json())
        .then(data => {
            if(data.status === 'error') {
                console.log(data.message, data.payload);
                Swal.fire({
                    text: data.message,
                    icon: "error"
                })
                return
            }
            console.log(data.message, data.payload)
            Swal.fire({
                text: data.message,
                icon: "success"
            })
            .then((result) => {
                if(result.isConfirmed) {
                    window.location.href = `/cart/ticket/${data.payload.code}`
                }
            })
        })
        .catch(error => console.log(error))
    });
};

if(emptyCartButton) {
    const cartId = purchaseButton.getAttribute('cart-id');
    emptyCartButton.addEventListener('click', e => {
        e.preventDefault();

        const url = `/api/carts/${cartId}`;
        const method = 'DELETE';
        const headers = {
            'Content-Type': 'application/json'
        };

        fetch(url, {
            headers,
            method
        })
        .then(response => response.json())
        .then(data => {
            console.log(data.message);
            Swal.fire({
                text: `El carrito ha sido vaciado`,
                toast: true,
                position: "bottom-right",
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: false,
                icon: "success"
            });
            setTimeout(() => {
                window.location.reload()
            }, 1000);

            
        })
        .catch(error => console.log(error))
    });
};

if(deleteProductBtns.length > 0) {
    deleteProductBtns.forEach(btn => {
        btn.addEventListener('click', e => {
            e.preventDefault();
            const cartId = purchaseButton.getAttribute('cart-id');
            const prodId = btn.getAttribute("prodId");
    
            deleteProduct(cartId, prodId);
        });
    });
}

const deleteProduct =  async (cid, pid) => {
    const url = `/api/carts/${cid}/product/${pid}`;
    const method = 'DELETE';
    const headers = {
        'Content-Type': 'application/json'
    };
    
    fetch(url, {
        headers,
        method
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.message);
        Swal.fire({
            text: `El producto se eliminó del carrito`,
            toast: true,
            position: "bottom-right",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: false,
            icon: "success"
        });
        setTimeout(() => {
            window.location.reload()
        }, 1000);
    })
    .catch(error => console.log(error))
};
