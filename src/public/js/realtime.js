const socket = io();

// socket.on("updateProducts", (products) => {
//   console.log(products);
//   updateProductList(products);
// });

socket.on("enviodeproducts", (obj) => {
  updateProductList(obj);
});

function updateProductList(products) {
  let div = document.getElementById("list-products");
  let productos = ""

  products.forEach((product) => {
    productos += `
        <div class="card">
          <div class="contentBx">
            <h2>${product.title} - ${product.code}</h2>
            <div class="size">
              <h3>${product.description}</h3>
            </div>
            <div class="color">
              <h3>${product.price}</h3>
            </div>
            <button class="btn btn-primary">Comprar</a>
          </div>
        </div>
          `;
  });

  div.innerHTML = productos;
}

let form = document.getElementById("formProduct");
form.addEventListener("submit", (evt) => {
  evt.preventDefault();

  let title = form.elements.title.value;
  let description = form.elements.description.value;
  let price = parseInt(form.elements.price.value);
  let status = true;
  let stock = parseInt(form.elements.stock.value)
  let category = form.elements.category.value;
  let thumbnail = form.elements.thumbnail.value;

  socket.emit("addProductForm", {
    title: title,
    description: description,
    price: price,
    status: status,
    stock: stock,
    category: category,
    thumbnail: thumbnail,
  });

  form.reset();
});

document.getElementById("delete-btn").addEventListener("click", function () {
  const deleteidinput = document.getElementById("id-prod");
  const deleteid = deleteidinput.value;
  socket.emit("deleteProduct", deleteid);
  deleteidinput.value = "";
});
