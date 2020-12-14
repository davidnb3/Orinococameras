// CART CONTENT, BUTTONS, FORM VALIDATION AND CONFIRMATION IS CREATED INSIDE CART.JS
// FORM ELEMENTS ARE CREATED INSIDE CART.HTML


// Declaring variables outside of function scope
let cartItems = JSON.parse(localStorage.getItem('addedCameras'));
console.log(cartItems);
const cartContainer = document.querySelector('.cart.container');
const submitBtn = document.querySelector('.submit');
const formContainer = document.querySelector('.form.container');
const btnContainer = document.querySelector('.button.container');
const cartHeader = document.getElementById('cartHeader');
const cartContent = document.getElementById('cartContent');

const clearCartBtn = document.createElement('button');
const totalPrice = document.createElement('p');


// Show the cart content
function showCartContent() {
    if (localStorage.getItem('addedCameras') != null) {
        cartHeader.textContent = 'Your Cart';

        showClearCartBtn();
        showTotalPrice();

        // Show added products inside the cart
        for (let i in cartItems) {
            let {itemContainer, itemImg, itemName, itemLense, itemPrice, removeBtn} = createElements();
            
            // Add attributes and text to cart elements
            itemContainer.classList.add('cart-item');
            itemImg.setAttribute('src', cartItems[i].image);
            itemName.textContent = cartItems[i].name;
            itemLense.textContent = cartItems[i].lense;
            itemPrice.textContent = '$' + cartItems[i].price / 100;
            
            // Adding item id to use inside removeItem function
            itemContainer.setAttribute('id', cartItems[i].id);
            removeBtn.innerHTML = '<i class="fas fa-times"></i>';

            // Append itemcontainers to cartcontainer
            appendCartElements(itemContainer, itemImg, itemName, itemLense, itemPrice, removeBtn);
            
            // Function to remove item from cart
            removeItem(removeBtn, itemContainer);
        };
    } else {
        // Set cart header when cart is empty
        cartHeader.textContent = 'Your Cart is empty';
    };
};

showCartContent();

// Get total price from items in cart
function getTotalPrice() {
    let total = 0;
    for (let i in cartItems) {
        total += cartItems[i].price / 100;
    }
    return '$' + total;
}

// Show total price
function showTotalPrice() {
    let priceSum = getTotalPrice();
    totalPrice.textContent = 'Total: ' + priceSum;
    btnContainer.appendChild(totalPrice);
}

// Show clear-cart-btn and total price
function showClearCartBtn() {
    clearCartBtn.classList.add('clear-cart-btn');
    clearCartBtn.textContent = 'Clear cart';
    btnContainer.appendChild(clearCartBtn);
}

// Create cart elements
function createElements() {
    let itemContainer = document.createElement('div');
    let itemImg = document.createElement('img');
    let itemName = document.createElement('h3');
    let itemLense = document.createElement('span');
    let itemPrice = document.createElement('span');
    let removeBtn = document.createElement('button');
    return {itemContainer, itemImg, itemName, itemLense, itemPrice, removeBtn};
}

// Append itemcontainers to cartcontainer
function appendCartElements(itemContainer, itemImg, itemName, itemLense, itemPrice, removeBtn) {
    itemContainer.appendChild(itemImg);
    itemContainer.appendChild(itemName);
    itemContainer.appendChild(itemLense);
    itemContainer.appendChild(itemPrice);
    itemContainer.appendChild(removeBtn);
    cartContent.appendChild(itemContainer);
}

// To remove item from cart with eventlistener
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
const formInputs = [firstName, lastName, address, city, email];
// Set validation boolean to false
let firstNameValid = false;
let lastNameValid = false;
let addressValid = false;
let cityValid = false;
let emailValid = false;
const validations = [firstNameValid, lastNameValid, addressValid, cityValid, emailValid];

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

/*firstName.addEventListener('blur', () => {
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
});*/


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
    // Call async function to send data to server when validation booleans are true

    
        if (validations) {
            confirmOrder(order);   
        }
    /*if ((firstNameValid) && (lastNameValid) && (addressValid) && (cityValid) && (emailValid)) {
        confirmOrder(order);
    }*/
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
        let promiseResponse = await promiseRequest;
        showConfirmation(promiseResponse);
    } catch (error) {
        clearCartBtn.style.display = 'none';
        cartContent.remove();
        cartHeader.textContent = 'Server error';
    }
}


function showConfirmation(response) {
    cartContainer.style.display = 'none';
    btnContainer.style.display = 'none';
    formContainer.style.display = 'none';
    
    console.log(response);
    let confirmContainer = document.createElement('div');
    confirmContainer.classList.add('confirmation', 'container');

    let confirmHeader = document.createElement('h2');
    confirmHeader.textContent = 'Thank you for your order!';

    let confirmMessage = document.createElement('p');
    confirmMessage.textContent = 'Below is your orderID which is also being sent to your email address.';

    let orderId = document.createElement('span');
    orderId.textContent = 'orderID: ' + response.orderId;

    appendConfirmElements(confirmContainer, confirmHeader, confirmMessage, orderId);
};


function appendConfirmElements(confirmContainer, confirmHeader, confirmMessage, orderId) {
    let mainContainer = document.querySelector('main');
    confirmContainer.appendChild(confirmHeader);
    confirmContainer.appendChild(confirmMessage);
    confirmContainer.appendChild(orderId);
    mainContainer.appendChild(confirmContainer);
};

