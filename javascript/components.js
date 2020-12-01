
// Variables
const navbar = document.getElementById('navbar');
const navPosition = navbar.offsetTop;


/* Set the width of the side navigation to 300px */
function openNav() {
  document.getElementById("sideNav").style.width = "300px";
};
  
/* Set the width of the side navigation to 0 */
function closeNav() {
  document.getElementById("sideNav").style.width = "0";
};


/* Change navbar height when scrolling down */
window.onscroll = function() {
  changeNavbarOnScroll()
};

function changeNavbarOnScroll() {
  if (window.pageYOffset > navPosition) {
    navbar.style.minHeight = '60px';
  } else {
    navbar.style.minHeight = '100px';
  }
};


/* Scroll to main content when clicking on banner-button */
function scrollToMainSection() {
  document.querySelector('main').scrollIntoView({
      behavior: 'smooth'
  });
};