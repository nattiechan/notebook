import React, { useReducer } from "react";
import { initialState, WorkOrderContext, workOrderReducer } from "../contexts/workOrderContext";
import WorkOrder from "./workOrder";
import '../stylesheets/workOrderContainer.scss';

function WorkOrderContainer() {
    const [state, dispatch] = useReducer(workOrderReducer, initialState);

    return (
        <section id='workOrderContainer'>
            <WorkOrderContext.Provider value={[state, dispatch]}>
                <WorkOrder />
            </WorkOrderContext.Provider>
        </section>
    );
};

export default WorkOrderContainer;