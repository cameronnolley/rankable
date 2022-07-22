import React, { useState, useEffect } from "react";
import Album from "../Album/Album";
import './AlbumContainer.css';
import { generatePairs } from "../../util/generatePairs";
import axios from "axios";
import { arrayEquals } from "../../util/generatePairs";

const m4th = require('m4th');

const AlbumContainer = (props) => {
    
    let [albumPairs, setAlbumPairs] = useState([]);
    let [selectedPair, setSelectedPair] = useState([]);
    let [album1, setAlbum1] = useState([]);
    let [album2, setAlbum2] = useState([]);
    let [loading, setLoading] = useState(false);
    let [seenPairs, setSeenPairs] = useState([]);
    let [needNewPair, setNeedNewPair] = useState(false);

    useEffect(() => {
        setLoading(true);
    }, []);

    useEffect(() => {
        if (albumPairs.length === 0  && props.albumsLoaded && props.loadedUserData) {
            setSeenPairs(props.seenPairs)
        }
    }, [props.albumsLoaded, props.loadedUserData]);

    useEffect(() => {
        if (props.loadedUserData && props.albums) {
            const filteredPairs = filterPairs(props.albums)
            setAlbumPairs(filteredPairs)
        };
    }, [seenPairs]);

    useEffect(() => {
        if (albumPairs.length > 0) {
            setNeedNewPair(true);
            console.log('new pair')
        } else if (props.albumsLoaded && props.loadedUserData) {
            setTimeout(() => {setLoading(false)}, 300);
            console.log(' no more albums ')
        }
    }, [albumPairs]);

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
            console.log('albums changed');
            setLoading(true);
            setTimeout(() => {setAlbumPairs(filterPairs(props.albums))}, 300);
        }
    }, [props.albums]);

    const filterPairs = (array) => {
        const pairs = generatePairs(array);
        let votedPairs = [];
        for (let i = 0; i < seenPairs.length; i++) {
            for (let j = 0; j < pairs.length; j++) {
                if (seenPairs[i].includes(pairs[j][0]) && seenPairs[i].includes(pairs[j][1])) {
                    votedPairs.push(pairs[j]);
                }
            }
        }
        const finalTry = pairs.filter(pair => !votedPairs.includes(pair))
        return finalTry;  
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
        const album1Index = Math.floor(Math.random() * selectedAlbums.length);
        const album2Index = 1 - album1Index;
        await setSelectedPair(selectedAlbums);
        await setAlbum1(props.albums.find(album => album.id === selectedAlbums[album1Index]));
        await setAlbum2(props.albums.find(album => album.id === selectedAlbums[album2Index]));
        const errorMessages = Array.from(document.getElementsByClassName('skip-error-message'))
        const skipButtons = Array.from(document.getElementsByClassName('skip-button'))
        errorMessages.forEach(element => {
            element.style.visibility = 'hidden';
        });
        skipButtons.forEach(element => {
            element.removeAttribute('disabled');
        }); 
    }

    const pushResults = (e) => {
        let album1Id = album1.id;
        let album2Id = album2.id;
        let result = {};
        if (e.currentTarget.id === 'album1') {
            result[album1Id] = 1;
            result[album2Id] = -1;
            result = {
                album1: {
                    id: album1Id,
                    result: 1
                },
                album2: {
                    id: album2Id,
                    result: -1
                }
            }
            setLoading(true);
            axios({
                url: 'https://data.mongodb-api.com/app/rankabl-bwhkm/endpoint/results/save',
                method: 'POST',
                params: {
                    userId: props.userId,
                },
                data: {
                    result: result,
                    seenPair: selectedPair
                }
            }).then(res => {
                setSeenPairs(res.data.userResult.seenPairs);
                console.log(res.data.userResult.seenPairs);
            }).catch(err => {
                console.log(err);
            });
        }
        if (e.currentTarget.id === 'album2') {
            result[album1Id] = -1;
            result[album2Id] = 1;
            result = {
                album1: {
                    id: album1Id,
                    result: -1
                },
                album2: {
                    id: album2Id,
                    result: 1
                }
            }
            setLoading(true);
            axios({
                url: 'https://data.mongodb-api.com/app/rankabl-bwhkm/endpoint/results/save',
                method: 'POST',
                params: {
                    userId: props.userId,
                },
                data: {
                    result: result,
                    seenPair: selectedPair
                }
            }).then(res => {
                setSeenPairs(res.data.userResult.seenPairs);
                console.log(res.data.userResult.seenPairs);
            }).catch(err => {
                console.log(err);
            });
        }
    }

    const handleClick = async (e) => {
        await pushResults(e);
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
                setAlbum2(props.albums.find(album => album.id === newAlbums.find(albumId => albumId !== album1Id)));
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
                setAlbum1(props.albums.find(album => album.id === newAlbums.find(albumId => albumId !== album2Id)));
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
            document.getElementById('skip-error-both').classList.add('is-visible');
        } else {
            const selectedAlbums = selectAlbums(filteredArray);
            const album1Index = Math.floor(Math.random() * selectedAlbums.length);
            const album2Index = 1 - album1Index;
            setSelectedPair(selectedAlbums);
            setAlbum1(props.albums.find(album => album.id === selectedAlbums[album1Index]));
            setAlbum2(props.albums.find(album => album.id === selectedAlbums[album2Index]));
        }
    }

    const filters = props.filters;
    let view;
    if (loading) {
        view =  <div className="album-container">
                    <span className='loader' ></span>
                </div>
    } else if (albumPairs.length === 0) {
        if (filters) {
            view = <h1>No available pairs of albums. Widen filters and try again.</h1>
            document.getElementById('first') && document.getElementById('first').setAttribute("disabled", "disabled");
            document.getElementById('second') && document.getElementById('second').setAttribute("disabled", "disabled");
            document.getElementById('skip-both') && document.getElementById('skip-both').setAttribute("disabled", "disabled");
        } else {
            view = <h1>No available pairs of albums.</h1>
            document.getElementById('first') && document.getElementById('first').setAttribute("disabled", "disabled");
            document.getElementById('second') && document.getElementById('second').setAttribute("disabled", "disabled");
            document.getElementById('skip-both') && document.getElementById('skip-both').setAttribute("disabled", "disabled");
        }
    } else {
        view =  <div className='album-container'>
                    <Album className='album' id='album1' album={album1} onClick={handleClick} />
                    <button className='skip skip-button' id="first" onClick={skip} ></button>
                    <button className='skip skip-button skip-both' id='skip-both' onClick={skipBoth} ></button>
                    <Album className='album' id='album2' album={album2} onClick={handleClick} />
                    <button className='skip skip-button' id="second" onClick={skip} ></button>
                    <p className='skip-error-message' id='skip-error-first' >No available albums</p>
                    <p className='skip-error-both' id='skip-error-both' >No available albums</p>
                    <p className='skip-error-message' id='skip-error-second' >No available albums</p>
                </div>

    }

    return (
        <div className='view-container'>
            {view}
        </div>
    )

}

export default AlbumContainer;