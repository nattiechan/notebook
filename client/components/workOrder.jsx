import React from 'react';
import {
    CREATE_NEW_STATE,
    CREATE_NEW_ORDER,
    RESET_ORDER,
    UPDATE_ORDER,
    REMOVE_ORDER,
    UPDATE_ORDER_SUMMARY
} from '../contexts/actionTypes';
import Order from './order';
import { useEffect } from 'react';
import '../stylesheets/workOrder.scss';
import DropdownSummary from './dropdownSummary';
import { populateStateTemplate, useWorkOrderContext } from '../contexts/workOrderContext';
import { ORDER_ID_KEY } from '../contexts/workOrderContextHelper';

function WorkOrder() {
    const [state, dispatch] = useWorkOrderContext();

    useEffect(() => {
        fetch('/orders/schemaKeys')
            .then(response => response.json())
            .then(result => {
                populateStateTemplate(result);
                return result;
            })
            .then(result => dispatch({ type: CREATE_NEW_STATE, payload: result }));
    }, []);

    const handleMoreOrderClick = (event) => {
        event.preventDefault();
        dispatch({ type: CREATE_NEW_ORDER });
    };

    const handleRemoveOrderClick = (event) => {
        event.preventDefault();
        dispatch({ type: REMOVE_ORDER, orderId: event.target.id });
    };

    const handleOrderChange = (orderId, event, populateValueToId) => {
        if (orderId === null || orderId === undefined) throw new Error('Invalid ID input');
        const { id, value } = event.target;
        const keysToUpdate = {};
        keysToUpdate[id] = value;
        if (populateValueToId !== undefined) {
            const elementToPopulateValue = document
                .querySelector(`section[id="${orderId}"]`)
                .querySelector(`#${populateValueToId}`);
            if (elementToPopulateValue.value === '') {
                elementToPopulateValue.placeholder = value;
                keysToUpdate[populateValueToId] = value;
            }
        }
        dispatch({ type: UPDATE_ORDER, orderId: orderId, keysToUpdate: keysToUpdate, event: event })
    }

    const handleChange = (event, targetValue) => {
        const { id, value } = event.target;
        if (targetValue === undefined) targetValue = value;
        dispatch({ type: UPDATE_ORDER_SUMMARY, key: id, value: targetValue, event: event });
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
        dispatch({ type: UPDATE_ORDER_SUMMARY, key: dueDateKey, value: dueDate, event: event });
    }

    const processDateIn = () => {
        const date = state.defaultUnits.date_in;
        return `${new Date(date).toLocaleDateString(navigator.language)} ${new Date(date).toLocaleTimeString(navigator.language)}`
    }

    const submitOrder = (event) => {
        event.preventDefault();
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
        })
            .then(response => {
                if (response.status !== 200) {
                    console.error(response.statusText);
                    alert('Failed to submit order. Please try again.')
                } else {
                    dispatch({ type: RESET_ORDER })
                    document.querySelector('form').reset();
                    document.querySelector('#cross_string').placeholder = '';
                    document.querySelector('#cross_tension').placeholder = '';
                    alert('Order submitted!');
                }
            })
            .catch(error => console.error(error.message));
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
            <input className='longSubmit' type='submit' />
        </form>
    )

};

export default WorkOrder;