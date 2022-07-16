import React, { useState } from "react";
import './TableRowCarousel.css';



export const CarouselItem = ({children, width}) => {
    return (
        <div className="carousal-item" style={{width: width}}>
            {children}
        </div>
    );
}

export const Carousel = ({children}) => {
    const [activeIndex, setActiveIndex] = useState(0);
    
    const updateIndex = (newIndex) => {
        setActiveIndex(newIndex);
    }

    return (
        <div className="carousel">
            <div className="inner" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
                {React.Children.map(children, (child, index) => {
                    return React.cloneElement(child, {width: "100%" });
                })}
            </div>
            <div className='carousel-dots'>
                    <div className={`dot ${ activeIndex === 0 ? 'active' : ''}`} id='dot-0' onClick={() => updateIndex(0)}></div>
                    <div className={`dot ${ activeIndex === 1 ? 'active' : ''}`} id='dot-1' onClick={() => updateIndex(1)}></div>
            </div>
        </div>
    );
}