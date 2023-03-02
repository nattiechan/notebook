const express = require('express');
const ordersController = require('../controllers/ordersController');

const router = express.Router();

router.get('/schemaKeys',
    ordersController.getSchemaKeys,
    (_, res) => res.status(200).json(
        { summaryKeys: res.locals.summaryKeys, orderKeys: res.locals.orderKeys }
    )
);

router.get('/name',
    ordersController.getOrders,
    (_, res) => res.status(200).json(res.locals.orders)
);

router.get('/',
    ordersController.getAllOrders,
    (_, res) => res.status(200).json(res.locals.allOrders)
);

router.post('/',
    ordersController.createOrder,
    (_, res) => res.status(200).json({ "id": res.locals.orderId })
);

router.delete('/',
    ordersController.deleteOrder,
    (_, res) => res.status(200).json({ "id": res.locals.deletedId })
);

//TODO: Patch

module.exports = router;