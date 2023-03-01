import React from "react";
import '../stylesheets/dropdown.scss';

function DropdownSelect(props) {
    const { selectId, defaultValue, valueList } = props;
    return (
        <select id={selectId ? selectId : ''} defaultValue={defaultValue}>
            <option value={defaultValue}>{defaultValue}</option>
            {
                valueList.map(value =>
                    <option key={value} value={value}>{value}</option>
                )
            }
        </select>
    );
}

export default DropdownSelect;