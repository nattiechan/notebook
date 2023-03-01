import React from 'react';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from './components/root';
import WorkOrder from './components/workOrder';

const router = createBrowserRouter([
    {
        element: <Root />,
        children: [
            {
                path: "/",
                element: <h1>Hello World!</h1>
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