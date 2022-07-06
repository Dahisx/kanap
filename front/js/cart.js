import { storage } from "./utils.js";

const ERROR_MSG = "Chaine de caractere non valide."

//  User localStorage
let cart = storage();
console.log(cart);

// valeur total cart depart
let price = 0;
let qty = 0;
// Selector
const kanapTotalQuantity = document.querySelector("#totalQuantity")
const kanapTotalPrice = document.querySelector("#totalPrice")
const kanapElement = document.querySelector("#cart__items"); 
// HTML dynamic value & total price / quantity
const kanapTemplate = ({
    body,quantity
}) =>   `  <article class="cart__item" data-id="${body.idProduct}" data-color="${body.color}">
<div class="cart__item__img">
  <img src="${body.image}" alt="${body.description}">
</div>
<div class="cart__item__content">
  <div class="cart__item__content__description">
    <h2>${body.title}</h2>
    <p>${body.color}</p>
    <p>${body.price + " €"}</p>
  </div>
  <div class="cart__item__content__settings">
    <div class="cart__item__content__settings__quantity">
      <p>Qté : </p>
      <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${quantity}">
    </div>
    <div class="cart__item__content__settings__delete">
        <p class="deleteItem">Supprimer</p>
      </div>
    </div>
  </div>
  </article>`;

let kanapstring = "";
cart.forEach((element) => {
    kanapstring += kanapTemplate(element);
    // add Total price & quantity
    price += parseInt(element.body.price);
    qty += parseInt(element.quantity);
});
kanapElement.innerHTML = kanapstring;
kanapTotalPrice.innerHTML = price;
kanapTotalQuantity.innerHTML = qty;

// remove product to cart
  document.querySelectorAll(".deleteItem").forEach(el => el.addEventListener("click", function(event) {
  const parent = event.target.parentElement.parentElement.parentElement.parentElement;
  const {id, color} = parent.dataset;
  parent.outerHTML = "";
  cart = cart.filter(el => {
    if(el.id !== id + color) return true;
    price += -parseInt(el.body.price);
    qty += -parseInt(el.quantity);
    return false;
  })
  kanapTotalPrice.innerHTML = price;
  kanapTotalQuantity.innerHTML = qty;
  storage("set",cart);
}) )



// form / confirmation cart

//letter only first & lastname 
function onlyLetter(value) {
  const regex = new RegExp(/^[A-Za-z]+$/);
  return !regex.test(value)
}


const order = document.querySelector("#order")
order.addEventListener("click", function(event) {
  //cart
  event.preventDefault();
  const errorFirstNameMsg = document.querySelector("#firstNameErrorMsg")
  const errorLastNameMsg = document.querySelector("#lastNameErrorMsg")
  const isInvalidFirstName = onlyLetter(firstName.value);
  const isInvalidLastName = onlyLetter(lastName.value);
  if(isInvalidFirstName) {errorFirstNameMsg.innerHTML = ERROR_MSG ;} else errorFirstNameMsg.innerHTML = "";
  if(isInvalidLastName) {errorLastNameMsg.innerHTML = ERROR_MSG;} else errorLastNameMsg.innerHTML = "";
  if(isInvalidFirstName || isInvalidLastName) return;
  const listProductId = cart.map(el => el.body.idProduct); // map to get list productId only
  const listProductNoDuplicate = [...new Set(listProductId)]; // no duplicate 
  const regex = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,'g');
  if(!regex.test(email.value) || !firstName.value || !lastName.value || !address.value || !city.value) return alert("Un champ n'est pas valide !!");
  if(listProductNoDuplicate.length === 0) return alert('pas de produit dans le cart');
  const bodyToSend = {
    contact: {
     firstName: firstName.value,
     lastName: lastName.value,
     address: address.value,
     city: city.value,
     email: email.value,
    },
    products:listProductNoDuplicate
  }
  console.log(bodyToSend);
  fetch(`http://localhost:3000/api/products/order`,{
    method:"POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body:JSON.stringify(bodyToSend)
  }).then(function(response){
    return response.json()
  }).then(function(data){
    storage('delete');
    window.location = `./confirmation.html?id=${data.orderId}`;
  })
});












            
