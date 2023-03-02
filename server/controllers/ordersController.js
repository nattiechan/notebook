const models = require('../models/dbModels');

const createErrorMessage = (methodName) => {
    return { err: `An error occurred in ordersController.${methodName}` };
};

const createError = (error, methodName) => {
    return {
        log: error.message,
        message: createErrorMessage(methodName),
    };
};

const ordersController = {};

ordersController.getSchemaKeys = (_, res, next) => {
    const processKeys = (obj) => Object.keys(obj).filter(key => !(/^_/.test(key)));
    res.locals.summaryKeys = processKeys(models.Orders.schema.paths);
    res.locals.orderKeys = processKeys(models.Orders.schema.path('orders').schema.paths);
    return next();
}

ordersController.getAllOrders = (_, res, next) => {
    models.Orders.find({}).exec()
        .then(response => {
            if (response.length === 0) {
                return next(
                    {
                        log: 'No entries found in database.',
                        message: createErrorMessage('getAllOrders')
                    }
                );
            }
            res.locals.allOrders = response;
            return next();
        })
        .catch(error => next(createError(error, 'getAllOrders')));
}

ordersController.getOrders = (req, res, next) => {
    const { firstName, lastName } = req.query;
    const generateQuery = () => {
        const generateRegexQuery = (string) => {
            return { $regex: string, $options: 'i' };
        }
        const isEmptyFirstName = firstName === '' || firstName === undefined;
        const isEmptyLastName = lastName === '' || lastName === undefined;
        let query;
        if (isEmptyFirstName && isEmptyLastName) {
            return next(
                {
                    log: 'Empty query parameter',
                    message: createErrorMessage('getOrders')
                }
            );
        } else if (!isEmptyFirstName && !isEmptyLastName) {
            query = {
                firstName: generateRegexQuery(firstName),
                lastName: generateRegexQuery(lastName)
            };
        }
        else if (isEmptyFirstName) query = { lastName: generateRegexQuery(lastName) }
        else if (isEmptyLastName) query = { firstName: generateRegexQuery(firstName) }
        else {
            return next(
                {
                    log: `Unable to generate query from firstName ${firstName} and lastName ${lastName}`,
                    message: createErrorMessage('getOrders')
                }
            );
        }
        return query;
    };
    const query = generateQuery();
    models.Orders.find(query).exec()
        .then(response => {
            if (response.length === 0) {
                return next(
                    {
                        log: `No entries found for name ${firstName} ${lastName}.`,
                        message: createErrorMessage('getOrders')
                    }
                );
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
    const { id } = req.query;
    if (id === undefined || id === null || id === '') {
        return next(
            {
                log: 'Empty id parameter.',
                message: createErrorMessage('deleteOrder')
            }
        );
    }
    models.Orders.findByIdAndDelete(id).exec()
        .then(response => {
            // Deletion of a non-existing document is a no-op
            if (response === null) {
                console.warn(`No entries found for ID ${id}.`)
                return next();
            }
            res.locals.deletedId = response._id
            return next();
        })
        .catch(error => next(createError(error, 'deleteOrder'))
        );
};

module.exports = ordersController;