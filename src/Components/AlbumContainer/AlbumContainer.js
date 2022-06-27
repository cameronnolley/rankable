import React from "react";
import Album from "../Album/Album";
import './AlbumContainer.css';

class AlbumContainer extends React.Component {
    render() {
        return (
            <div className='album-container'>
                <Album className='album'/>
                <Album className='album'/>
            </div>
        )
    }
}

export default AlbumContainer;