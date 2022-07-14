import Multiselect from "multiselect-react-dropdown";
import React, { useState, useEffect } from "react";
import './TypeSelect.css';

const TypeSelect = (props) => {
    let [selectedValues, setSelectedValues] = useState([]);

    useEffect(() => {
        if (props.queryParams.length > 0 && props.options.length > 0) {
            setSelectedValues(props.queryParams.map(type => props.options.find(option => option.label === type)));
        }
    }, [props.options])

    return (
        <Multiselect id='type-select'
            options={props.options}
            selectedValues={selectedValues}
            displayValue="label"
            avoidHighlightFirstOption="true"
            singleSelect="true"
            placeholder="Type"
            showArrow="true"
            onSelect={props.onSelect}
            onRemove={props.onRemove}
            closeIcon={'cancel'}
        />
    )
}

export default TypeSelect;