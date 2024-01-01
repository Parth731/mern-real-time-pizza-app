const Order = require('../../../models/order');

const statusController = () => {
  return {
    update: (req, res) => {
      //   Order.updateOne(
      //     { _id: req.body.orderId },
      //     { status: req.body.status },
      //     (err, data) => {
      //       if (err) {
      //         return res.redirect('/admin/orders');
      //       }
      //       return res.redirect('/admin/orders');
      //   // Emit event
      //   const eventEmitter = req.app.get('eventEmitter');
      //   eventEmitter.emit('orderUpdated', {
      //     id: req.body.orderId,
      //     status: req.body.status,
      //   });
      //   return res.redirect('/admin/orders');
      //     }
      //   );

      Order.findByIdAndUpdate(req.body.orderId, {
        status: req.body.status,
      })
        .then((data) => {
          if (data) {
            // emitter event listening. send id and status to server.js
            const eventEmitter = req.app.get('eventEmitter');
            eventEmitter.emit('orderUpdated', {
              id: req.body.orderId,
              status: req.body.status,
            });
            return res.redirect('/admin/orders');
          }
        })
        .catch((error) => {
          return res.redirect('admin/orders');
        });
    },
  };
};

module.exports = statusController;
