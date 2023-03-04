const ORDER_ID_KEY = 'orderId';

export const processKeys = (keyArray, currentState, initialObj = {}) => {
    keyArray.forEach(key =>
        initialObj[key] = currentState.defaultUnits.hasOwnProperty(key) ?
            currentState.defaultUnits[key] : ''
    );
    return initialObj;
}

export const createAndAddNewOrderToState = (keyArray, currentState) => {
    const initialOrder = {};
    initialOrder[ORDER_ID_KEY] = currentState.nextOrderId;
    return {
        ...currentState,
        nextOrderId: currentState.nextOrderId + 1,
        orders: [...currentState.orders, processKeys(keyArray, currentState, initialOrder)]
    };
}

export const updateValue = (obj, key, value, event) => {
    obj[key] = event.target.type === 'number' ? Number(value) : value;
}

export const checkForInvalidId = (id, keyArray) => {
    if (!keyArray.includes(id)) throw new Error(`Invalid element ID ${id}`);
}