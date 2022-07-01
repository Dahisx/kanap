import {storage} from './utils.js';

// Selector
const titleElement = document.querySelector("#title");
const priceElement = document.querySelector("#price");
const descriptionElement = document.querySelector("#description");
const itemImgElement = document.querySelector(".item__img");
const colorElement = document.querySelector("#colors");
const quantityElement = document.querySelector("#quantity");
const kanapCartElement = document.querySelector("#addToCart");
const split = document.location.search.split("?");
const id = split[1].split("=")[1];
let image = "";
let idProduct = "";

fetch(`http://localhost:3000/api/products/${id}`).then(function(response){
    return response.json()
}).then(function(data){
    idProduct = data._id;
    titleElement.innerHTML = data.name;
    descriptionElement.innerHTML = data.description;
    priceElement.innerHTML = data.price;
    image = data.imageUrl;
    itemImgElement.innerHTML = `<img src="${image}">`
    let templateString = '';
    data.colors.forEach(color => {
        templateString += `<option value="${color}">${color}</option>`
    }); 
    colorElement.innerHTML += templateString;
});

// listner

kanapCartElement.addEventListener("click", addKanapToKart)

// revoie valeur innertext
function getValue(element,target = "text") {
    if(target === "value") return element.value;
    return element.innerText;
}

// function add
function addKanapToKart (event) {
    event.preventDefault();
    const title = getValue(titleElement);
    const price = getValue(priceElement);
    const description = getValue(descriptionElement);
    const color = getValue(colorElement,'value');
    const quantity = getValue(quantityElement,'value');
    if(!color || !quantity) return alert("veuillez selectionner une couleur et une quantité");
    const idUnique = idProduct + color;
    const body = {
        title,
        price,
        description,
        image,
        color,
        idProduct,
    };
    console.log(body);
    saveLocalKanap(idUnique,body,parseInt(quantity))
    return alert('Votre article à ete ajouter au panier.');
}

//save in localStorage
function saveLocalKanap (idUnique,body,quantity) {
    
    const value = storage();
    const kanap = {
        id:idUnique,
        body,
        quantity
    };
    
    if (!value) storage('set',[kanap]); // 1st time localStorage Data
    else {
        const index = value.findIndex(el => el.id === idUnique);
        if(index === -1) value.push(kanap);
        else value[index].quantity = parseInt(value[index].quantity) + quantity;
        storage('set',value);
    }
}






