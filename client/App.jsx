import React from 'react';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import OrderSearch from './components/orderSearch';
import Root from './components/root';
import WorkOrderContainer from './components/workOrderContainer';

const router = createBrowserRouter([
    {
        element: <Root />,
        children: [
            {
                path: "/",
                element: <OrderSearch />
            },
            {
                path: "/workorder",
                element: <WorkOrderContainer />,
            }
        ]
    }
]);

const App = () => <RouterProvider router={router} />;

export default App;