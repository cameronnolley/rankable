import React, { useState, useEffect } from "react";
import Multiselect from "multiselect-react-dropdown";
import './ArtistFilter.css'
import getArtists from "../../util/getArtists";
import { SearchRounded } from "@mui/icons-material";
import { ThemeProvider } from "@mui/system";
import { theme } from '../MuiTheme/Theme';

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

    useEffect( () => {
        setOptions(getArtists(filterArtists()));
    }, [props.yearFilter, props.typeFilter])

    const filterArtists = () => {
        let filteredAlbums = props.albums.map(album => album);

        if (props.yearFilter.length > 0) {
            filteredAlbums = filteredAlbums.filter(album => props.yearFilter.some(year => album.attributes.releaseDate.includes(year)));
        }

        if (props.typeFilter && props.typeFilter.length > 0) {
            let typeAlbums = props.albums.filter(album => props.typeFilter.includes(album.type));
            filteredAlbums = filteredAlbums.filter(album => typeAlbums.includes(album));
            console.log(filteredAlbums);
        }

        return filteredAlbums
    }



    return (
        <Multiselect id={props.id}
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
        customArrow={<ThemeProvider theme={theme} ><SearchRounded color="primary" fontSize="small"/></ThemeProvider>}
        showArrow={'true'}
        />     
    )

}

export default ArtistFilter;