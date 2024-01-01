const moment = require('moment');
const Order = require('../../../models/order');

const orderController = () => {
  return {
    store: (req, res) => {
      // Validate request
      const { phone, address } = req.body;
      if (!phone || !address) {
        return res.status(422).json({ message: 'All fields are required' });
      }

      const order = new Order({
        customerId: req.user[0]._id,
        items: req.session.cart.items,
        phone,
        address,
      });

      order
        .save()
        .then((result) => {
          Order.populate(result, { path: 'customerId' })
            .then((placedOrder) => {
              req.flash('success', 'Order placed successfully');
              delete req.session.cart;

              // Emit
              const eventEmitter = req.app.get('eventEmitter');
              eventEmitter.emit('orderPlaced', result);

              return res.redirect('/customers/orders');
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          req.flash('error', 'something went wrong');
          return res.redirect('/cart');
        });
    },
    index: async (req, res) => {
      const orders = await Order.find({ customerId: req.user[0]?._id }, null, {
        sort: { createdAt: -1 },
      });
      res.header('Cache-Control', 'no-store');
      res.render('customers/orders', { orders: orders, moment: moment });
    },
    show: async (req, res) => {
      try {
        const order = await Order.findById(req.params.id);
        // Authorize user
        if (!order) {
          throw 'order not found';
        }
        if (req.user[0]._id.toString() === order.customerId.toString()) {
          return res.render('customers/singleOrder', { order });
        }
        return res.redirect('/cart');
      } catch (error) {
        console.log(error.message);
        throw error;
      }
    },
  };
};

module.exports = orderController;
