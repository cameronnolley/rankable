import React from "react";
import Album from "../Album/Album";
import './AlbumContainer.css';
import albums from "../database";
import generatePairs from "../../util/gneratePairs";

const albumPairs = generatePairs(albums);

class AlbumContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            album1: '',
            album2: ''
        };

        this.getNewAlbums = this.getNewAlbums.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount() {
        this.getNewAlbums();
    }

    selectAlbums(array) {
        const selectedPair = array[Math.floor(Math.random() * array.length)];
        console.log(selectedPair);
        return selectedPair;
    }

    getNewAlbums() {
        const selectedAlbums = this.selectAlbums(albumPairs);
        console.log(selectedAlbums);
        this.setState({
            album1: albums.find(album => album.id === selectedAlbums[0]),
            album2: albums.find(album => album.id === selectedAlbums[1])
        })
    }

    handleClick() {
        this.getNewAlbums();
        console.log('click handled');
    }

    render() {
        return (
            <div className='album-container'>
                <Album className='album' id='album1' album={this.state.album1} onClick={this.handleClick}/>
                <Album className='album' id='album2' album={this.state.album2} onClick={this.handleClick}/>
            </div>
        )
    }
}

export default AlbumContainer;