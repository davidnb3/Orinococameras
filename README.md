# Orinoco #


 - Introduction

This is Project 5 from the Openclassrooms Web Developer Path. It's an e-commerce website including a list view page showing all the items, a single product page, a cart page and a confirmation page. 

The server was already built by the OC team, so my mission was to get all the data from the server using GET requests to show the products on the list view page and to use URL query parameters to create a single product page for all the various items. 

I used the localstorage JS functionality to save and add the products to the cart, and redirected the user to a confirmation page by sending a POST request to the server with validated contact details.

I didn't use any frameworks or libraries to build the website.

Part of the project was also a test plan which should cover at least 80% of the front-end code base.



- Prerequisites

You will need to have Node and npm installed locally on your machine.


- Installation

Clone this repo. From within the project folder, run npm install. You can then run the server with node server. The server should run on localhost with default port 3000. If the server runs on another port for any reason, this is printed to the console when the server starts, e.g. Listening on port 3001.