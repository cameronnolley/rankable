import React, { useState, useEffect } from "react";
import Multiselect from "multiselect-react-dropdown";
import './ArtistFilter.css'
import getArtists from "../../util/getArtists";

const ArtistFilter = (props) => {
    let [options, setOptions] = useState([]);
    let [selectedValues, setSelectedValues] = useState([]);

    useEffect(() => {
        setOptions(getArtists(props.albums));
    }, [props.albums]);

    useEffect(() => {
        if (options.length > 0) {
            setSelectedValues(props.queryParams.map(artist => options.find(option => option.name === artist)));
        }
    }, [options])

    return (
        <Multiselect id='artist-filter'
        options={options} // Options to display in the dropdown
        selectedValues={selectedValues} // Preselected value to persist in dropdown
        onSelect={props.onSelect} // Function will trigger on select event
        onRemove={props.onRemove} // Function will trigger on remove event
        displayValue="name" // Property name to display in the dropdown options
        avoidHighlightFirstOption='true'
        placeholder={'Artists'}
        closeIcon={'cancel'}
        hidePlaceholder={'true'}
        closeOnSelect={'true'}
        // showArrow={'true'}
        />     
    )

}

export default ArtistFilter;