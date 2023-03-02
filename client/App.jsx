import React from 'react';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import OrderSearch from './components/orderSearch';
import Root from './components/root';
import WorkOrder from './components/workOrder';

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
                element: <WorkOrder />,
            }
        ]
    }
]);

const App = () => <RouterProvider router={router} />;

export default App;