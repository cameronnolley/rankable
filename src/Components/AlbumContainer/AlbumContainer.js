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

        this.setAlbumPairToState = this.setAlbumPairToState.bind(this);

    }

    componentDidMount() {
        this.setAlbumPairToState();
    }

    selectAlbums(array) {
        const selectedPair = array[Math.floor(Math.random() * array.length)];
        console.log(selectedPair);
        return selectedPair;
    }

    setAlbumPairToState() {
        const selectedAlbums = this.selectAlbums(albumPairs);
        console.log(selectedAlbums);
        this.setState({
            album1: albums.find(album => album.id === selectedAlbums[0]),
            album2: albums.find(album => album.id === selectedAlbums[1])
        })
    }

    render() {
        return (
            <div className='album-container'>
                <Album className='album' id='album1' album={this.state.album1} />
                <Album className='album' id='album2' album={this.state.album1}/>
            </div>
        )
    }
}

export default AlbumContainer;