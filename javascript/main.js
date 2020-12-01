
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
    const figure = document.createElement('figure');
    const imgSrc = response[i].imageUrl;
    const img = document.createElement('img');
    const figcaption = document.createElement('figcaption');
    const a1 = document.createElement('a');
    const a2 = document.createElement('a');
    const p = document.createElement('p');

    // Set element attributes and textcontent
    img.setAttribute('src', imgSrc);
    a1.setAttribute('href', 'product.html?id=' + response[i]._id);
    a2.setAttribute('href', 'product.html?id=' + response[i]._id);
    a1.textContent = response[i].name;
    p.textContent = '$' + response[i].price / 100;

    // Add everything to their parent containers
    a2.appendChild(img)
    figcaption.appendChild(a1);
    figcaption.appendChild(p);
    figure.appendChild(a2);
    figure.appendChild(figcaption);
    gridContainer.appendChild(figure);
  }
};


async function requestPromise() {
  try {
    const promiseRequest = makeRequest();
    const promiseResponse = await promiseRequest;
    createProductFigure(promiseResponse);
  } catch (error) {
    document.querySelector('main .container').innerHTML = '<h2 class="grid-heading">Error</h2>'
  }
};

requestPromise();

