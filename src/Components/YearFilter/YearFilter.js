import React, { useEffect, useRef, useState } from "react";
import './YearFilter.css';


const CarousalItem = ({children, width}) => {
    return (
        <div className="carousal-item" style={{width: width}}>
            {children}
        </div>
    );
}

const Carousal = ({children}) => {
    const [activeIndex, setActiveIndex] = useState(2);
    
    const updateIndex = (newIndex) => {
        if (newIndex < 0) {
            newIndex = 0;
        } else if (newIndex >= React.Children.count(children)) {
            newIndex = React.Children.count(children) - 1;
        }

        setActiveIndex(newIndex);
    }

    const getDecade = (index) => {
        switch (index) {
            case 0:
                return "2000's";
            case 1:
                return "2010's";
            case 2:
                return "2020's";
            default:
                return "Select years";
        }
    }

    return (
        <div className="carousal">
            <div className='indicators'>
                <button className='next-prev-button' onClick={() => {
                    updateIndex(activeIndex - 1);
                }}
                >
                    &lsaquo;
                </button>
                <span id='decade' >{getDecade(activeIndex)}</span>
                <button className='next-prev-button' onClick={() => {
                    updateIndex(activeIndex + 1);
                }}
                >
                    ›
                </button>
            </div>
            <div className="inner" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
                {React.Children.map(children, (child, index) => {
                    return React.cloneElement(child, {width: "100%" });
                })}
            </div>
        </div>
    );
}

