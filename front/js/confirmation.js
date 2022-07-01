const split = document.location.search.split("?");
const id = split[1].split("=")[1]
const orderid = document.querySelector("#orderId");

orderid.innerHTML = id;

console.log(id);