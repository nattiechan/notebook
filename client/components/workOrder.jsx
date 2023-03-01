import React from 'react';
import Order from './order';
import { useEffect, useState } from 'react';
import '../stylesheets/workOrder.scss';
import DropdownSelect from './dropdown';

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
        'date_in': new Date().toISOString()
    },
};

function WorkOrder() {
    const [state, setState] = useState(initialState);

    const createNewOrderState = (json) => {
        const initialSummary = {};
        const initialOrder = { orderId: state.nextOrderId };
        const summaryKeyArray = json ? json.summaryKeys : state.summaryKeys;
        const orderKeyArray = json ? json.orderKeys : state.orderKeys;
        const processKeys = (keyArray, initialObj) => {
            keyArray.forEach(key =>
                initialObj[key] = state.defaultUnits.hasOwnProperty(key) ?
                    state.defaultUnits[key] : ''
            );
        }
        processKeys(summaryKeyArray, initialSummary);
        processKeys(orderKeyArray, initialOrder);
        const newState = {
            ...state,
            nextOrderId: state.nextOrderId + 1,
            orderSummary: initialSummary,
            orders: [...state.orders, initialOrder]
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
            .then(result => createNewOrderState(result));
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

    const handleOrderChange = (orderId, eventId, targetValue) => {
        checkForInvalidId(eventId, state.orderKeys);
        // TODO
    }

    const handleChange = (eventId, targetValue) => {
        checkForInvalidId(eventId, state.summaryKeys);
        setState({ ...state, orderSummary: { ...state.orderSummary, eventId: targetValue } });
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
        const newOrderSummary = { ...state.orderSummary };
        newOrderSummary[dueDateKey] = dueDate;
        setState({ ...state, orderSummary: newOrderSummary });

    }

    const processDateIn = () => {
        const date = state.defaultUnits.date_in;
        return `${new Date(date).toLocaleDateString(navigator.language)} ${new Date(date).toLocaleTimeString(navigator.language)}`
    }

    // TODO: on submit, need to validate due date
    return (
        <form className='workOrder'>
            <label>
                On-Court:{' '}
                <input
                    id='isOnCourt'
                    type='checkbox'
                    onChange={(event) => handleChange(event.target.id, event.target.checked)}
                />
            </label>
            <label>Date in: {processDateIn()}</label>
            <label>
                Due Date:{' '}
                <input
                    id='due_timestamp'
                    type='datetime-local'
                    onChange={handleDueDateChange}
                />
            </label>
            <label>First Name: <input type='text' /></label>
            <label>Last Name: <input type='text' /></label>
            {
                state.orders.map(order =>
                    <Order
                        state={state}
                        id={order.orderId}
                        handleRemoveOrder={handleRemoveOrderClick}
                        key={order.orderId}
                    />
                )
            }
            <div>
                <button id='more-orders' onClick={handleMoreOrderClick}>+</button>
                <span>{' '}</span>
                <span>More setups to record</span>
            </div>
            <label id='notes'>
                Notes:{' '}
                <textarea />
            </label>
            <label>Stringer: <input type='text' /></label>
            <label>Total: <input type='text' /></label>
            <label>
                Paid:{' '}
                <input
                    id='isPaid'
                    type='checkbox'
                    onChange={(event) => handleChange(event.target.id, event.target.checked)}
                />
            </label>
            <label>
                Payment method:{' '}
                <DropdownSelect
                    defaultValue={state.defaultEmptyValue}
                    valueList={['Cash', 'Credit Card', 'Debit Card', 'e-Transfer', 'Comp']}
                />
            </label>
        </form>
    )

};

export default WorkOrder;