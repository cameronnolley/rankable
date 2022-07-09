import React, { useState, useEffect } from "react";
import Album from "../Album/Album";
import './AlbumContainer.css';
import albums from "../../database";
import { generatePairs } from "../../util/generatePairs";
import seenPairs from "../../seenPairs";
import { results } from "../../results";
import { idIndex } from "../../idIndex.js";
import axios from "axios";
import { arrayEquals } from "../../util/generatePairs";

const m4th = require('m4th');

const AlbumContainer = (props) => {
    
    let [albumPairs, setAlbumPairs] = useState([]);
    let [selectedPair, setSelectedPair] = useState([]);
    let [album1, setAlbum1] = useState([]);
    let [album2, setAlbum2] = useState([]);
    let [availableAlbums, setAvailableAlbums] = useState(true);
    let [loading, setLoading] = useState(false);
    let [seenPairs, setSeenPairs] = useState([]);
    let [needNewPair, setNeedNewPair] = useState(false);

    useEffect(() => {
        setLoading(true);
    }, []);

    useEffect(() => {
        if (albumPairs.length === 0  && props.albumsLoaded && props.loadedUserData) {
            console.log('Ready to generate pairs');
            firstLoad()
            .then(() => {
                if (seenPairs.length === 0) {
                    setNeedNewPair(true);
                }
            });
        }
    }, [props.albumsLoaded, props.loadedUserData]);

    useEffect(() => {
        if (seenPairs.length > 0) {
            seenPairsFilter()
            .then(() => {
                if (albumPairs.length > 0) {
                    console.log('getting new pair');
                    setNeedNewPair(true);
                };
            });
        };
    }, [seenPairs]);

    useEffect(() => {
        if (needNewPair && albumPairs.length > 0) {
            getNewAlbums(albumPairs)
            .then(() => {
                setNeedNewPair(false);
                setLoading(false);
            });
        }
    }, [needNewPair]);

    useEffect(() => {
        if (props.albumsLoaded) {
            filterPairs(props.albums)
            .then(() => {
            setLoading(true);
            setNeedNewPair(true);
        });
        }
    }, [props.albums]);

    const firstLoad = async () => {
        await setAlbumPairs(generatePairs(props.albums));
        await setSeenPairs(props.seenPairs);
    }

    const seenPairsFilter = async () => {
        let seenPairsFilter = [];
        await filterAvailablePairs(seenPairsFilter, albumPairs);
        await setAlbumPairs(albumPairs.filter(pair => !seenPairsFilter.includes(pair)));
        console.log('Filtered pairs by seen pairs');
    }

    const filterPairs = async (array) => {
        const pairs = generatePairs(array);
        let votedPairs = [];
        for (let i = 0; i < pairs.length; i++) {
            for (let j = 0; j < seenPairs.length; j++) {
                if (arrayEquals(pairs[i], seenPairs[j])) {
                    votedPairs.push(pairs[i]);
                }
            }
        }
        const finalTry = pairs.filter(pair => !votedPairs.includes(pair))
        console.log(finalTry);
        setAlbumPairs(finalTry)  
    }

    const selectAlbums = (array) => {
        const selectedPair = array[Math.floor(Math.random() * array.length)];
        return selectedPair;
    }

    const filterAvailablePairs = (seenPairsFilter, albumPairs) =>{
        for (let i = 0; i < albumPairs.length; i++) {
            for (let j = 0; j < seenPairs.length; j++) {
                if (arrayEquals(albumPairs[i], seenPairs[j])) {
                    seenPairsFilter.push(albumPairs[i]);
                }
            }
        }
    }

    const getNewAlbums= async (albumArray) => {
        const selectedAlbums = selectAlbums(albumArray);
        console.log(selectedAlbums);
        const album1Index = Math.floor(Math.random() * selectedAlbums.length);
        const album2Index = 1 - album1Index;
        await setSelectedPair(selectedAlbums);
        await setAlbum1(albums.find(album => album.id === selectedAlbums[album1Index]));
        await setAlbum2(albums.find(album => album.id === selectedAlbums[album2Index]));
        const errorMessages = Array.from(document.getElementsByClassName('skip-error-message'))
        const skipButtons = Array.from(document.getElementsByClassName('skip-button'))
        errorMessages.forEach(element => {
            element.style.visibility = 'hidden';
        });
        skipButtons.forEach(element => {
            element.removeAttribute('disabled');
        });
        setLoading(false);
    
    }

    const pushResults = (e) => {
        let album1Id = album1.id;
        let album2Id = album2.id;
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
            setLoading(true);
            axios({
                url: 'https://data.mongodb-api.com/app/rankabl-bwhkm/endpoint/results/save',
                method: 'POST',
                params: {
                    userId: props.userId,
                },
                data: {
                    result: mongoResult,
                    seenPair: selectedPair
                }
            }).then(res => {
                setSeenPairs(res.data.userResult.seenPairs);
                console.log(res.data.userResult.seenPairs);
                setLoading(false);
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


    const solveRanking = () => {
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

    const handleClick = async (e) => {
        await pushResults(e);
        console.log(solveRanking());
    }

    const skip = (e) => {
        const album1Id = album1.id;
        const album2Id = album2.id;

        if (e.target.id === 'second') {
            const filteredArray = albumPairs.filter(function(pairs) {
                return pairs.includes(album1Id) && !pairs.includes(album2Id)
            })
            if (filteredArray.length === 0) {
                document.getElementById('second').setAttribute("disabled", "disabled")
                document.getElementById('first').setAttribute("disabled", "disabled")
                document.getElementById('skip-error-second').style.visibility = "visible"
                return
            } else {
                const newAlbums = selectAlbums(filteredArray);
                setSelectedPair(newAlbums);
                setAlbum2(albums.find(album => album.id === newAlbums.find(albumId => albumId !== album1Id)));
            }
        } else if (e.target.id === 'first') {
            const filteredArray = albumPairs.filter(function(pairs) {
                return pairs.includes(album2Id) && !pairs.includes(album1Id)
            })
            if (filteredArray.length === 0) {
                document.getElementById('first').setAttribute("disabled", "disabled");
                document.getElementById('second').setAttribute("disabled", "disabled");
                document.getElementById('skip-error-first').style.visibility = "visible"
                return
            } else {
                const newAlbums = selectAlbums(filteredArray);
                setSelectedPair(newAlbums);
                setAlbum1(albums.find(album => album.id === newAlbums.find(albumId => albumId !== album2Id)));
            }
        }
    }

    const skipBoth = () => {
        const album1Id = album1.id;
        const album2Id = album2.id;
        const filteredArray = albumPairs.filter(function(pairs) {
            return !pairs.includes(album1Id) && !pairs.includes(album2Id)
        });
        if (filteredArray.length === 0) {
            document.getElementById('skip-both').setAttribute("disabled", "disabled");
            document.getElementById('skip-both-error').classList.add('is-visible');
        } else {
            const selectedAlbums = selectAlbums(filteredArray);
            const album1Index = Math.floor(Math.random() * selectedAlbums.length);
            const album2Index = 1 - album1Index;
            setSelectedPair(selectedAlbums);
            setAlbum1(albums.find(album => album.id === selectedAlbums[album1Index]));
            setAlbum2(albums.find(album => album.id === selectedAlbums[album2Index]));
        }
    }


    
    const albumsLoaded = props.albumsLoaded;
    const filters = props.filters;
    let view;
    if (loading) {
        view = <span className='loader' ></span>
    } else if (albumPairs.length === 0) {
        if (filters) {
            view = <h1>No available pairs of albums. Widen filters and try again.</h1>
        } else {
            view = <h1>No available pairs of albums.</h1>
        }
    } else {
        view = <div className='albums'>
                <Album className='album' id='album1' album={album1} onClick={handleClick} />
                <Album className='album' id='album2' album={album2} onClick={handleClick} />
                </div>
    }

    return (
        <div className='album-container'>
            {view}
            <button className='skip skip-button' id="first" onClick={skip} >Skip</button>
            <button className='skip skip-both' id='skip-both' onClick={skipBoth} >Skip both</button>
            <button className='skip skip-button' id="second" onClick={skip} >Skip</button>
            <p className='skip-error-message' id='skip-error-first' >No more available albums</p>
            <div></div>
            <p className='skip-error-message' id='skip-error-second' >No more available albums</p>
        </div>
    )

}

export default AlbumContainer;