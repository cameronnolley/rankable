import React from "react";
import Album from "../Album/Album";
import './AlbumContainer.css';
import albums from "../../database";
import generatePairs from "../../util/generatePairs";
import seenPairs from "../../seenPairs";

class AlbumContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            albumPairs: generatePairs(albums),
            selectedPair: [],
            album1: '',
            album2: '',
            availableAlbums: true,
            loading: false
        };

        this.getNewAlbums = this.getNewAlbums.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount() {
        this.getNewAlbums();
    }

    selectAlbums(array) {
        const selectedPair = array[Math.floor(Math.random() * array.length)];
        return selectedPair;
    }

    getNewAlbums() {
        const selectedAlbums = this.selectAlbums(this.state.albumPairs);
        const album1Index = Math.floor(Math.random() * selectedAlbums.length);
        const album2Index = 1 - album1Index;
        this.setState({
            selectedPair: selectedAlbums,
            album1: albums.find(album => album.id === selectedAlbums[album1Index]),
            album2: albums.find(album => album.id === selectedAlbums[album2Index])
        }, () => {
            seenPairs.push(this.state.selectedPair);
            console.log(seenPairs);
            this.setState({
                albumPairs: this.state.albumPairs.filter(pair => !seenPairs.includes(pair))
            }); 
        });
    }

    handleClick() {

        if (this.state.albumPairs.length === 0) {
            this.setState({
                availableAlbums: false
            })
        } else {
            this.setState({
                loading: true
            }, () => {
                setTimeout(() => {
                    this.setState({
                        loading:false
                    })
                }, 600);
            });
            this.getNewAlbums();
        }
    }

    render() {
        if (this.state.availableAlbums === false) {
            return (
                <div className='album-container' >
                    <h1>No more albums</h1>
                </div>
            )
        } else if (this.state.loading === true) {
            return (
                <div className="album-container">
                    <span className='loader' ></span>
                    <button>Skip</button>
                    <button>Skip both</button>
                    <button>Skip</button>
                </div>
            )
        } else {
            return (
                <div className='album-container'>
                    <Album className='album' id='album1' album={this.state.album1} onClick={this.handleClick} />
                    <div></div>
                    <Album className='album' id='album2' album={this.state.album2} onClick={this.handleClick} />
                    <button>Skip</button>
                    <button>Skip both</button>
                    <button>Skip</button>
                </div>
            )
        }
    }
}

export default AlbumContainer;