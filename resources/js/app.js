const { default: axios } = require('axios');
const Noty = require('noty');

let addToCart = document.querySelectorAll('.add-to-cart');
let cartCounter = document.querySelector('#cartCounter');

function updateCart(pizza) {
  axios
    .post('/update-cart', pizza)
    .then((res) => {
      cartCounter.innerText = res.data.totalQty;
      new Noty({
        type: 'success',
        timeout: 5000,
        text: res.data.message,
        progressBar: false,
        layout: 'bottomRight',
      }).show();
    })
    .catch((err) => {
      new Noty({
        type: 'error',
        timeout: 5000,
        text: 'Something went wrong',
        progressBar: false,
        layout: 'bottomRight',
      }).show();
    });
}

addToCart.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    let pizza = JSON.parse(btn.dataset.pizza);
    updateCart(pizza);
  });
});
