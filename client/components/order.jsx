import React from 'react';
import DropdownSelect from './dropdown';
import '../stylesheets/order.scss';

function Order(props) {
    const { state, id, handleRemoveOrder } = props;
    return (
        <section className='racquet-string-tension'>
            <div id='first-order-row'>
                <label>
                    # of Racquets:{' '}
                    <input
                        type='number'
                        className='number-input'
                        value={state.defaultUnits.num_of_racquets}
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
            <label>Racquet: <input type='text' /></label>
            <label>
                String:{' '}
                <input type='text' id='main' className='halfsize-input' />
                {' / '}
                <input type='text' id='cross' className='halfsize-input' />
            </label>
            <label>
                Tension:{' '}
                <input type='text' id='main' className='number-input' />
                {' / '}
                <input type='text' id='cross' className='number-input' />
                {' '}
                <DropdownSelect
                    selectId='tension-units'
                    defaultValue={state.defaultUnits.tension_measuring_unit}
                    valueList={['kg']}
                />
            </label>
            <label>
                Pre-stretch:{' '}
                <DropdownSelect
                    defaultValue={state.defaultEmptyValue}
                    valueList={['5%', '10%', '15%', '20%', 'By hand']}
                />
                {' / '}
                <DropdownSelect
                    defaultValue={state.defaultEmptyValue}
                    valueList={['5%', '10%', '15%', '20%', 'By hand']}
                />
            </label>
            <label>
                Knots:{' '}
                <DropdownSelect
                    defaultValue={state.defaultUnits.num_of_knots}
                    valueList={[2]}
                />
            </label>
            <label>
                Logo:{' '}
                <DropdownSelect
                    defaultValue={state.defaultEmptyValue}
                    valueList={['Red', 'Black', 'White', 'See notes']}
                />
            </label>
        </section>
    );
};

export default Order;