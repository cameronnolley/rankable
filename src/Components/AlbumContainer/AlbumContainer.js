import React from "react";
import Album from "../Album/Album";
import './AlbumContainer.css';
import albums from "../../database";
import { filterPairs, generatePairs } from "../../util/generatePairs";
import seenPairs from "../../seenPairs";
import { results } from "../../results";
import { idIndex } from "../../idIndex.js";
import axios from "axios";

const m4th = require('m4th');

class AlbumContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            albumPairs: [],
            selectedPair: [],
            album1: '',
            album2: '',
            availableAlbums: true,
            loading: false,
            seenPairs: []
        };

        this.getNewAlbums = this.getNewAlbums.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.skip = this.skip.bind(this);
        this.skipBoth = this.skipBoth.bind(this);
    }

    async componentDidMount() {
        if (this.props.albums) {
            await this.setState({
                albumPairs: generatePairs(this.props.albums)
            });
           this.getNewAlbums();
        }
    }

    async componentDidUpdate(prevProps) {
        if(this.props.albums !== prevProps.albums) {
            await this.setState({
                albumPairs: filterPairs(this.props.albums),
                loading: true
            }, () => {
                setTimeout(() => {
                    this.setState({
                        loading:false
                    })
                }, 500);
            });
            if (this.state.albumPairs.length > 0) {
                this.setState({
                    availableAlbums: true
                })
            }
            this.getNewAlbums();
        };
        if(this.props.seenPairs !== prevProps.seenPairs) {
            this.setState({
                seenPairs: this.props.seenPairs
            })
        }
    }

    selectAlbums(array) {
        const selectedPair = array[Math.floor(Math.random() * array.length)];
        return selectedPair;
    }

    async getNewAlbums() {
        if (this.state.albumPairs.length === 0) {
            this.setState({
                loading: true
            }, () => {
                setTimeout(() => {
                    this.setState({
                        availableAlbums: false,
                        loading:false
                    })
                }, 100);
            })
        } else {
            const selectedAlbums = this.selectAlbums(this.state.albumPairs);
            const album1Index = Math.floor(Math.random() * selectedAlbums.length);
            const album2Index = 1 - album1Index;
            await this.setState({
                selectedPair: selectedAlbums,
                album1: albums.find(album => album.id === selectedAlbums[album1Index]),
                album2: albums.find(album => album.id === selectedAlbums[album2Index])
            });
            const errorMessages = Array.from(document.getElementsByClassName('skip-error-message'))
            const skipButtons = Array.from(document.getElementsByClassName('skip-button'))
            errorMessages.forEach(element => {
                element.style.visibility = 'hidden';
            });
            skipButtons.forEach(element => {
                element.removeAttribute('disabled');
            });
        }
    }

    pushResults(e) {
        let album1Id = this.state.album1.id;
        let album2Id = this.state.album2.id;
        let result = {};
        let mongoResult = {};
        if (e.currentTarget.id === 'album1') {
            result[album1Id] = 1;
            result[album2Id] = -1;
            mongoResult = {
                album1: {
                    id: album1Id,
                    result: 1
                },
                album2: {
                    id: album2Id,
                    result: -1
                }
            }
            results.push(mongoResult);
            console.log(result);
            this.setState({
                loading: true
            })
            axios({
                url: 'https://data.mongodb-api.com/app/rankabl-bwhkm/endpoint/results/save',
                method: 'POST',
                params: {
                    userId: this.props.userId,
                },
                data: {
                    result: mongoResult,
                    seenPair: this.state.selectedPair
                }
            }).then(res => {
                console.log(res.data.userResult.seenPairs);
                this.setState({
                    loading: false
                })
            }).catch(err => {
                console.log(err);
            });
        }
        if (e.currentTarget.id === 'album2') {
            result[album1Id] = -1;
            result[album2Id] = 1;
            mongoResult = {
                album1: {
                    id: album1Id,
                    result: -1
                },
                album2: {
                    id: album2Id,
                    result: 1
                }
            }
            results.push(mongoResult);
            console.log(result);
        }
        if (idIndex.findIndex(x => x === album1Id) === -1) {
            idIndex.push(album1Id);
        }
        if (idIndex.findIndex(x => x === album2Id) === -1) {
            idIndex.push(album2Id);
        }
    }


    solveRanking() {
        let formattedResults = [];
        results.forEach(result => {
            let newResult = {};
            newResult[result.album1.id] = result.album1.result;
            newResult[result.album2.id] = result.album2.result;
            formattedResults.push(newResult);
        });
        console.log(formattedResults);
        let ids = [];
        for (let i = 0; i < formattedResults.length; i++) {
            ids.push(Object.keys(formattedResults[i]))
        };
        let flatIds = ids.flat();
        console.log(flatIds);
        console.log(idIndex);
        console.log(idIndex.length);
        let matrix = m4th.matrix(idIndex.length);
        matrix = matrix.map(function(element){
            return 0;
          });
        for (let i = 0; i < idIndex.length; i++) {
            matrix.set(i, i, flatIds.filter(id => id === idIndex[i]).length + 2);
            for (let j = i+1; j < idIndex.length; j++) {
                let gameCount = matrix.get(i, j) || 0;
                for (let k = 0; k < formattedResults.length; k++) {
                    if (idIndex[i] in formattedResults[k] && idIndex[j] in formattedResults[k]) {
                        matrix.set(i, j, gameCount-1);
                        matrix.set(j, i, gameCount-1);
                    }
                }
            }
        }
        console.log(matrix);
        let ratings = [];
        for (let i = 0; i < idIndex.length; i++) {
            let albumWL = [];
            for (let j = 0; j < formattedResults.length; j++) {
                if (idIndex[i] in formattedResults[j]) {
                    albumWL.push(formattedResults[j][idIndex[i]])
                }
            };
            let albumRating = 1 + 0.5 * (albumWL.reduce((previousValue, currentValue) => previousValue + currentValue,
            0));
            ratings.push(albumRating);
        }
        let y = m4th.matrix(idIndex.length, ratings);
        const solution = m4th.lu(matrix).solve(y);
        const rankings = [];
        for (let i = 0; i < idIndex.length; i++) {
            rankings.push({
                albumId: idIndex[i],
                rating: solution.array[i]
            })
        };
        return rankings;
    }

    async handleClick(e) {
        await this.pushResults(e);
        console.log(this.solveRanking());
        // await seenPairs.push(this.state.selectedPair);
        await this.setState({
            seenPairs: [...this.state.seenPairs, this.state.selectedPair]
        })
        await this.setState({
            albumPairs: this.state.albumPairs.filter(pair => !this.state.seenPairs.includes(pair))
        });
        /* this.setState({
            loading: true
        }, () => {
            setTimeout(() => {
                this.setState({
                    loading:false
                })
            }, 5);
        }); */
        this.getNewAlbums();
        console.log(results);
        console.log(idIndex);
        console.log();
        
    }

    skip(e) {
        const album1Id = this.state.album1.id;
        const album2Id = this.state.album2.id;

        if (e.target.id === 'second') {
            const filteredArray = this.state.albumPairs.filter(function(pairs) {
                return pairs.includes(album1Id) && !pairs.includes(album2Id)
            })
            if (filteredArray.length === 0) {
                document.getElementById('second').setAttribute("disabled", "disabled")
                document.getElementById('first').setAttribute("disabled", "disabled")
                document.getElementById('skip-error-second').style.visibility = "visible"
                return
            } else {
                const newAlbums = this.selectAlbums(filteredArray);
                this.setState({
                    selectedPair: newAlbums,
                    album2: albums.find(album => album.id === newAlbums.find(albumId => albumId !== album1Id))
                })
            }
        } else if (e.target.id === 'first') {
            const filteredArray = this.state.albumPairs.filter(function(pairs) {
                return pairs.includes(album2Id) && !pairs.includes(album1Id)
            })
            if (filteredArray.length === 0) {
                document.getElementById('first').setAttribute("disabled", "disabled");
                document.getElementById('second').setAttribute("disabled", "disabled");
                document.getElementById('skip-error-first').style.visibility = "visible"
                return
            } else {
                const newAlbums = this.selectAlbums(filteredArray);
                this.setState({
                    selectedPair: newAlbums,
                    album1: albums.find(album => album.id === newAlbums.find(albumId => albumId !== album2Id))
                })
            }
        }
    }

    skipBoth() {
        const album1Id = this.state.album1.id;
        const album2Id = this.state.album2.id;
        const filteredArray = this.state.albumPairs.filter(function(pairs) {
            return !pairs.includes(album1Id) && !pairs.includes(album2Id)
        });
        if (filteredArray.length === 0) {
            document.getElementById('skip-both').setAttribute("disabled", "disabled");
            document.getElementById('skip-both-error').classList.add('is-visible');
        } else {
            const selectedAlbums = this.selectAlbums(filteredArray);
            const album1Index = Math.floor(Math.random() * selectedAlbums.length);
            const album2Index = 1 - album1Index;
            this.setState({
                selectedPair: selectedAlbums,
                album1: albums.find(album => album.id === selectedAlbums[album1Index]),
                album2: albums.find(album => album.id === selectedAlbums[album2Index])
            });
            this.setState({
                loading: true
            }, () => {
                setTimeout(() => {
                    this.setState({
                        loading:false
                    })
                }, 500);
            });
        }
    }


    render() {
        const albumsLoaded = this.props.albumsLoaded;
        const filters = this.props.filters;
        let view;
        if (!albumsLoaded) {
            view = <span className='loader' ></span>
        } else if (this.state.loading) {
            view = <span className='loader' ></span>
        } else if (this.state.albumPairs.length === 0) {
            if (filters) {
                view = <h1>No available pairs of albums. Widen filters and try again.</h1>
            } else {
                view = <h1>No available pairs of albums.</h1>
            }
        } else {
            view = <div className='albums'>
                    <Album className='album' id='album1' album={this.state.album1} onClick={this.handleClick} />
                    <Album className='album' id='album2' album={this.state.album2} onClick={this.handleClick} />
                   </div>
        }

        return (
            <div className='album-container'>
                {view}
                <button className='skip skip-button' id="first" onClick={this.skip} >Skip</button>
                <button className='skip skip-both' id='skip-both' onClick={this.skipBoth} >Skip both</button>
                <button className='skip skip-button' id="second" onClick={this.skip} >Skip</button>
                <p className='skip-error-message' id='skip-error-first' >No more available albums</p>
                <div></div>
                <p className='skip-error-message' id='skip-error-second' >No more available albums</p>
            </div>
        )
    }
}

export default AlbumContainer;