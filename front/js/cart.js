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

(async() => {
  const fetchListProduct = cart.map(async el => (await fetch(`http://localhost:3000/api/products/${el.body.idProduct}`)).json());
  const promiseListProduct = await Promise.all(fetchListProduct);
  cart = cart.map((element,index) => {
    const priceFetch = promiseListProduct[index].price
     const newElement = {
      ...element,
      body:{
        ...element.body,
        price:priceFetch
      }
    };
      kanapstring += kanapTemplate(newElement);
      // add Total price & quantity
      price += parseInt(priceFetch) * parseInt(element.quantity);
      qty += parseInt(element.quantity);
      return newElement;
  });
  kanapElement.innerHTML = kanapstring;
  kanapTotalPrice.innerHTML = price;
  kanapTotalQuantity.innerHTML = qty;
})();

document.addEventListener("change",(e) => {
  const target = e.target;
  if(target.classList.contains("itemQuantity")) {
    qty = 0;
    price = 0;
    const parent = target.parentElement.parentElement.parentElement.parentElement;
    const {id,color} = parent.dataset;
    cart = cart.map(el => {
      
      if(el.id !== id + color) {
        qty += parseInt(el.quantity);
        price += parseInt(el.body.price) * parseInt(el.quantity);
        return el;
      }
      else {
        qty += parseInt(target.value);
        price += parseInt(el.body.price) * parseInt(target.value); 
        return {
          ...el,
          quantity:target.value
        }
      }
    })

    kanapTotalPrice.innerHTML = price;
    kanapTotalQuantity.innerHTML = qty;
  }
});

document.addEventListener("click",e => {
  const target = e.target;
  if(target.classList.contains("deleteItem")) {
    const parent = e.target.parentElement.parentElement.parentElement.parentElement;
    const {id, color} = parent.dataset;
    parent.outerHTML = "";
    cart = cart.filter(el => {
      console.log(el);
      if(el.id !== id + color) return true;
      price += -parseInt(el.body.price) * parseInt(el.quantity);
      qty += -parseInt(el.quantity);
      return false;
    })
    kanapTotalPrice.innerHTML = price;
    kanapTotalQuantity.innerHTML = qty;
    storage("set",cart);
  }
})



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












            
