import React from 'react';
import { useEffect, useState } from 'react';
import '../stylesheets/orderSearch.scss';
import SearchResultMobile from './searchResultMobile';

function OrderSearch() {
    const [orders, setOrders] = useState([]);
    useEffect(() => {
        fetch('/orders')
            .then(response => response.json())
            .then(results => results.map((record, index) => {
                // So we do not have to use DB ID as element IDs
                record.orderId = index;
                return record;
            }))
            .then(json => setOrders(json))
            .catch(error => console.log(error));
    }, []);

    // TODO: Switch to different table layout based on screen size
    // https://blog.logrocket.com/developing-responsive-layouts-with-react-hooks/
    return (
        <section>
            <form>
                <div id='searchBy'>
                    <label>Search By: </label>
                    <input type='submit' />
                </div>
                <div id='searchBars'>
                    <input type='search' placeholder='First Name' />
                    <input type='search' placeholder='Last Name' />
                </div>
            </form>
            <article>
                <SearchResultMobile orders={orders} />
            </article>
        </section>
    );
}

export default OrderSearch;