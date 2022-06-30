import React from "react";
import Multiselect from "multiselect-react-dropdown";
import './ArtistFilter.css'
import getArtists from "../../util/getArtists";
import albums from "../../database";

class ArtistFilter extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            options: getArtists(albums)
        };
    }

    onSelect(selectedList, selectedItem) {
        // this.props.onSelect(selectedList, selectedItem);
    }

    onRemove(selectedList, removedItem) {
    }

    render() {
        return (
            <Multiselect
            options={this.state.options} // Options to display in the dropdown
            selectedValues={this.state.selectedValue} // Preselected value to persist in dropdown
            onSelect={this.props.onSelect} // Function will trigger on select event
            onRemove={this.onRemove} // Function will trigger on remove event
            displayValue="name" // Property name to display in the dropdown options
            avoidHighlightFirstOption='true'
            placeholder={'Artists'}
            closeIcon={'cancel'}
            hidePlaceholder={'true'}
            // showArrow={'true'}
            />

            
        )
    }
}

export default ArtistFilter;