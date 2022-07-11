import Multiselect from "multiselect-react-dropdown";
import React from "react";
import './RankingSelect.css';

const RankingSelect = (props) => {

    const options = [
        { label: "Global", value: "global" },
        { label: "Personal", value: "personal" }
    ];

    const selectedValue = [
        { label: "Global", value: "global" }
    ]

    return (
        <Multiselect id='ranking-select'
            options={options}
            displayValue="label"
            avoidHighlightFirstOption="true"
            singleSelect="true"
            selectedValues={selectedValue}
            hidePlaceholder="true"
            placeholder=""
            showArrow="true"
            onSelect={props.onSelect}
        />
    )
}

export default RankingSelect;