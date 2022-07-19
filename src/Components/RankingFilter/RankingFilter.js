import React, { useEffect, useRef, useState } from "react";
import './RankingFilter.css';
import $ from 'jquery';
import { ExpandMoreRounded } from "@mui/icons-material";
import { ThemeProvider } from "@mui/system";
import theme from '../MuiTheme/Theme';
import { Slider } from "@mui/material";
import { RadioGroup } from "@mui/material";
import {FormControl} from "@mui/material";
import {FormControlLabel} from "@mui/material";
import {FormLabel} from "@mui/material";
import { Radio } from "@mui/material";

export const RankingFilter = (props) => {
    let [selectedList, setSelectedList] = useState([]);
    let [isOpen, setIsOpen] = useState(false);
    let [count, setCount] = useState(0);
    let [sliderValue, setSliderValue] = useState();
    let [aughts, setAughts] = useState(['2000', '2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009']);
    let [teens, setTeens] = useState(['2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019']);
    let [twenties, setTwenties] = useState(['2020', '2021', '2022']);
    
    useEffect(() => {
        if (count > 0) {
            document.getElementById('ranking-slider').classList.toggle('display');
        }
    }, [isOpen]);

    useEffect(() => {
        if (props.albums.length > 0) {
            setSliderValue(props.albums.length);
        }
    }, [props.albums]);

    let calendarRef= useRef();

    useEffect(() => {
        let handler = (event) => {
            if (!calendarRef.current.contains(event.target)) {
                document.getElementById('ranking-slider').classList.add('display');
            }
        };

        document.addEventListener('mousedown', handler);

        return () => {
            document.removeEventListener('mousedown', handler);
        };
    });

    useEffect(() => {
        // props.onChange(selectedList);
    }, [selectedList]);


    let searchParams = new URLSearchParams(window.location.search);

    
    function renderSelectedList() { 
        let chipValue; 
        let sliderValues = [10, 20, 50, 100, 200]
        if (sliderValues.some(value => value === sliderValue)) {
            return (
                <div className='chip-container'>
                    <span className='chip-ranking'>
                        {`Top ${sliderValue}`} <img
                        className="icon_cancel closeIcon" 
                        alt='Cancel icon'
                        src="data:image/svg+xml,%3Csvg%20height%3D%22512px%22%20id%3D%22Layer_1%22%20style%3D%22enable-background%3Anew%200%200%20512%20512%3B%22%20version%3D%221.1%22%20viewBox%3D%220%200%20512%20512%22%20width%3D%22512px%22%20xml%3Aspace%3D%22preserve%22%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%3E%20%20%20%20%3Cstyle%20type%3D%22text%2Fcss%22%3E%20%20%20%20%20%20%20%20.st0%7B%20%20%20%20%20%20%20%20%20%20%20%20fill%3A%23fff%3B%20%20%20%20%20%20%20%20%7D%20%3C%2Fstyle%3E%20%20%20%20%3Cpath%20class%3D%22st0%22%20d%3D%22M443.6%2C387.1L312.4%2C255.4l131.5-130c5.4-5.4%2C5.4-14.2%2C0-19.6l-37.4-37.6c-2.6-2.6-6.1-4-9.8-4c-3.7%2C0-7.2%2C1.5-9.8%2C4%20%20L256%2C197.8L124.9%2C68.3c-2.6-2.6-6.1-4-9.8-4c-3.7%2C0-7.2%2C1.5-9.8%2C4L68%2C105.9c-5.4%2C5.4-5.4%2C14.2%2C0%2C19.6l131.5%2C130L68.4%2C387.1%20%20c-2.6%2C2.6-4.1%2C6.1-4.1%2C9.8c0%2C3.7%2C1.4%2C7.2%2C4.1%2C9.8l37.4%2C37.6c2.7%2C2.7%2C6.2%2C4.1%2C9.8%2C4.1c3.5%2C0%2C7.1-1.3%2C9.8-4.1L256%2C313.1l130.7%2C131.1%20%20c2.7%2C2.7%2C6.2%2C4.1%2C9.8%2C4.1c3.5%2C0%2C7.1-1.3%2C9.8-4.1l37.4-37.6c2.6-2.6%2C4.1-6.1%2C4.1-9.8C447.7%2C393.2%2C446.2%2C389.7%2C443.6%2C387.1z%22%2F%3E%3C%2Fsvg%3E" 
                        onClick={() => onRemoveSelectedItem(chipValue)}>
                        </img>
                    </span>
                    <ThemeProvider theme={theme}>
                        <ExpandMoreRounded color="primary" baseClassName="icon" id="ranking-filter-icon-chip" onClick={toggleSlider}/>
                    </ThemeProvider>
                </div>
            );
        } else {
            return (
                <div className='placeholder' onClick={toggleSlider} >
                    <p className='placeholder-text'>Ranking</p>
                    <ThemeProvider theme={theme}>
                        <ExpandMoreRounded color="primary" baseClassName="icon" id="ranking-filter-icon"/>
                    </ThemeProvider>
                </div>
            )
        }
    }

    
    function onRemoveSelectedItem(item) {
        if (item === "2000's") {
            setSelectedList(selectedList.filter(year => !aughts.includes(year)))
            Array.from(document.querySelectorAll('.aughts')).forEach((el) => el.classList.remove('year-selected'));
            document.getElementById('select-all-aughts').innerHTML = 'Select All';
        } else if (item === "2010's") {
            setSelectedList(selectedList.filter(year => !teens.includes(year)))
            Array.from(document.querySelectorAll('.teens')).forEach((el) => el.classList.remove('year-selected'));
            document.getElementById('select-all-teens').innerHTML = 'Select All';
        } else if (item === "2020's") {
            setSelectedList(selectedList.filter(year => !twenties.includes(year)))
            Array.from(document.querySelectorAll('.twenties')).forEach((el) => el.classList.remove('year-selected'));
            document.getElementById('select-all-twenties').innerHTML = 'Select All';
        } else {
            setSelectedList(selectedList.filter(year => year !== item));
            document.getElementById(item).classList.remove("year-selected");
            if (document.getElementById(item).classList.contains('aughts')) {
                document.getElementById('select-all-aughts').classList.remove("year-selected");
                document.getElementById('select-all-aughts').innerHTML = 'Select All';
            } else if (document.getElementById(item).classList.contains('teens')) {
                document.getElementById('select-all-teens').classList.remove("year-selected");
                document.getElementById('select-all-teens').innerHTML = 'Select All';
            } else if (document.getElementById(item).classList.contains('twenties')) {
                document.getElementById('select-all-twenties').classList.remove("year-selected");
                document.getElementById('select-all-twenties').innerHTML = 'Select All';
            }
        }
		
    }

    function toggleSlider() {
        setCount(1);
        setIsOpen(!isOpen);
    }

    function handleLabelClick(event) {
        if (event.target !== event.currentTarget) {
        } else {
            toggleSlider();
        }
    }

    const sliderValueChange = (event, newValue) => {
        setSliderValue(newValue);
        props.filterRanking(newValue);
    }
    

    const sliderMarks = [{value: 10, label: '10'}, {value: 20, label: '20'}, {value: props.albums.length, label: 'All'}];

    return (
        <div ref={calendarRef} >
            <div className='ranking-filter-container' id='ranking-filter-container' >
                <div className='chip-wrapper' onClick={handleLabelClick}>
                    {renderSelectedList()}
                </div>
            </div>
            <div className='ranking-slider display' id='ranking-slider'>
                <ThemeProvider theme={theme}>
                    <FormControl>
                        <RadioGroup row defaultValue="global" color='primary'>
                            <FormControlLabel value="global" control={<Radio color='secondary' size='small'/>} label="Global" sx={{color: '#cfcfcf', marginRight: '24px'}}/>
                            <FormControlLabel value="personal" control={<Radio color='secondary' size='small' id='radio-personal' />} label="Personal" sx={{color: '#cfcfcf'}}/>
                        </RadioGroup>
                    </FormControl>
                    <Slider 
                    color="secondary"
                    marks={sliderMarks}
                    step={null}
                    defaultValue={48}
                    max={props.albums.length} 
                    onChange={sliderValueChange}/>
                    
                </ThemeProvider>
            </div>           
        </div>
    )
}