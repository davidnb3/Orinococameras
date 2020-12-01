
// Declaring variables outside of function scope
let cartItems = JSON.parse(localStorage.getItem('addedCameras'));
const cartContainer = document.querySelector('.cart.container');
const cartHeader = document.getElementById('cartHeader');
const btnContainer = document.querySelector('.button.container');
const clearCartBtn = document.createElement('button');
const cartContent = document.getElementById('cartContent');
const submitBtn = document.querySelector('.submit');
const formContainer = document.querySelector('.form.container');

// Show the cart content
function showCartContent() {
    if (localStorage.getItem('addedCameras') != null) {
        cartHeader.textContent = 'Your Cart';
        // Show clear-cart-button
        clearCartBtn.classList.add('clear-cart-btn');
        clearCartBtn.textContent = 'Clear cart';
        btnContainer.appendChild(clearCartBtn);

        // Show all the products inside the cart
        for (let i in cartItems) {
            let itemContainer = document.createElement('div');
            let itemImg = document.createElement('img');
            let itemName = document.createElement('h3');
            let itemLense = document.createElement('span');
            let itemPrice = document.createElement('span');
            let removeBtn = document.createElement('button');
            
            itemContainer.classList.add('cart-item');
            itemImg.setAttribute('src', cartItems[i].image);
            itemName.textContent = cartItems[i].name;
            itemLense.textContent = cartItems[i].lense;
            itemPrice.textContent = '$' + cartItems[i].price / 100;
            itemContainer.setAttribute('id', cartItems[i].id);
            removeBtn.innerHTML = '<i class="fas fa-times"></i>';


            itemContainer.appendChild(itemImg);
            itemContainer.appendChild(itemName);
            itemContainer.appendChild(itemLense);
            itemContainer.appendChild(itemPrice);
            itemContainer.appendChild(removeBtn);
            cartContent.appendChild(itemContainer);

            removeItem(removeBtn, itemContainer);
        };
    } else {
        cartHeader.textContent = 'Your Cart is empty';
    };
};

showCartContent();


function removeItem(removeBtn, itemContainer) {
    removeBtn.addEventListener('click', (event) => {
        event.preventDefault();
        // get id of elmt cliked
        let product_id = itemContainer.getAttribute('id');
        itemContainer.remove();

        for (let i = 0; i < cartItems.length; i++) {
            if (cartItems[i].id == product_id) {
                cartItems.splice(i, 1);
            };
        };
        
        localStorage.setItem('addedCameras', JSON.stringify(cartItems));

        if (cartItems.length == 0) {
            localStorage.removeItem('addedCameras');
        }
        location.reload();
    });
};


clearCartBtn.addEventListener('click', (event) => {
    event.preventDefault();
    cartContent.remove();
    localStorage.removeItem('addedCameras');
    cartHeader.textContent = 'Your Cart is empty';
    clearCartBtn.style.display = 'none';
    location.reload();
});


// only becomes hidden after refreshing page
if (JSON.parse(localStorage.getItem('addedCameras')) == null) {
    formContainer.style.display = 'none';
};


submitBtn.addEventListener('click', (event) => {
    event.preventDefault();
    const firstName = document.getElementById('firstName');
    const lastName = document.getElementById('lastName');
    const address = document.getElementById('address');
    const city = document.getElementById('city');
    const email = document.getElementById('email');

    let contact = {
        firstName: firstName.value,
        lastName: lastName.value,
        address: address.value,
        city: city.value,
        email: email.value,
    };

    let items;
    for (let i in cartItems) {
        items = cartItems[i].id;
    }
    
    confirmOrder(contact, items);
})



function makeRequest(contact, items) {
    return new Promise((resolve, reject) => {
        let request = new XMLHttpRequest();
        request.open('POST', 'http://localhost:3000/api/cameras/' + 'order');
        request.onreadystatechange = () => {
            if (request.readyState === 4) {
                if (request.status === 200) {
                    resolve(JSON.parse(request.response));
                } else {
                    reject(JSON.parse(request.response));
                }
            };  
        };
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(JSON.stringify(contact, items));
    });
};


async function confirmOrder(contact, items) {   
    try {
        let promiseRequest = makeRequest(contact, items);
        let promiseResponse = await promiseRequest;
        
    } catch (error) {
        clearCartBtn.style.display = 'none';
        cartContent.remove();
        cartHeader.textContent = 'Server error';
    }
}