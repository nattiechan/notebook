import React, { createContext, useContext } from 'react';
import {
    CREATE_NEW_STATE,
    CREATE_NEW_ORDER,
    RESET_ORDER,
    UPDATE_ORDER,
    REMOVE_ORDER,
    UPDATE_ORDER_SUMMARY
} from './actionTypes';
import {
    checkForInvalidId,
    createAndAddNewOrderToState,
    processKeys,
    updateValue
} from './workOrderContextHelper';

export const initialStateTemplate = {
    orderSummary: {},
    summaryKeys: [],
    orders: [],
    orderKeys: [],
    nextOrderId: 1,
    defaultEmptyValue: '',
    // The keys should always be in sync with the schema in `dbModels.js`
    defaultUnits: {
        'tension_measuring_unit': 'lbs',
        'num_of_knots': 4,
        'num_of_racquets': 1,
        'isOnCourt': false,
        'isPaid': false,
        'date_in': new Date().toISOString()
    },
};

export const initialState = { ...initialStateTemplate };

export const WorkOrderContext = createContext(initialState);

export const useWorkOrderContext = () => useContext(WorkOrderContext);

export const populateStateTemplate = (json) => {
    // Populating the template to assist in resetting the form upon submission
    initialStateTemplate.summaryKeys = json.summaryKeys;
    initialStateTemplate.orderKeys = json.orderKeys;
}

export function workOrderReducer(state, action) {
    switch (action.type) {
        case CREATE_NEW_STATE: {
            const { payload } = action;
            if (payload === undefined) throw new Error(`Expected JSON from initial fetch request not found.`);
            // React invoke reducer several times for internal purpose in Strict Mode
            // so this is to ensure dev is showing the same as prod
            // Reference: https://stackoverflow.com/questions/72068781/usereducer-dispatch-being-called-twice
            else if (state.orders.length === 1) return state;
            const { summaryKeys, orderKeys } = payload;
            const initialSummary = processKeys(summaryKeys, state);
            return {
                ...createAndAddNewOrderToState(orderKeys, state),
                orderSummary: initialSummary,
                summaryKeys: summaryKeys,
                orderKeys: orderKeys
            };
        }
        case CREATE_NEW_ORDER: {
            const { orderKeys } = state;
            return createAndAddNewOrderToState(orderKeys, state);
        }
        case REMOVE_ORDER: {
            const { orderId } = action;
            const newOrders = state.orders.filter(order => order.orderId !== Number(orderId));
            return { ...state, orders: newOrders };
        }
        case UPDATE_ORDER_SUMMARY: {
            const { key, value, event } = action;
            const { summaryKeys, orderSummary } = state;
            checkForInvalidId(key, summaryKeys);
            const newOrderSummary = { ...orderSummary };
            updateValue(newOrderSummary, key, value, event);
            return { ...state, orderSummary: newOrderSummary };
        }
        case UPDATE_ORDER: {
            const { orderId, keysToUpdate, event } = action;
            const { orderKeys } = state;
            const newOrders = [...state.orders];
            newOrders.forEach(record => {
                if (record.orderId === Number(orderId)) {
                    for (const key in keysToUpdate) {
                        checkForInvalidId(key, orderKeys);
                        updateValue(record, key, keysToUpdate[key], event);
                    }
                }
            })
            return { ...state, orders: newOrders };
        }
        case RESET_ORDER: {
            if (
                initialStateTemplate.summaryKeys.length === 0 ||
                initialStateTemplate.orderKeys.length === 0
            ) throw new Error('Empty summary and/or order keys in template.')
            return initialStateTemplate;
        }
        default: return state;
    }

}