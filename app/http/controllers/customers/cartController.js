const cartController = () => {
  return {
    index: (req, res) => {
      res.render('customers/cart');
    },
    update: (req, res) => {
      // let cart = {
      //     items: {
      //         pizzaId: { item: pizzaObject, qty:0 },
      //         pizzaId: { item: pizzaObject, qty:0 },
      //         pizzaId: { item: pizzaObject, qty:0 },
      //     },
      //     totalQty: 0,
      //     totalPrice: 0
      // }
      try {
        if (!req.session.cart) {
          req.session.cart = {
            items: {},
            totalQty: 0,
            totalPrice: 0,
          };
        }
        let cart = req.session.cart;
        if (!cart.items[req.body._id]) {
          cart.items[req.body._id] = {
            items: req.body,
            qty: 1,
          };
          cart.totalQty = cart.totalQty + 1;
          cart.totalPrice = cart.totalPrice + req.body.price;
        } else {
          cart.items[req.body._id].qty = cart.items[req.body._id].qty + 1;
          cart.totalQty = cart.totalQty + 1;
          cart.totalPrice = cart.totalPrice + req.body.price;
        }

        return res.status(201).json({
          message: 'Item added to cart',
          totalQty: req.session.cart.totalQty,
        });
      } catch (error) {
        console.log(error);
        throw new Error('Something went wrong!');
      }
    },
  };
};

module.exports = cartController;
