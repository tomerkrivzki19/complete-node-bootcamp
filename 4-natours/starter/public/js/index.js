//THIS index.js fille is our entery fille
//THIS one we kinba get data from the user interface and then we deligate actions to some duntion coming from the others moudles (login moudle ,alerts moudle) , just like in node.js we can now export data from moudles

// bable libary => make some of the new js fetures work at older broswers
//npm i @babel/polyfill
import '@babel/polyfill';
import { login, logout } from './login';
import { displayMap } from './mapbox';

// console.log('Hello from parcel'); -> check if the fille work

// FIXEME: having problem with the mapbox when entering to a tour

//DOM ELEMNTS :
const mapbox = document.getElementById('map');
const loginForm = document.querySelector('.form');
const logOutBtn = document.querySelector('.nav__el--logout');
//DELEGATION:
if (mapbox) {
  //extract the data from the div , what we have done in the pug tamplate - we display all the data in the div classname
  const locations = JSON.parse(mapbox.dataset.locations);
  displayMap(locations);
}

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
} else {
  console.error('Form element not found');
}

if (logOutBtn) logOutBtn.addEventListener('click', logout);
