import React from "react";

function DropdownOptions(props) {
    const { defaultValue, valueList } = props;
    return (
        <>
            <option value={defaultValue}>{defaultValue}</option>
            {
                valueList.map(value =>
                    <option key={value} value={value}>{value}</option>
                )
            }
        </>
    );
}

export default DropdownOptions;