// CART CONTENT, BUTTONS, FORM VALIDATION AND CONFIRMATION IS CREATED INSIDE CART.JS
// FORM ELEMENTS ARE CREATED INSIDE CART.HTML


// Declaring variables outside of function scope
let cartItems = JSON.parse(localStorage.getItem('addedCameras'));
const cartContainer = document.querySelector('.cart.container');
const submitBtn = document.querySelector('.submit');
const formContainer = document.querySelector('.form.container');
const btnContainer = document.querySelector('.button.container');
const cartHeader = document.getElementById('cartHeader');
const cartContent = document.getElementById('cartContent');

const clearCartBtn = document.createElement('button');
const totalPrice = document.createElement('p');



// SHOW CART CONTENT
// Main function
window.onload = function showCartContent() {
    if (localStorage.getItem('addedCameras') != null) {
        cartHeader.textContent = 'Your Cart';

        // Display clear-cart button
        showClearCartBtn();
        // Display total price
        showTotalPrice();

        // Loop over added items to show them inside cart
        for (let i in cartItems) {
            // Create all necessary elements to pass them to other functions below
            let {itemContainer, itemImg, itemName, itemLense, itemPrice, removeBtn,
                qtyContainer, increase, quantity, decrease} = createElements();
            
            // Add attributes and text to cart elements
            setAttributesAndText(itemContainer, itemImg, i, itemName, itemLense, itemPrice, removeBtn);

            // Show and update quantity with increase/decrease button
            showQuantity(qtyContainer, increase, decrease, quantity, i);
            updateQuantity(increase, decrease, quantity, i, itemPrice);

            // Append itemcontainers to cartcontainer
            appendCartElements(itemContainer, itemImg, itemName, itemLense,
                 itemPrice, removeBtn, qtyContainer);
            
            // To remove item from cart
            removeItem(removeBtn, itemContainer);
        };
    } else {
        // Set cart header when cart is empty
        cartHeader.textContent = 'Your Cart is empty';
    };
};

// Create all necessary elements to pass them to other functions
function createElements() {
    let itemContainer = document.createElement('div');
    let itemImg = document.createElement('img');
    let itemName = document.createElement('h3');
    let itemLense = document.createElement('span');
    let itemPrice = document.createElement('span');
    let removeBtn = document.createElement('button');
    let qtyContainer = document.createElement('div');
    let increase = document.createElement('button');
    let quantity = document.createElement('p');
    let decrease = document.createElement('button');
    return {itemContainer, itemImg, itemName, itemLense, itemPrice, removeBtn,
        qtyContainer, increase, quantity, decrease};
}

// Add attributes and text to cart elements
function setAttributesAndText(itemContainer, itemImg, i, itemName, itemLense, itemPrice, removeBtn) {
    itemContainer.classList.add('cart-item');
    itemImg.setAttribute('src', cartItems[i].image);
    itemImg.setAttribute('alt', cartItems[i].name);
    itemName.textContent = cartItems[i].name;
    itemLense.textContent = cartItems[i].lense;
    itemPrice.textContent = '$' + cartItems[i].quantity * cartItems[i].price / 100;
    removeBtn.innerHTML = '<i class="fas fa-times"></i>';
    removeBtn.setAttribute('aria-label', 'remove');
    removeBtn.classList.add('remove-btn');
    // Adding item id to use inside removeItem function
    itemContainer.setAttribute('id', cartItems[i].id);
}

// Show quantity with increase/decrease button
function showQuantity(qtyContainer, increase, decrease, quantity, i) {
    qtyContainer.classList.add('qty-container');
    increase.classList.add('fas', 'fa-chevron-up', 'increase');
    increase.setAttribute('aria-label', 'increase');
    decrease.classList.add('fas', 'fa-chevron-down', 'decrease');
    decrease.setAttribute('aria-label', 'decrease');
    quantity.textContent = cartItems[i].quantity;

    qtyContainer.appendChild(increase);
    qtyContainer.appendChild(quantity);
    qtyContainer.appendChild(decrease);
}

// Update quantity with increase/decrease button
function updateQuantity(increase, decrease, quantity, i, itemPrice) {
    increase.addEventListener('click', () => {
        cartItems[i].quantity++;
        localStorage.setItem('addedCameras', JSON.stringify(cartItems));
        quantity.textContent = cartItems[i].quantity;
        itemPrice.textContent = '$' + cartItems[i].quantity * cartItems[i].price / 100;
        showTotalPrice();

        if (cartItems[i].quantity > 1) {
            decrease.removeAttribute('disabled');
        }
    });

    decrease.addEventListener('click', () => {
        cartItems[i].quantity--;
        localStorage.setItem('addedCameras', JSON.stringify(cartItems));
        quantity.textContent = cartItems[i].quantity;
        itemPrice.textContent = '$' + cartItems[i].quantity * cartItems[i].price / 100;
        showTotalPrice();

        if (cartItems[i].quantity < 2) {
            decrease.disabled = true;
        }
    });
}

// Get total price from items in cart
function getTotalPrice() {
    let total = 0;
    for (let i in cartItems) {
        // if price = 0...
        total += cartItems[i].quantity * cartItems[i].price / 100;
    }
    return '$' + total;
}

// Display total price
function showTotalPrice() {
    let priceSum = getTotalPrice();
    totalPrice.textContent = 'Total: ' + priceSum;
    btnContainer.appendChild(totalPrice);
}

// Display clear-cart button
function showClearCartBtn() {
    clearCartBtn.classList.add('clear-cart-btn');
    clearCartBtn.textContent = 'Clear cart';
    btnContainer.appendChild(clearCartBtn);
}

