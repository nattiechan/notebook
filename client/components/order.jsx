import React from 'react';
import DropdownOrders from './dropdownOrders';
import '../stylesheets/order.scss';

function Order(props) {
    const { state, id, handleRemoveOrder, handleOrderChange } = props;
    return (
        <section id={id} className='racquet-string-tension'>
            <div id='first-order-row'>
                <label>
                    # of Racquets:{' '}
                    <input
                        id='num_of_racquets'
                        type='number'
                        className='number-input'
                        placeholder={state.defaultUnits.num_of_racquets}
                        onChange={(event) => handleOrderChange(id, event)}
                    />
                </label>
                <button
                    id={id}
                    onClick={handleRemoveOrder}
                    className='remove-order'
                >
                    -
                </button>
            </div>
            <label>Racquet:{' '}
                <input
                    id='racquet_name'
                    type='text'
                    onChange={(event) => handleOrderChange(id, event)}
                />
            </label>
            <label>
                String:{' '}
                <input
                    id='main_string'
                    type='text'
                    className='halfsize-input'
                    onChange={(event) => handleOrderChange(id, event, 'cross_string')}
                    required
                />
                {' / '}
                <input
                    id='cross_string'
                    type='text'
                    className='halfsize-input'
                    onChange={(event) => handleOrderChange(id, event)}
                />
            </label>
            <label>
                Tension:{' '}
                <input
                    id='main_tension'
                    type='number'
                    className='number-input'
                    onChange={(event) => handleOrderChange(id, event, 'cross_tension')}
                    required
                />
                {' / '}
                <input
                    id='cross_tension'
                    type='number'
                    className='number-input'
                    onChange={(event) => handleOrderChange(id, event)}
                />
                {' '}
                <DropdownOrders
                    id='tension_measuring_unit'
                    orderId={id}
                    defaultValue={state.defaultUnits.tension_measuring_unit}
                    valueList={['kg']}
                    onDropdownChange={handleOrderChange}
                />
            </label>
            <label>
                Pre-stretch:{' '}
                <DropdownOrders
                    id='main_pre_stretch'
                    orderId={id}
                    defaultValue={state.defaultEmptyValue}
                    valueList={['5%', '10%', '15%', '20%', 'By hand']}
                    onDropdownChange={handleOrderChange}
                />
                {' / '}
                <DropdownOrders
                    id='cross_pre_stretch'
                    orderId={id}
                    defaultValue={state.defaultEmptyValue}
                    valueList={['5%', '10%', '15%', '20%', 'By hand']}
                    onDropdownChange={handleOrderChange}
                />
            </label>
            <label>
                Knots:{' '}
                <DropdownOrders
                    id='num_of_knots'
                    orderId={id}
                    defaultValue={state.defaultUnits.num_of_knots}
                    valueList={[2]}
                    onDropdownChange={handleOrderChange}
                />
            </label>
            <label>
                Logo:{' '}
                <DropdownOrders
                    id='logo'
                    orderId={id}
                    defaultValue={state.defaultEmptyValue}
                    valueList={['Red', 'Black', 'White', 'See notes']}
                    onDropdownChange={handleOrderChange}
                />
            </label>
        </section>
    );
};

export default Order;