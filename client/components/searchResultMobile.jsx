import React from 'react';
import '../stylesheets/searchResultMobile.scss';
import SearchMobileSetups from './searchMobileSetups';

function SearchResultMobile(props) {
    const { orders } = props;
    return (
        <section>
            {orders.map((order) => <ResultCardMobile key={order._id} order={order} />)}
        </section>
    )
}

function ResultCardMobile(props) {
    const { order } = props;
    const { firstName, lastName, orders, stringer, isOnCourt, notes } = order;

    return (
        <article className='resultCard'>
            <div id='name'>
                <label>Name:{' '}</label>
                <span>{firstName} {lastName}</span>
            </div>
            {orders.map(record => <SearchMobileSetups key={record._id} record={record} />)}
            <div id='stringer'>
                <label>Strung by:{' '}</label>
                <span>{stringer}</span>
            </div>
            <div id='on-court'>
                <label>On-Court?{' '}</label>
                <button id='on-court-indicator' className={isOnCourt ? 'yes' : 'no'} />
            </div>
            <div id='notes'>
                <label>Notes:{' '}</label>
                <p>{notes}</p>
            </div>

        </article>
    );
}

export default SearchResultMobile;