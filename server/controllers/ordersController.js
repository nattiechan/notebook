const models = require('../models/dbModels');

const createError = (error, methodName) => {
    console.log(error.message);
    return {
        log: error.message,
        message: { err: `An error occurred in ordersController.${methodName}` },
    };
};

const ordersController = {};

ordersController.getSchemaKeys = (_, res, next) => {
    const processKeys = (obj) => Object.keys(obj).filter(key => !(/^_/.test(key)));
    res.locals.summaryKeys = processKeys(models.Orders.schema.paths);
    res.locals.orderKeys = processKeys(models.Orders.schema.path('orders').schema.paths);
    return next();
}

ordersController.getOrders = (req, res, next) => {
    const { firstName, lastName } = req.query;
    models.Orders.find({ firstName, lastName }).exec()
        .then(response => {
            if (response.length === 0) {
                const message = `No entries found for name ${firstName} ${lastName}.`;
                return next({ log: message, message: message });
            }
            res.locals.orders = response;
            return next();
        })
        .catch(error => next(createError(error, 'getOrders')));

}

ordersController.createOrder = (req, res, next) => {
    models.Orders.create(req.body)
        .then(response => res.locals.orderId = response._id)
        .then(() => next())
        .catch(error => next(createError(error, 'createOrder')));
};

ordersController.deleteOrder = (req, res, next) => {
    const { id } = req.params;
    models.Orders.findByIdAndDelete(id).exec()
        .then(response => {
            // Deletion of a non-existing document is a no-op
            if (response === null) {
                console.log(`No entries found for ID ${id}.`)
                return next();
            }
            res.locals.deletedId = response._id
            return next();
        })
        .catch(error => next(createError(error, 'deleteOrder')));
};

module.exports = ordersController;