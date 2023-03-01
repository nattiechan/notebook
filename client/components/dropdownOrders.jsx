import React from "react";
import '../stylesheets/dropdown.scss';
import DropdownOptions from "./dropdownOptions";

function DropdownOrders(props) {
    const { id, orderId, defaultValue, valueList, onDropdownChange } = props;
    return (
        <select
            id={id}
            onChange={(event) => onDropdownChange(orderId, event)}
            defaultValue={defaultValue}
        >
            <DropdownOptions defaultValue={defaultValue} valueList={valueList} />
        </select>
    );
}

export default DropdownOrders;