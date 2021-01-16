
// Request data from server and return a promise
function makeRequest() {
  return new Promise((resolve, reject) => {
    let request = new XMLHttpRequest();
    request.open('GET', "http://localhost:3000/api/cameras");
    request.onreadystatechange = () => {
      if (request.readyState === 4) {
        if(request.status === 200) {
          resolve(JSON.parse(request.response));
        } else {
          reject('Server not responding');
        }
      }
    }
    request.send();
  });
};

// Create all the content for the product page
function createProductFigure(response) {
  const gridContainer = document.querySelector('.grid-container');
  // Loop through the data to create elements for all products
  for (let i in response) {
    const {img, a1, a2, p, figcaption, figure} = createElements();
    
    // Set element attributes and textcontent
    setAttributesAndText(response, i, img, a1, a2, p);

    // Add everything to their parent containers
    appendElements(a2, img, figcaption, a1, p, figure, gridContainer);
  }
};


function appendElements(a2, img, figcaption, a1, p, figure, gridContainer) {
  a2.appendChild(img);
  figcaption.appendChild(a1);
  figcaption.appendChild(p);
  figure.appendChild(a2);
  figure.appendChild(figcaption);
  gridContainer.appendChild(figure);
}

function setAttributesAndText(response, i, img, a1, a2, p) {
  const imgSrc = response[i].imageUrl;
  img.setAttribute('src', imgSrc);
  img.setAttribute('alt', response[i].name);
  a1.setAttribute('href', 'product.html?id=' + response[i]._id);
  a2.setAttribute('href', 'product.html?id=' + response[i]._id);
  a1.textContent = response[i].name;
  p.textContent = '$' + response[i].price / 100;
}

function createElements() {
  const figure = document.createElement('figure');
  const img = document.createElement('img');
  const figcaption = document.createElement('figcaption');
  const a1 = document.createElement('a');
  const a2 = document.createElement('a');
  const p = document.createElement('p');
  return { img, a1, a2, p, figcaption, figure };
}

async function requestPromise() {
  try {
    const promiseRequest = makeRequest();
    const promiseResponse = await promiseRequest;
    createProductFigure(promiseResponse);
  } catch (error) {
    document.querySelector('main .container').innerHTML = '<h2 class="grid-heading">Server request failed</h2>'
  }
};

requestPromise();

