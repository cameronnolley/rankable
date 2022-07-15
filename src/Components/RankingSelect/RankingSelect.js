import Multiselect from "multiselect-react-dropdown";
import React, { useEffect, useState } from "react";
import './RankingSelect.css';
import { ExpandMoreRounded } from "@mui/icons-material";
import { ThemeProvider } from "@mui/system";
import theme from '../MuiTheme/Theme';

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
            customArrow={<ThemeProvider theme={theme}><ExpandMoreRounded color="primary"/></ThemeProvider>}
        />
    )
}

export default RankingSelect;