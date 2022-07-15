import Multiselect from "multiselect-react-dropdown";
import React, { useState, useEffect } from "react";
import './TypeSelect.css';
import { ExpandMoreRounded } from "@mui/icons-material";
import { ThemeProvider } from "@mui/system";
import theme from '../MuiTheme/Theme';

const TypeSelect = (props) => {
    let [selectedValues, setSelectedValues] = useState([]);
    let [options, setOptions] = useState([]);

    useEffect(() => {
        if (props.albums.length > 0) {
            setOptions(getTypeOptions(props.albums));
        }
    },  [props.albums])

    useEffect(() => {
        if (props.queryParams.length > 0 && options.length > 0) {
            setSelectedValues(props.queryParams.map(type => options.find(option => option.label === type)));
        }
    }, [options])

    useEffect(() => {
        if (props.albums.length > 0) {
            setOptions(getTypeOptions(filterTypes()));
        }
    }, [props.yearFilter, props.artistFilter])

    const getTypeOptions = (albums) => {
        let options = [];
        albums.forEach(album => {
            if (!options.some(type => type.label === album.type)) {
                options.push({
                    label: album.type,
                    value: album.type.toLowerCase()
                });
            }

        });
        return options;
    }

    const filterTypes = () => {
        let filteredAlbums = props.albums.map(album => album);
        if (props.artistFilter.length > 0) {
            props.albums.forEach(album => {
                if (Array.isArray(album.attributes.artistName)) {
                    if (album.attributes.artistName.some(artist => props.artistFilter.includes(artist)) === false) {
                        filteredAlbums.splice(filteredAlbums.findIndex(foundAlbum => foundAlbum === album), 1);
                    }
                } else { 
                    if ((props.artistFilter.some(artist => artist === album.attributes.artistName)) === false) {
                        filteredAlbums.splice(filteredAlbums.findIndex(foundAlbum => foundAlbum === album), 1);
                    }
                }
            });
        }
        if (props.yearFilter.length > 0) {
            let years = props.albums.filter(album => props.yearFilter.some(year => album.attributes.releaseDate.includes(year))).map(album => album);
            filteredAlbums = filteredAlbums.filter(album => years.includes(album));
        }
        console.log(filteredAlbums);
        return filteredAlbums;
    }



    return (
        <Multiselect id='type-select'
            options={options}
            selectedValues={selectedValues}
            displayValue="label"
            avoidHighlightFirstOption="true"
            singleSelect="true"
            placeholder="Type"
            showArrow="true"
            onSelect={props.onSelect}
            onRemove={props.onRemove}
            closeIcon={'cancel'}
            customArrow={<ThemeProvider theme={theme}><ExpandMoreRounded color="primary"/></ThemeProvider>}
        />
    )
}

export default TypeSelect;