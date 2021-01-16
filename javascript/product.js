
// Create button and form outside of function scope
const mainContainer = document.querySelector('main .container .product-container');
const addToCartBtn = document.createElement('button');
const form = document.createElement('form');
const formLabel = document.createElement('label');
const formSelect = document.createElement('select');

// Get product querystring for the API endpoint
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const productId = urlParams.get('id');

// Request data from server and return a promise
function makeRequest() {
    return new Promise((resolve, reject) => {
        let request = new XMLHttpRequest();
        request.open('GET', 'http://localhost:3000/api/cameras/' + productId);
        request.onreadystatechange = () => {
            if (request.readyState === 4) {
                if (request.status === 200 || request.status === 201) {
                    resolve(JSON.parse(request.response));
                } else {
                    reject('Server not responding');
                }
            }
        }
        request.send();
    })
};

// Create all the content for the product page
function createProductInfo(response) {
    const imgSrc = response.imageUrl;
    const { img, h2, p1, p2 } = createElements();
    lenseSelect(response);

    // Set element attributes and textcontent
    img.setAttribute('src', imgSrc);
    img.setAttribute('alt', response.name);
    h2.textContent = response.name;
    p1.textContent = response.description;
    p2.textContent = '$' + response.price / 100;
    addToCartBtn.textContent = 'Add to cart';
    addToCartBtn.classList.add('add-to-cart-btn');

    appendElements(img, h2, p1, p2);
    addToCart(response);
};

// Create displayed elements
function createElements() {
    const img = document.createElement('img');
    const h2 = document.createElement('h2');
    const p1 = document.createElement('p');
    const p2 = document.createElement('p');
    return { img, h2, p1, p2 };
}

// Create form to select lenses and set the value for all options
function lenseSelect(response) {
    formLabel.textContent = 'Choose your lense: ';
    formLabel.setAttribute('for', 'select');
    formSelect.setAttribute('id', 'select');
    for (let i in response.lenses) {
        const formOption = document.createElement('option');
        formOption.textContent = response.lenses[i];
        formOption.setAttribute('value', response.lenses[i]);
        formSelect.appendChild(formOption);
    };
    form.appendChild(formLabel);
    form.appendChild(formSelect);
}

// Append DOM elements to main container
function appendElements(img, h2, p1, p2) {
    mainContainer.appendChild(img);
    mainContainer.appendChild(h2);
    mainContainer.appendChild(p1);
    mainContainer.appendChild(form);
    mainContainer.appendChild(p2);
    mainContainer.appendChild(addToCartBtn);
}

// Add the product to localstorage by clicking the add-to-cart-button
function addToCart(response) {
    addToCartBtn.addEventListener('click', () => {
        // Get product information from the API request
        let product = {
            'image': response.imageUrl,
            'id': response._id,
            'name': response.name, 
            'lense': formSelect.value, 
            'price': response.price,
            'quantity': 1
        }

        // Get camera array from LS
        let addedCameras = JSON.parse(localStorage.getItem('addedCameras'));

        updateLocalstorage(addedCameras, product);

        const message = document.createElement('p');
        message.textContent = product.name + ' succesfully added to cart!'
        message.style.color = '#a0522d';
        mainContainer.appendChild(message);
    });
};


function updateLocalstorage(addedCameras, product) {
    // Create array if localstorage is empty
    if (addedCameras == null) {
        let addedCameras = [];
        addedCameras.push(product);
        /* Repeated code.. and function doesn't work */
        saveToLocalstorage(addedCameras);
    }

    let checkId = false;
    for (let i in addedCameras) {
        // Check if ID already present, if yes add 1 quantity
        if (addedCameras[i].id === product.id) {
            addedCameras[i].quantity += 1;
            saveToLocalstorage(addedCameras);
            checkId = true;

        }
    }

    // If ID is not present, add new product to LS
    if (addedCameras != null && checkId === false) {
        addedCameras.push(product);
        saveToLocalstorage(addedCameras);
    }
}

function saveToLocalstorage(addedCameras) {
    localStorage.setItem('addedCameras', JSON.stringify(addedCameras));
}

async function getProductInfo() {
    try {
        const promiseRequest = makeRequest();
        const promiseResponse = await promiseRequest;
        createProductInfo(promiseResponse);
    } catch (error) {
        document.querySelector('.product-container').innerHTML = '<h2>Server request failed</h2>'
    }
};
getProductInfo();





