
// Declaring variables outside of function scope
let cartItems = JSON.parse(localStorage.getItem('addedCameras'));

const cartContainer = document.querySelector('.cart.container');
const submitBtn = document.querySelector('.submit');
const formContainer = document.querySelector('.form.container');
const btnContainer = document.querySelector('.button.container');
const cartHeader = document.getElementById('cartHeader');
const cartContent = document.getElementById('cartContent');

const clearCartBtn = document.createElement('button');


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
            
            // Add attributes and text to cart elements
            itemContainer.classList.add('cart-item');
            itemImg.setAttribute('src', cartItems[i].image);
            itemName.textContent = cartItems[i].name;
            itemLense.textContent = cartItems[i].lense;
            itemPrice.textContent = '$' + cartItems[i].price / 100;
            
            // Adding item id to use inside removeItem function
            itemContainer.setAttribute('id', cartItems[i].id);
            removeBtn.innerHTML = '<i class="fas fa-times"></i>';

            // Append individual itemcontainers to cartcontainer
            appendItems(itemContainer, itemImg, itemName, itemLense, itemPrice, removeBtn);
            
            // Call function to remove item from cart
            removeItem(removeBtn, itemContainer);
        };
    } else {
        // Set cart header when cart is empty
        cartHeader.textContent = 'Your Cart is empty';
    };
};

showCartContent();


function appendItems(itemContainer, itemImg, itemName, itemLense, itemPrice, removeBtn) {
    itemContainer.appendChild(itemImg);
    itemContainer.appendChild(itemName);
    itemContainer.appendChild(itemLense);
    itemContainer.appendChild(itemPrice);
    itemContainer.appendChild(removeBtn);
    cartContent.appendChild(itemContainer);
}

// To remove item from the cart by pressing button
function removeItem(removeBtn, itemContainer) {
    removeBtn.addEventListener('click', (event) => {
        event.preventDefault();

        // Get item id 
        let product_id = itemContainer.getAttribute('id');
        
        // Do I need this?
        itemContainer.remove();

        // Loop through cartItems to just remove itemcontainer with corresponding id
        for (let i = 0; i < cartItems.length; i++) {
            if (cartItems[i].id == product_id) {
                cartItems.splice(i, 1);
            };
        };

        // update localstorage
        localStorage.setItem('addedCameras', JSON.stringify(cartItems));

        // remove localstorage item when empty
        if (cartItems.length == 0) {
            localStorage.removeItem('addedCameras');
        };

        // reload page to dynamically hide form when cart is empty
        location.reload();
    });
};

// Eventlistener to clear the cart
clearCartBtn.addEventListener('click', (event) => {
    event.preventDefault();
    cartContent.remove();
    localStorage.removeItem('addedCameras');
    cartHeader.textContent = 'Your Cart is empty';
    clearCartBtn.style.display = 'none';

    // reload page to dynamically hide form when cart is empty
    location.reload();
});


// Hide form when cart is empty
if (JSON.parse(localStorage.getItem('addedCameras')) == null) {
    formContainer.style.display = 'none';
};


// FORM VALIDATION
// Variables for contact object and form validation
const firstName = document.getElementById('firstName');
const lastName = document.getElementById('lastName');
const address = document.getElementById('address');
const city = document.getElementById('city');
const email = document.getElementById('email');
// Set validation boolean to false
let firstNameValid = false;
let lastNameValid = false;
let addressValid = false;
let cityValid = false;
let emailValid = false;

firstName.addEventListener('blur', () => {
    if (firstName.value == "") {
        firstNameValid = false;
        firstName.style.border = 'medium solid #da9898';
    } else {
        firstName.style.border = 'none';
        firstNameValid = true;
    }
});

lastName.addEventListener('blur', () => {
    if (lastName.value == "") {
        lastNameValid = false;
        lastName.style.border = 'medium solid #da9898';
    } else {
        lastName.style.border = 'none';
        lastNameValid = true;
    }
});

address.addEventListener('blur', () => {
    if (address.value == "") {
        addressValid = false;
        address.style.border = 'medium solid #da9898';
    } else {
        address.style.border = 'none';
        addressValid = true;
    }
});

city.addEventListener('blur', () => {
    if (city.value == "") {
        cityValid = false;
        city.style.border = 'medium solid #da9898';
    } else {
        city.style.border = 'none';
        cityValid = true;
    }
});

email.addEventListener('blur', () => {
    if (email.value == "") {
        emailValid = false;
        email.style.border = 'medium solid #da9898';
    } else {
        email.style.border = 'none';
        emailValid = true;
    }
});


// Eventlistener to create contact object and item array and send it to server
submitBtn.addEventListener('click', (event) => {
    event.preventDefault();

    let contact = {
        firstName: firstName.value,
        lastName: lastName.value,
        address: address.value,
        city: city.value,
        email: email.value,
    };

    let products = [];
    for (let i in cartItems) {
        products.push(cartItems[i].id);
    }
    
    let order = {
        contact, products
    }

    console.log(order)
    // Call async function to send data to server
    if ((firstNameValid) && (lastNameValid) && (addressValid) && (cityValid) && (emailValid)) {
        confirmOrder(order);
    }
})


function makeRequest(order) {
    return new Promise((resolve, reject) => {
        let request = new XMLHttpRequest();
        request.open('POST', 'http://localhost:3000/api/cameras/' + 'order');
        request.onreadystatechange = () => {
            if (request.readyState === 4) {
                if (request.status === 200 || request.status === 201) {
                    resolve(JSON.parse(request.response));
                } else {
                    reject(JSON.parse(request.response));
                }
            };
        };
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(JSON.stringify(order));
    });
};


async function confirmOrder(order) {   
    try {
        let promiseRequest = makeRequest(order);
        console.log('1')
        let promiseResponse = await promiseRequest;
        console.log('2')
        //showConfirmation(promiseResponse);
    } catch (error) {
        clearCartBtn.style.display = 'none';
        cartContent.remove();
        cartHeader.textContent = 'Server error';
        console.log(error);
    }
}


/*function showConfirmation(response) {
    cartContainer.style.display = 'none';
    btnContainer.style.display = 'none';
    formContainer.style.display = 'none';

    let confirmContainer = document.createElement('div');
    confirmContainer.classList.add('confirmation container');

}*/
