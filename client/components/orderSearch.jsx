import React from 'react';
import { useEffect, useState } from 'react';
import '../stylesheets/orderSearch.scss';
import { checkForInvalidId, updateValue } from './componentHelper';
import SearchResultMobile from './searchResultMobile';

const initialState = {
    orders: [],
    firstName: '',
    lastName: '',
}

function OrderSearch() {
    const [searchState, setSearchState] = useState(initialState);
    // this is somewhat of a workaround in place of cache
    // TODO: Move this to a proper cache
    const [allOrders, setAllOrders] = useState([]);

    useEffect(() => {
        fetch('/orders')
            .then(response => response.json())
            .then(results => results.map((record, index) => {
                // So we do not have to use DB ID as element IDs
                record.orderId = index;
                return record;
            })
            ).then(records => {
                setSearchState({ ...searchState, orders: records });
                setAllOrders(records);
            }
            ).catch(error => console.error(error));
    }, []);

    const handleNameChange = (event) => {
        const alerts = document.querySelectorAll('.alert');
        alerts.forEach(alert => {
            if (alert.style.display === 'inline') alert.style.display = 'none';
        })
        const id = event.target.id;
        checkForInvalidId(id, Object.keys(searchState));
        const newSearchState = { ...searchState };
        updateValue(newSearchState, id, event.target.value, event);
        const inputs = document.querySelectorAll('input[type=search]');
        if (Array.from(inputs).every(input => input.value === '')) newSearchState.orders = allOrders;
        setSearchState(newSearchState);
    }

    const submitSearch = async (event) => {
        event.preventDefault();
        if (searchState.firstName === '' && searchState.lastName === '') {
            document.querySelector('#no-input').style.display = 'inline';
        } else {
            try {
                const response = await fetch('/orders/name?' + new URLSearchParams({
                    firstName: searchState.firstName,
                    lastName: searchState.lastName
                }));
                if (response.status !== 200) {
                    console.error(response.statusText);
                    document.querySelector('#no-result').style.display = 'inline';
                } else {
                    const result = await response.json();
                    setSearchState({ ...searchState, orders: result });
                }
            } catch (error) {
                console.error(error.message);
            }
        };
    }

    // TODO: Switch to different table layout based on screen size
    // https://blog.logrocket.com/developing-responsive-layouts-with-react-hooks/
    return (
        <section>
            <form onSubmit={submitSearch}>
                <div id='searchBy'>
                    <label>Search By: </label>
                    <input className='submit' type='submit' />
                </div>
                <div id='searchBars'>
                    <input
                        id='firstName'
                        type='search'
                        placeholder='First Name'
                        onChange={handleNameChange}
                    />
                    <input
                        id='lastName'
                        type='search'
                        placeholder='Last Name'
                        onChange={handleNameChange}
                    />
                </div>
                <span id='no-result' className='alert'>No result found!</span>
                <span id='no-input' className='alert'>Please enter first and/or last name.</span>
            </form>
            <article>
                <SearchResultMobile orders={searchState.orders} />
            </article>
        </section>
    );
}

export default OrderSearch;