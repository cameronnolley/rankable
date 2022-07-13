import Multiselect from "multiselect-react-dropdown";
import React from "react";
import './TypeSelect.css';

const TypeSelect = (props) => {


    return (
        <Multiselect id='type-select'
            options={props.options}
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