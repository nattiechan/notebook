import React from 'react';
import Order from './order';
import { useEffect, useState } from 'react';
import '../stylesheets/workOrder.scss';
import DropdownSummary from './dropdownSummary';

const ORDER_ID_KEY = 'orderId';

const initialState = {
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

function WorkOrder() {
    const [state, setState] = useState(initialState);

    const createNewOrderState = (currentState = state, json = undefined) => {
        const initialSummary = {};
        const initialOrder = {};
        initialOrder[ORDER_ID_KEY] = state.nextOrderId;
        const summaryKeyArray = json ? json.summaryKeys : currentState.summaryKeys;
        const orderKeyArray = json ? json.orderKeys : currentState.orderKeys;
        const processKeys = (keyArray, initialObj) => {
            keyArray.forEach(key =>
                initialObj[key] = currentState.defaultUnits.hasOwnProperty(key) ?
                    currentState.defaultUnits[key] : ''
            );
        }
        processKeys(summaryKeyArray, initialSummary);
        processKeys(orderKeyArray, initialOrder);
        const newState = {
            ...currentState,
            nextOrderId: currentState.nextOrderId + 1,
            orderSummary: initialSummary,
            orders: [...currentState.orders, initialOrder]
        };
        if (json) {
            newState.summaryKeys = summaryKeyArray;
            newState.orderKeys = orderKeyArray;
        }
        setState(newState);
    }

    useEffect(() => {
        fetch('/orders/schemaKeys')
            .then(response => response.json())
            .then(result => createNewOrderState(state, result));
    }, []);

    const handleMoreOrderClick = (event) => {
        event.preventDefault();
        createNewOrderState();
    };

    const handleRemoveOrderClick = (event) => {
        event.preventDefault();
        const newOrders = state.orders.filter(order => order.orderId !== Number(event.target.id));
        setState({ ...state, orders: newOrders });
    };

    const checkForInvalidId = (id, keyArray) => {
        if (!keyArray.includes(id)) throw new Error(`Invalid element ID ${id}`);
    }

    const updateOrderSummary = (key, value, event) => {
        const newOrderSummary = { ...state.orderSummary };
        updateValue(newOrderSummary, key, value, event);
        setState({ ...state, orderSummary: newOrderSummary });
    }

    const updateValue = (obj, key, value, event) => {
        obj[key] = event.target.type === 'number' ? Number(value) : value;
    }

    const handleOrderChange = (orderId, event, populateValueToId) => {
        if (orderId === null || orderId === undefined) throw new Error('Invalid ID input');
        const orderKey = event.target.id;
        checkForInvalidId(orderKey, state.orderKeys);
        const value = event.target.value;
        const newOrders = [...state.orders];
        if (populateValueToId !== undefined) {
            const elementToPopulateValue = document
                .querySelector(`section[id="${orderId}"]`)
                .querySelector(`#${populateValueToId}`);
            elementToPopulateValue.placeholder = value;
            checkForInvalidId(populateValueToId, state.orderKeys);
        }
        newOrders.forEach(record => {
            if (record.orderId === Number(orderId)) {
                updateValue(record, orderKey, value, event);
                if (populateValueToId !== undefined) {
                    updateValue(record, populateValueToId, value, event);
                }
            }
        })
        setState({ ...state, orders: newOrders });
    }

    const handleChange = (event, targetValue) => {
        if (targetValue === undefined) targetValue = event.target.value;
        const id = event.target.id;
        checkForInvalidId(id, state.summaryKeys);
        updateOrderSummary(id, targetValue, event);
    }

    const handleDueDateChange = (event) => {
        // Only input type `datetime-local` provides a datepicker out of the box
        // The output, however, is in UTC. So we need to get the timezone from the
        // current datetime first, and then construct a timezone-aware date string manually
        // TODO: This may require some test mocking timezones - https://www.npmjs.com/package/timezone-mock
        // TODO: Double check this is getting client's timezone and not the server's
        const timezone = new Date().getTimezoneOffset() / 60;
        const timezoneHour = `${Math.abs(timezone).toString().padStart(2, '0')}:00`;
        // Reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getTimezoneOffset#negative_values_and_positive_values
        const timezoneString = timezone > 0 ? `-${timezoneHour}` : timezoneHour;
        const dueDate = new Date(`${event.target.value}:00${timezoneString}`).toISOString();
        const dueDateKey = 'due_timestamp';
        checkForInvalidId(dueDateKey, state.summaryKeys);
        updateOrderSummary(dueDateKey, dueDate, event);
    }

    const processDateIn = () => {
        const date = state.defaultUnits.date_in;
        return `${new Date(date).toLocaleDateString(navigator.language)} ${new Date(date).toLocaleTimeString(navigator.language)}`
    }

    const submitOrder = (event) => {
        event.preventDefault();
        console.log(state);
        // Technically `orderId` is used for the UI to track records
        // Since orders can be filtered the IDs may not be completely sequential
        // so it may be cleaner to put new `orderID` keys in every time we need to display the records
        const cleanedOrders = state.orders.map(record => {
            delete record[ORDER_ID_KEY];
            return record;
        });
        fetch('/orders', {
            method: 'POST',
            body: JSON.stringify({ ...state.orderSummary, orders: cleanedOrders }),
            headers: { 'Content-type': 'application/json; charset=UTF-8' }
        }).catch(error => console.log(error.message));
        // alert('here');
    }

    // TODO: on submit, need to validate due date
    return (
        <form onSubmit={submitOrder} className='workOrder'>
            <label>
                On-Court:{' '}
                <input
                    id='isOnCourt'
                    type='checkbox'
                    onChange={(event) => handleChange(event, event.target.checked)}
                />
            </label>
            <label>Date in: {processDateIn()}</label>
            <label>
                Due Date:{' '}
                <input
                    id='due_timestamp'
                    type='datetime-local'
                    onChange={handleDueDateChange}
                    required
                />
            </label>
            <label>
                First Name:{' '}
                <input
                    id='firstName'
                    type='text'
                    onChange={handleChange}
                    required
                />
            </label>
            <label>Last Name:{' '}
                <input
                    id='lastName'
                    type='text'
                    onChange={handleChange}
                    required
                />
            </label>
            {
                state.orders.map(order =>
                    <Order
                        state={state}
                        id={order.orderId}
                        handleRemoveOrder={handleRemoveOrderClick}
                        handleOrderChange={handleOrderChange}
                        key={order.orderId}
                    />
                )
            }
            <div>
                <button id='more-orders' onClick={handleMoreOrderClick}>+</button>
                <span>{' '}</span>
                <span>More setups to record</span>
            </div>
            <label id='noteLabel'>
                Notes:{' '}
                <textarea
                    id='notes'
                    onChange={handleChange}
                />
            </label>
            <label>Stringer:{' '}
                <input
                    id='stringer'
                    type='text'
                    onChange={handleChange}
                /></label>
            <label>Total:{' '}
                <input
                    id='total_cost'
                    type='number'
                    onChange={handleChange}
                /></label>
            <label>
                Paid:{' '}
                <input
                    id='isPaid'
                    type='checkbox'
                    onChange={(event) => handleChange(event, event.target.checked)}
                />
            </label>
            <label>
                Payment method:{' '}
                <DropdownSummary
                    id='payment_method'
                    defaultValue={state.defaultEmptyValue}
                    valueList={['Cash', 'Credit Card', 'Debit Card', 'e-Transfer', 'Comp']}
                    onDropdownChange={handleChange}
                />
            </label>
            <input type='submit' />
        </form>
    )

};

export default WorkOrder;