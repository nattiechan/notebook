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

    useEffect(() => {
        fetch('/orders')
            .then(response => response.json())
            .then(results => results.map((record, index) => {
                // So we do not have to use DB ID as element IDs
                record.orderId = index;
                return record;
            }))
            .then(records => setSearchState({ ...searchState, orders: records }))
            .catch(error => console.error(error));
    }, []);

    const handleNameChange = (event) => {
        const noResultAlert = document.querySelector('#no-result');
        if (noResultAlert.style.display === 'inline') noResultAlert.style.display = 'none';
        const id = event.target.id;
        checkForInvalidId(id, Object.keys(searchState));
        const newSearchState = { ...searchState };
        updateValue(newSearchState, id, event.target.value, event);
        setSearchState(newSearchState);
    }

    const submitSearch = async (event) => {
        event.preventDefault();
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
                document.querySelector('form').reset();
            }
        } catch (error) {
            console.error(error.message);
        }
    }

    // TODO: Switch to different table layout based on screen size
    // https://blog.logrocket.com/developing-responsive-layouts-with-react-hooks/
    return (
        <section>
            <form onSubmit={submitSearch}>
                <div id='searchBy'>
                    <label>Search By: </label>
                    <input type='submit' />
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
                <span id='no-result'>No result found!</span>
            </form>
            <article>
                <SearchResultMobile orders={searchState.orders} />
            </article>
        </section>
    );
}

export default OrderSearch;