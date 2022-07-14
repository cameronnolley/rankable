import Multiselect from "multiselect-react-dropdown";
import React, { useEffect, useState } from "react";
import './RankingSelect.css';

const RankingSelect = (props) => {
    let [selectedValues, setSelectedValues] = useState([{ label: "Global", value: "global" }]);

    const options = [
        { label: "Global", value: "global" },
        { label: "Personal", value: "personal" }
    ];

    useEffect(() => {
        if (props.queryParams === 'personal') {
            setSelectedValues([{ label: "Personal", value: "personal" }]);
        } else {
            setSelectedValues([{ label: "Global", value: "global" }]);
        }
    }, [props.queryParams])




    return (
        <Multiselect id='ranking-select'
            options={options}
            displayValue="label"
            avoidHighlightFirstOption="true"
            singleSelect="true"
            selectedValues={selectedValues}
            hidePlaceholder="true"
            placeholder=""
            showArrow="true"
            onSelect={props.onSelect}
        />
    )
}

export default RankingSelect;