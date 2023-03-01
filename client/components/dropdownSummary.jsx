import React from "react";
import '../stylesheets/dropdown.scss';
import DropdownOptions from "./dropdownOptions";

function DropdownSummary(props) {
    const { id, defaultValue, valueList, onDropdownChange } = props;
    return (
        <select
            id={id}
            onChange={onDropdownChange}
            defaultValue={defaultValue}
        >
            <DropdownOptions defaultValue={defaultValue} valueList={valueList} />
        </select>
    );
}

export default DropdownSummary;