// Append itemcontainers to cartcontainer
function appendCartElements(itemContainer, itemImg, itemName, itemLense, itemPrice, removeBtn, qtyContainer) {
    itemContainer.appendChild(itemImg);
    itemContainer.appendChild(itemName);
    itemContainer.appendChild(itemLense);
    itemContainer.appendChild(itemPrice);
    itemContainer.appendChild(removeBtn);
    itemContainer.appendChild(qtyContainer);
    cartContent.appendChild(itemContainer);
}

// To remove item from cart
function removeItem(removeBtn, itemContainer) {
    removeBtn.addEventListener('click', (event) => {
        event.preventDefault();

        // Get item id 
        let product_id = itemContainer.getAttribute('id');
        
        itemContainer.remove();

        // Loop through cartItems to just remove itemcontainer with corresponding id
        for (let i = 0; i < cartItems.length; i++) {
            if (cartItems[i].id == product_id) {
                cartItems.splice(i, 1);
            };
        };

        // update localstorage
        localStorage.setItem('addedCameras', JSON.stringify(cartItems));
        
        showTotalPrice();
    
        if (cartItems.length === 0) {
            localStorage.removeItem('addedCameras');
        }

        updateCartWhenEmpty();
    });
};

// Eventlistener to clear the cart
clearCartBtn.addEventListener('click', (event) => {
    event.preventDefault();
    localStorage.removeItem('addedCameras');
    updateCartWhenEmpty();
});


// When cart is empty, hide elements and remove localstorage
function updateCartWhenEmpty() {
    if (JSON.parse(localStorage.getItem('addedCameras')) == null) {
        formContainer.style.display = 'none';
        cartHeader.textContent = 'Your Cart is empty';
        btnContainer.style.display = 'none';
        cartContent.style.display = 'none';
    };
}
updateCartWhenEmpty();




// FORM VALIDATION
// Variables for contact object and form validation
const firstName = document.getElementById('firstName');
const lastName = document.getElementById('lastName');
const address = document.getElementById('address');
const city = document.getElementById('city');
const email = document.getElementById('email');
const formInputs = [firstName, lastName, address, city];
// Set validation boolean to false
let firstNameValid = false;
let lastNameValid = false;
let addressValid = false;
let cityValid = false;
let emailValid = false;
const emailRegex = /.+@.+\..+/;
const validations = [firstNameValid, lastNameValid, addressValid, cityValid];

for (let i in formInputs) {
    formInputs[i].addEventListener('blur', () => {
        if (formInputs[i].value == "") {
            validations[i] = false;
            formInputs[i].style.border = 'medium solid #da9898';
        } else {
            formInputs[i].style.border = 'none';
            validations[i] = true;
        }
    })
}

// Separate eventlistener for email field with regular expression
email.addEventListener('blur', () => {
    if (email.value == "" || !emailRegex.test(email.value)) {
        emailValid = false;
        email.style.border = 'medium solid #da9898';
    } else {
        emailValid = true;
        email.style.border = 'none';
    }
})


// Eventlistener to create contact object and item array and send it to server
submitBtn.addEventListener('click', (event) => {
    event.preventDefault();

    for (let i in formInputs) {
        if (formInputs[i].value == "") {
            formInputs[i].style.border = 'medium solid #da9898';
        }
    }

    if (email.value == "") {
        email.style.border = 'medium solid #da9898';
    }

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

    checkValidation(order);
})


function checkValidation(order) {
    let checkValidation = true;
    for (let i in validations) {
        // Check if all form inputs are validated
        if (validations[i] === false || emailValid === false) {
            checkValidation = false;
        }
    }
    // If all inputs are validated, send order to server
    if (checkValidation === true) {
        confirmOrder(order);
    } else {
        // Replace content
        if(!document.querySelector('.error-message')) {
            const errorMessage = document.createElement('p');
            errorMessage.classList.add('error-message');
            errorMessage.textContent = 'Please fill out every field!';
            errorMessage.style.color = '#da9898';
            formContainer.appendChild(errorMessage);
            console.log('ok');
        }
    }
}


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
        let promiseResponse = await promiseRequest;
        showConfirmation(promiseResponse);
    } catch (error) {
        clearCartBtn.style.display = 'none';
        cartContent.remove();
        cartHeader.textContent = 'Server error';
    }
}

// Display order confirmation 
function showConfirmation(response) {
    // Remove from localstorage
    cartContainer.style.display = 'none';
    btnContainer.style.display = 'none';
    formContainer.style.display = 'none';
    
    let confirmContainer = document.createElement('div');
    confirmContainer.classList.add('confirmation', 'container');

    let confirmHeader = document.createElement('h2');
    confirmHeader.textContent = 'Thank you for your order!';

    let confirmMessage = document.createElement('p');
    confirmMessage.textContent = 'Below is your orderID which is also being sent to your email address.';

    let orderId = document.createElement('span');
    orderId.textContent = 'orderID: ' + response.orderId;

    let confirmPriceSum = getTotalPrice();
    let confirmPrice = document.createElement('p');
    confirmPrice.textContent = 'Total Price: ' + confirmPriceSum;

    localStorage.removeItem('addedCameras');
    updateCartWhenEmpty();

    appendConfirmElements(confirmContainer, confirmHeader, confirmMessage, orderId, confirmPrice);
};


function appendConfirmElements(confirmContainer, confirmHeader, confirmMessage, orderId, confirmPrice) {
    let mainContainer = document.querySelector('main');
    confirmContainer.appendChild(confirmHeader);
    confirmContainer.appendChild(confirmMessage);
    confirmContainer.appendChild(orderId);
    confirmContainer.appendChild(confirmPrice);
    mainContainer.appendChild(confirmContainer);
};