export const YearFilter = (props) => {
    const [selectedList, setSelectedList] = useState([]);
    const [isOpen, setIsOpen] = useState([false]);
    
    useEffect(() => {
        document.getElementById('calendar').classList.toggle('display');
    }, [isOpen]);

    let calendarRef= useRef();

    useEffect(() => {
        let handler = (event) => {
            if (!calendarRef.current.contains(event.target)) {
                document.getElementById('calendar').classList.add('display');
            }
        };

        document.addEventListener('mousedown', handler);

        return () => {
            document.removeEventListener('mousedown', handler);
        };
    });

    useEffect(() => {
        props.onChange(selectedList);
    }, [selectedList])
    

    function yearHover(e) {
        e.target.classList.add("hover");
    }

    function yearHoverLeave(e) {
        e.target.classList.remove("hover");
        e.target.classList.remove("select-hover");
    }

    function selectYear(e) {
        
        if (e.target.classList.contains("selected")) {
            onRemoveSelectedItem(e.target.innerHTML)
            if (e.target.classList.contains('aughts')) {
                document.getElementById('select-all-aughts').classList.remove('selected');
            } else if (e.target.classList.contains('teens')) {
                document.getElementById('select-all-teens').classList.remove('selected');
            } else if (e.target.classList.contains('twenties')) {
                document.getElementById('select-all-twenties').classList.remove('selected');
            }
        } else {
            e.target.classList.toggle("selected");
            let newList = [...selectedList, e.target.innerHTML];
            setSelectedList(newList.sort());
        }
    }

    function selectDecade(e) {
        if (e.target.classList.contains('aughts')) {
            if (!e.target.classList.contains('selected')) {
                let pushedArray = aughts.filter(year => !selectedList.includes(year));
                setSelectedList([...selectedList, ...pushedArray]);
                Array.from(document.querySelectorAll('.aughts')).forEach((el) => el.classList.add('selected')); 
            } else {
                setSelectedList(selectedList.filter(year => !aughts.includes(year)))
                Array.from(document.querySelectorAll('.aughts')).forEach((el) => el.classList.remove('selected'));
                document.getElementById('select-all-aughts').innerHTML = 'Select All';
            }
        } else if (e.target.classList.contains('teens')) {
            if (!e.target.classList.contains('selected')) {
                let pushedArray = teens.filter(year => !selectedList.includes(year));
                setSelectedList([...selectedList, ...pushedArray]);
                Array.from(document.querySelectorAll('.teens')).forEach((el) => el.classList.add('selected')); 
            } else {
                setSelectedList(selectedList.filter(year => !teens.includes(year)))
                Array.from(document.querySelectorAll('.teens')).forEach((el) => el.classList.remove('selected'));
                document.getElementById('select-all-teens').innerHTML = 'Select All';
            }
        } else if (e.target.classList.contains('twenties')) {
            if (!e.target.classList.contains('selected')) {
                let pushedArray = twenties.filter(year => !selectedList.includes(year));
                setSelectedList([...selectedList, ...pushedArray]);
                Array.from(document.querySelectorAll('.twenties')).forEach((el) => el.classList.add('selected')); 
            } else {
                setSelectedList(selectedList.filter(year => !twenties.includes(year)))
                Array.from(document.querySelectorAll('.twenties')).forEach((el) => el.classList.remove('selected'));
                document.getElementById('select-all-twenties').innerHTML = 'Select All';
            }
        }
    }

    const aughts = ['2000', '2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009']
    const teens = ['2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019']
    const twenties = ['2020', '2021', '2022']
    
    function renderSelectedList() { 
        let chipArray = selectedList; 
        if (aughts.every(year => chipArray.includes(year))) {
            chipArray = chipArray.filter(year=> !aughts.includes(year));
            chipArray.push("2000's")
            chipArray.sort()
            document.getElementById('select-all-aughts').classList.add("selected");
            document.getElementById('select-all-aughts').innerHTML = 'Remove All'
        }
        if (teens.every(year => chipArray.includes(year))) {
            chipArray = chipArray.filter(year=> !teens.includes(year));
            chipArray.push("2010's")
            chipArray.sort();
            document.getElementById('select-all-teens').classList.add("selected");
            document.getElementById('select-all-teens').innerHTML = 'Remove All'
        }
        if (twenties.every(year => chipArray.includes(year))) {
            chipArray = chipArray.filter(year=> !twenties.includes(year));
            chipArray.push("2020's")
            chipArray.sort();
            document.getElementById('select-all-twenties').classList.add("selected");
            document.getElementById('select-all-twenties').innerHTML = 'Remove All'
        }
        if (selectedList.length === 0) {
            return <div className='placeholder' onClick={toggleCalendar} >Years</div>
        } else {
            return chipArray.map((value, index) => (
                <span className='chip-year' key={index}>
                    {value} <img
                    className="icon_cancel closeIcon" 
                    alt='Cancel icon'
                    src="data:image/svg+xml,%3Csvg%20height%3D%22512px%22%20id%3D%22Layer_1%22%20style%3D%22enable-background%3Anew%200%200%20512%20512%3B%22%20version%3D%221.1%22%20viewBox%3D%220%200%20512%20512%22%20width%3D%22512px%22%20xml%3Aspace%3D%22preserve%22%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%3E%20%20%20%20%3Cstyle%20type%3D%22text%2Fcss%22%3E%20%20%20%20%20%20%20%20.st0%7B%20%20%20%20%20%20%20%20%20%20%20%20fill%3A%23fff%3B%20%20%20%20%20%20%20%20%7D%20%3C%2Fstyle%3E%20%20%20%20%3Cpath%20class%3D%22st0%22%20d%3D%22M443.6%2C387.1L312.4%2C255.4l131.5-130c5.4-5.4%2C5.4-14.2%2C0-19.6l-37.4-37.6c-2.6-2.6-6.1-4-9.8-4c-3.7%2C0-7.2%2C1.5-9.8%2C4%20%20L256%2C197.8L124.9%2C68.3c-2.6-2.6-6.1-4-9.8-4c-3.7%2C0-7.2%2C1.5-9.8%2C4L68%2C105.9c-5.4%2C5.4-5.4%2C14.2%2C0%2C19.6l131.5%2C130L68.4%2C387.1%20%20c-2.6%2C2.6-4.1%2C6.1-4.1%2C9.8c0%2C3.7%2C1.4%2C7.2%2C4.1%2C9.8l37.4%2C37.6c2.7%2C2.7%2C6.2%2C4.1%2C9.8%2C4.1c3.5%2C0%2C7.1-1.3%2C9.8-4.1L256%2C313.1l130.7%2C131.1%20%20c2.7%2C2.7%2C6.2%2C4.1%2C9.8%2C4.1c3.5%2C0%2C7.1-1.3%2C9.8-4.1l37.4-37.6c2.6-2.6%2C4.1-6.1%2C4.1-9.8C447.7%2C393.2%2C446.2%2C389.7%2C443.6%2C387.1z%22%2F%3E%3C%2Fsvg%3E" 
                    onClick={() => onRemoveSelectedItem(value)}>
                    </img>
                </span>
            ));
        }
    }

    
    function onRemoveSelectedItem(item) {
        if (item === "2000's") {
            setSelectedList(selectedList.filter(year => !aughts.includes(year)))
            Array.from(document.querySelectorAll('.aughts')).forEach((el) => el.classList.remove('selected'));
            document.getElementById('select-all-aughts').innerHTML = 'Select All';
        } else if (item === "2010's") {
            setSelectedList(selectedList.filter(year => !teens.includes(year)))
            Array.from(document.querySelectorAll('.teens')).forEach((el) => el.classList.remove('selected'));
            document.getElementById('select-all-teens').innerHTML = 'Select All';
        } else if (item === "2020's") {
            setSelectedList(selectedList.filter(year => !twenties.includes(year)))
            Array.from(document.querySelectorAll('.twenties')).forEach((el) => el.classList.remove('selected'));
            document.getElementById('select-all-twenties').innerHTML = 'Select All';
        } else {
            setSelectedList(selectedList.filter(year => year !== item));
            document.getElementById(item).classList.remove("selected");
            if (document.getElementById(item).classList.contains('aughts')) {
                document.getElementById('select-all-aughts').classList.remove("selected");
            } else if (document.getElementById(item).classList.contains('teens')) {
                document.getElementById('select-all-teens').classList.remove("selected");
            } else if (document.getElementById(item).classList.contains('twenties')) {
                document.getElementById('select-all-twenties').classList.remove("selected");
            }
        }
		
    }

    function toggleCalendar() {
        setIsOpen(!isOpen);
    }

    function handleLabelClick(event) {
        if (event.target !== event.currentTarget) {
        } else {
            toggleCalendar();
        }
    }


    return (
        <div ref={calendarRef} >
            <div className='year-filter-container' id='year-filter-container' >
                <div className='chip-wrapper' onClick={handleLabelClick}>
                    {renderSelectedList()}
                </div>
            </div>
            <div className='calendar-wrapper' id='calendar'>
                <Carousal>
                <CarousalItem>
                    <div className='years-wrapper'>
                        <button className='year aughts first-year' onMouseEnter={yearHover} onMouseLeave={yearHoverLeave} onClick={selectYear} id='2000'>2000</button>
                        <button className='year aughts' onMouseEnter={yearHover} onMouseLeave={yearHoverLeave} onClick={selectYear} id='2001'>2001</button>
                        <button className='year aughts' onMouseEnter={yearHover} onMouseLeave={yearHoverLeave} onClick={selectYear} id='2002' >2002</button>
                        <button className='year aughts' onMouseEnter={yearHover} onMouseLeave={yearHoverLeave} onClick={selectYear} id='2003' >2003</button>
                        <button className='year aughts' onMouseEnter={yearHover} onMouseLeave={yearHoverLeave} onClick={selectYear} id='2004' >2004</button>
                        <button className='year aughts' onMouseEnter={yearHover} onMouseLeave={yearHoverLeave} onClick={selectYear} id='2005' >2005</button>
                        <button className='year aughts' onMouseEnter={yearHover} onMouseLeave={yearHoverLeave} onClick={selectYear} id='2006' >2006</button>
                        <button className='year aughts' onMouseEnter={yearHover} onMouseLeave={yearHoverLeave} onClick={selectYear} id='2007' >2007</button>
                        <button className='year aughts' onMouseEnter={yearHover} onMouseLeave={yearHoverLeave} onClick={selectYear} id='2008' >2008</button>
                        <button className='year aughts' onMouseEnter={yearHover} onMouseLeave={yearHoverLeave} onClick={selectYear} id='2009' >2009</button>
                        <button className='select-all aughts' id='select-all-aughts' onMouseEnter={yearHover} onMouseLeave={yearHoverLeave} onClick={selectDecade} >Select All</button>
                    </div>
                </CarousalItem>
                <CarousalItem>
                    <div className='years-wrapper'>
                        <button className='year teens first-year' onMouseEnter={yearHover} onMouseLeave={yearHoverLeave} onClick={selectYear} id='2010'>2010</button>
                        <button className='year teens' onMouseEnter={yearHover} onMouseLeave={yearHoverLeave} onClick={selectYear} id='2011'>2011</button>
                        <button className='year teens' onMouseEnter={yearHover} onMouseLeave={yearHoverLeave} onClick={selectYear} id='2012' >2012</button>
                        <button className='year teens' onMouseEnter={yearHover} onMouseLeave={yearHoverLeave} onClick={selectYear} id='2013' >2013</button>
                        <button className='year teens' onMouseEnter={yearHover} onMouseLeave={yearHoverLeave} onClick={selectYear} id='2014' >2014</button>
                        <button className='year teens' onMouseEnter={yearHover} onMouseLeave={yearHoverLeave} onClick={selectYear} id='2015' >2015</button>
                        <button className='year teens' onMouseEnter={yearHover} onMouseLeave={yearHoverLeave} onClick={selectYear} id='2016' >2016</button>
                        <button className='year teens' onMouseEnter={yearHover} onMouseLeave={yearHoverLeave} onClick={selectYear} id='2017' >2017</button>
                        <button className='year teens' onMouseEnter={yearHover} onMouseLeave={yearHoverLeave} onClick={selectYear} id='2018' >2018</button>
                        <button className='year teens' onMouseEnter={yearHover} onMouseLeave={yearHoverLeave} onClick={selectYear} id='2019' >2019</button>
                        <button className='select-all teens' id='select-all-teens' onMouseEnter={yearHover} onMouseLeave={yearHoverLeave} onClick={selectDecade} >Select All</button>
                    </div>
                </CarousalItem>
                <CarousalItem>
                    <div className='years-wrapper'>
                        <button className='year twenties first-year' onMouseEnter={yearHover} onMouseLeave={yearHoverLeave} onClick={selectYear} id='2020'>2020</button>
                        <button className='year twenties' onMouseEnter={yearHover} onMouseLeave={yearHoverLeave} onClick={selectYear} id='2021'>2021</button>
                        <button className='year twenties' onMouseEnter={yearHover} onMouseLeave={yearHoverLeave} onClick={selectYear} id='2022' >2022</button>
                        <button className='year twenties' onMouseEnter={yearHover} onMouseLeave={yearHoverLeave} onClick={selectYear} id='2023' disabled>2023</button>
                        <button className='year twenties' onMouseEnter={yearHover} onMouseLeave={yearHoverLeave} onClick={selectYear} id='2024' disabled>2024</button>
                        <button className='year twenties' onMouseEnter={yearHover} onMouseLeave={yearHoverLeave} onClick={selectYear} id='2025' disabled>2025</button>
                        <button className='year twenties' onMouseEnter={yearHover} onMouseLeave={yearHoverLeave} onClick={selectYear} id='2026' disabled>2026</button>
                        <button className='year twenties' onMouseEnter={yearHover} onMouseLeave={yearHoverLeave} onClick={selectYear} id='2027' disabled>2027</button>
                        <button className='year twenties' onMouseEnter={yearHover} onMouseLeave={yearHoverLeave} onClick={selectYear} id='2028' disabled>2028</button>
                        <button className='year twenties' onMouseEnter={yearHover} onMouseLeave={yearHoverLeave} onClick={selectYear} id='2029' disabled>2029</button>
                        <button className='select-all twenties' id='select-all-twenties' onMouseEnter={yearHover} onMouseLeave={yearHoverLeave} onClick={selectDecade} >Select All</button>
                    </div>
                </CarousalItem>
            </Carousal>                 
            </div>           
        </div>
    )
}