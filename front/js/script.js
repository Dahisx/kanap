const kanapElement = document.querySelector("#items");
console.log(kanapElement);

// Data from API
const kanapTemplate = ({
  _id,
  name,
  imageUrl,
  description,
  altTxt,
}) => ` <a href="./product.html?id=${_id}">
          <article>
            <img src="${imageUrl}" alt=${altTxt}>
            <h3 class="productName">${name}</h3>
            <p class="productDescription">${description}</p>
          </article>
        </a>`;
fetch("http://localhost:3000/api/products")
  .then(function (response) {
    return response.json();
  })
  // adding data from API to each element in our HTML
  .then(function (kanapList) {
    let kanapstring = "";
    kanapList.forEach((element) => {
      kanapstring += kanapTemplate(element);
    });
    kanapElement.innerHTML = kanapstring;
  });
console.log("fetch");
