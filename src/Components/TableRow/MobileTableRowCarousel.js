import React, { useState } from "react";
import './MobileTableRowCarousel.css';
import { useSwipeable } from "react-swipeable";


export const MobileCarouselItem = ({children, width}) => {
    return (
        <div className="mobile-carousal-item" style={{width: width}}>
            {children}
        </div>
    );
}

export const MobileCarousel = ({children}) => {
    const [activeIndex, setActiveIndex] = useState(0);
    
    const updateIndex = (newIndex) => {
        setActiveIndex(newIndex);
    }

    const handlers = useSwipeable({
        onSwipedLeft: () => {activeIndex !== React.Children.count(children) - 1 && updateIndex(activeIndex + 1)},
        onSwipedRight: () => {activeIndex !== 0 && updateIndex(activeIndex - 1)},
        preventDefaultTouchmoveEvent: true,
        preventScrollOnSwipe: true
    });


    return (
        <div {...handlers} className="mobile-carousel">
            <div className="mobile-inner" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
                {React.Children.map(children, (child, index) => {
                    return React.cloneElement(child, {width: "100%" });
                })}
            </div>
            <div className='mobile-carousel-dots'>
                {React.Children.map(children, (child, index) => {
                    return (
                    <div className={`mobile-dot ${ activeIndex === index ? 'active' : ''}`} id={`dot-${index}`} onClick={() => updateIndex(index)}></div>
                    );
                })}
            </div>
        </div>
    );
}