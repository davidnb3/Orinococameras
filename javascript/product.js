
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
    // Create new elements to populate the DOM
    
    const imgSrc = response.imageUrl;
    const img = document.createElement('img');
    const h2 = document.createElement('h2');
    const p1 = document.createElement('p');
    const p2 = document.createElement('p');

    // Create form to select lenses and set the value for all options
    formLabel.textContent = 'Choose your lense: ';
    for (let i in response.lenses) {
        const formOption = document.createElement('option');
        formOption.textContent = response.lenses[i];
        formOption.setAttribute('value', response.lenses[i]);
        formSelect.appendChild(formOption);
    };
    form.appendChild(formLabel);
    form.appendChild(formSelect);

    // Set element attributes and textcontent
    img.setAttribute('src', imgSrc);
    h2.textContent = response.name;
    p1.textContent = response.description;
    p2.textContent = '$' + response.price / 100;
    addToCartBtn.textContent = 'Add to cart';
    addToCartBtn.classList.add('add-to-cart-btn');

    // Add everything to the main container
    mainContainer.appendChild(img);
    mainContainer.appendChild(h2);
    mainContainer.appendChild(p1);
    mainContainer.appendChild(form);
    mainContainer.appendChild(p2);
    mainContainer.appendChild(addToCartBtn);

    // Call function to add product to the localstorage
    addToCart(response);
};

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
    
        // Create array if localstorage is empty
        if (localStorage.getItem('addedCameras') == null) {
            localStorage.setItem('addedCameras', '[]');
        }
        
        // Get already existing cameras and add the new camera
        let addedCameras = JSON.parse(localStorage.getItem('addedCameras'));
        addedCameras.push(product);
        console.log(addedCameras);
    
        // Save existing and added cameras to localstorage
        localStorage.setItem('addedCameras', JSON.stringify(addedCameras));

        const message = document.createElement('p');
        message.textContent = product.name + ' succesfully added to cart!'
        message.style.color = '#a0522d';
        mainContainer.appendChild(message);
    });
};


async function getProductInfo() {
    try {
        const promiseRequest = makeRequest();
        const promiseResponse = await promiseRequest;
        createProductInfo(promiseResponse);
    } catch (error) {
        document.querySelector('.product-container').innerHTML = '<h2>Error</h2>'
    }
};
getProductInfo();





