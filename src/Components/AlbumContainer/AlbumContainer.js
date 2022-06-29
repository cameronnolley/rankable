import React from "react";
import Album from "../Album/Album";
import './AlbumContainer.css';
import albums from "../../database";
import generatePairs from "../../util/generatePairs";
import seenPairs from "../../seenPairs";
import Skip from "../Skip/Skip";

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
        this.skip = this.skip.bind(this);
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
        });
    }

    async handleClick() {
        seenPairs.push(this.state.selectedPair);
        console.log(seenPairs);
        await this.setState({
            albumPairs: this.state.albumPairs.filter(pair => !seenPairs.includes(pair))
        });
        
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

    skip(e) {
        const album1Id = this.state.album1.id;
        const album2Id = this.state.album2.id;

        if (e.target.id === 'second') {
            const filteredArray = this.state.albumPairs.filter(function(pairs) {
                return pairs.includes(album1Id) && !pairs.includes(album2Id)
            })
            const newAlbums = this.selectAlbums(filteredArray);
            this.setState({
                selectedPair: newAlbums,
                album2: albums.find(album => album.id === newAlbums.find(albumId => albumId !== album1Id))
            })
        } else if (e.target.id === 'first') {
            const filteredArray = this.state.albumPairs.filter(function(pairs) {
                return pairs.includes(album2Id) && !pairs.includes(album1Id)
            })
            const newAlbums = this.selectAlbums(filteredArray);
            this.setState({
                selectedPair: newAlbums,
                album1: albums.find(album => album.id === newAlbums.find(albumId => albumId !== album2Id))
            })
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
                    <button id="first" onClick={this.skip}>Skip</button>
                    <button>Skip both</button>
                    <button id="second" onClick={this.skip}>Skip</button>
                </div>
            )
        }
    }
}

export default AlbumContainer;