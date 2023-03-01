import React from "react";
import { Link, Outlet } from 'react-router-dom';
import '../stylesheets/root.scss';

function Root() {
    return (
        <>
            <header>
                <ul>
                    <li>
                        <Link
                            className='header-link'
                            to={'/'}
                        >
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link
                            className='header-link'
                            to={'/workorder'}
                        >
                            Orders
                        </Link>
                    </li>
                </ul>
            </header>
            <div id='mainPage'>
                <Outlet />
            </div>
        </>
    );
}

export default Root;