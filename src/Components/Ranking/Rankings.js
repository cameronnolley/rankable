import React, { useState, useEffect, useRef } from "react";
import TableRow from "../TableRow/TableRow";
import axios from "axios";
import TableHeader from "../TableHeader/TableHeader";
import './Rankings.css';
import RankingSelect from "../RankingSelect/RankingSelect";
import ArtistFilter from "../ArtistFilter/ArtistFilter";
import { YearFilter } from "../YearFilter/YearFilter";
import solveRanking from "../../util/solveRanking";
import jsCookie from "js-cookie";
import uuid from "uuid";
import TypeSelect from "../TypeSelect/TypeSelect";
import { ShareOutlined } from "@mui/icons-material";
import { Button } from "@mui/material";
import { ThemeProvider } from "@mui/system";
import theme from '../MuiTheme/Theme';

const Rankings = () => {

    let [albums, setAlbums] = useState([]);
    let [artists, setArtists] = useState([]);
    let [resultsGlobal, setResultsGlobal] = useState([]);
    let [resultsUser, setResultsUser] = useState([]);
    let [rankingGlobal, setRankingGlobal] = useState([]);
    let [rankingUser, setRankingUser] = useState([]);
    let [currentRanking, setCurrentRanking] = useState([]);
    let [userId, setUserId] = useState('');
    let [selectedRanking, setSelectedRanking] = useState('global');
    let [isLoading, setIsLoading] = useState(false);
    let [rowExpanded, setRowExpanded] = useState('');
    let [artistFilter, setArtistFilter] = useState([]);
    let [yearFilter, setYearFilter] = useState([]);
    let [typeFilter, setTypeFilter] = useState([]);

    useEffect(() => {
        getUserId();
        fetchAlbums();
        fetchArtists();
        fetchResults();
        setIsLoading(true);
        setArtistFilter(splitArtistParams());
        setTypeFilter(searchParams.getAll('type'));
        if(searchParams.get('ranking') !== null) {
            setSelectedRanking(searchParams.get('ranking'));
        };
    }, []);

    useEffect(() => {
        getUserData();
    }, [userId]);

    useEffect(() => {
        if (resultsGlobal.length > 0) {
            setRankingGlobal(solveRanking(resultsGlobal));
        }
    }, [resultsGlobal]);

    useEffect(() => {
        if (resultsUser.length > 0) {
            setRankingUser(solveRanking(resultsUser));
        }
    }, [resultsUser]);

    useEffect(() => {
        if (selectedRanking === 'global') {
            setCurrentRanking(rankingGlobal);
        }
        if (rankingGlobal) {
            setIsLoading(false);
        }
    }, [rankingGlobal]);

    useEffect(() => {
        filterRankings();
        searchParams.set('ranking', selectedRanking);
        var newRelativePathQuery = window.location.pathname + '?' + searchParams.toString();
        window.history.pushState(null, '', newRelativePathQuery);

    }, [selectedRanking]);

    useEffect(() => {
        filterRankings(); 
        if (artistFilter.length === 0) {
            searchParams.delete('artist');
            var newRelativePathQuery = window.location.pathname + '?' + searchParams.toString();
            window.history.pushState(null, '', newRelativePathQuery);
        }
        if (artistFilter.length > 0) {
            searchParams.set('artist', artistFilter);
            var newRelativePathQuery = window.location.pathname + '?' + searchParams.toString();
            window.history.pushState(null, '', newRelativePathQuery);
        }
        if (yearFilter.length === 0) {
            searchParams.delete('years');
            var newRelativePathQuery = window.location.pathname + '?' + searchParams.toString();
            window.history.pushState(null, '', newRelativePathQuery);
        }
        if (typeFilter.length === 0) {
            searchParams.delete('type');
            var newRelativePathQuery = window.location.pathname + '?' + searchParams.toString();
            window.history.pushState(null, '', newRelativePathQuery);
        }
        if (typeFilter.length > 0) {
            searchParams.set('type', typeFilter[0]);
            var newRelativePathQuery = window.location.pathname + '?' + searchParams.toString();
            window.history.pushState(null, '', newRelativePathQuery);
        }   
    }, [artistFilter, yearFilter, typeFilter]);

    useEffect(() => {
        if (rankingGlobal) {
            filterRankings();
        }
    }, [rankingGlobal, albums]);

    useEffect(() => {
        if (prevRow !== '' && rowExpanded !== '') {
            closeRow(prevRow);
        }
    }, [rowExpanded]);

    function usePrevious(value) {
        const ref = useRef();
        useEffect(() => {
          ref.current = value;
        });
        return ref.current;
      }

    const prevRow = usePrevious(rowExpanded);

    let searchParams = new URLSearchParams(window.location.search);

    const getUserId = () => {
        if (!jsCookie.get('user')) {
          jsCookie.set('user', uuid.v4(), { expires: 10000 });
        } else {
          setUserId(jsCookie.get('user'));
        }
      }

    const fetchAlbums = () => {
        axios.get('https://data.mongodb-api.com/app/rankabl-bwhkm/endpoint/albums', {
          params: {
            "verification_method": "SECRET_AS_QUERY_PARAM",
            "secret": "temperature"
          }
        })
        .then(response => {
          setAlbums(response.data);
        })
        .catch(err => {
          console.log(err);
        });
      }

      const fetchArtists = () => {
        axios.get('https://data.mongodb-api.com/app/rankabl-bwhkm/endpoint/artists', {
        })
        .then(response => {
          setArtists(response.data);
        })
        .catch(err => {
          console.log(err);
        });
      }

    const fetchResults = () => {
        axios.get('https://data.mongodb-api.com/app/rankabl-bwhkm/endpoint/getResults', {
        })
        .then(response => {
            setResultsGlobal(response.data);
        })
        .catch(err => {
            console.log(err);
         });
    }

    const getUserData = () => {
        if (userId !== '') {
          axios.get('https://data.mongodb-api.com/app/rankabl-bwhkm/endpoint/getuser', {
            params: {
              userId: userId
            }
          }).then (response => {
            if (response.data !== null) {
            setResultsUser(response.data.results);
            }
          })
        }
      }

    const splitArtistParams = () => {
        let artistParams = searchParams.get('artist');
        if (artistParams !== null) {
            let artistArray = artistParams.split(',');
            return artistArray;
        } else {
            return [];
        }
    }

    const splitYearParams = () => {
        let yearParams = searchParams.get('years');
        if (yearParams !== null) {
            let yearArray = yearParams.split(',');
            return yearArray;
        } else {
            return [];
        }
    }

    const changeRanking = (selectedItem) => {
        setSelectedRanking(selectedItem[0].value);
    };

    const shareRanking = () => {
        console.log(rankingUser);
        const sharedText = `My top ranked albums of all time: \n${rankingUser.map((result, index) => `${index + 1}. ${albums.find(album => album.id === result.albumId).attributes.name} ${albums.find(album => album.id === result.albumId).attributes.emoji}`).join('\n')}`;
        navigator.clipboard.writeText(sharedText);
    }

    const isExpanded = (id) => {
        setRowExpanded(id);
    };

    const filterArtist = (selectedList) => {
        const artistFilter = selectedList.map(artist => artist.name);
        setArtistFilter(artistFilter);
    }

    const filterYear = (selectedList) => {
        setYearFilter(selectedList);
    }

    const filterType = (selectedList) => {
        const typeFilter = selectedList.map(type => type.label);
        setTypeFilter(typeFilter);
    }

    const filterRankings = () => {
        if (artistFilter.length === 0 && yearFilter.length === 0 && typeFilter.length === 0) {
            if (selectedRanking === 'global') {
                setCurrentRanking(rankingGlobal);
            } else if (selectedRanking === 'personal') {
                setCurrentRanking(rankingUser);
            }
        } else {
            let filteredIds = albums.map(album => album.id);
            if (artistFilter.length > 0) {
                albums.forEach(album => {
                    if (Array.isArray(album.attributes.artistName)) {
                        if (album.attributes.artistName.some(artist => artistFilter.includes(artist)) === false) {
                            filteredIds.splice(filteredIds.findIndex(id => id === album.id), 1);
                        }
                    } else { 
                        if ((artistFilter.some(artist => artist === album.attributes.artistName)) === false) {
                            filteredIds.splice(filteredIds.findIndex(id => id === album.id), 1);
                        }
                    }
                });
            }
            if (yearFilter.length > 0) {
                let yearIds = albums.filter(album => yearFilter.some(year => album.attributes.releaseDate.includes(year))).map(album => album.id);
                filteredIds = filteredIds.filter(id => yearIds.includes(id));
                searchParams.set('years', yearFilter);
                var newRelativePathQuery = window.location.pathname + '?' + searchParams.toString();
                window.history.pushState(null, '', newRelativePathQuery);
            }
            if (typeFilter.length > 0) {
                let typeIds = albums.filter(album => typeFilter.includes(album.type)).map(album => album.id);
                filteredIds = filteredIds.filter(id => typeIds.includes(id));
            }
            let filteredRanking = [];
            selectedRanking === 'global' ? filteredRanking = rankingGlobal.filter(album => filteredIds.includes(album.albumId)) : filteredRanking = rankingUser.filter(album => filteredIds.includes(album.albumId));
            setCurrentRanking(filteredRanking);
        }
    };

    const closeRow = (id) => {
        document.getElementById(`table-row-${id}`).style.height = '120px';
        document.getElementById(`more ${id}`).innerHTML = 'More';
        document.getElementById(`more ${id}`).style.visibility = '';
    }

    const renderTable = () => {
        if (isLoading) {
            return <span className='loader' ></span>
        } else {
            return currentRanking.map((result, index) => (
                <TableRow 
                    key={index} 
                    album={albums.find(album => album.id === result.albumId)} 
                    rank={index + 1} 
                    albums={albums} 
                    artists={artists}
                    rankingGlobal={rankingGlobal} 
                    rankingUser={rankingUser}
                    resultsGlobal={resultsGlobal} 
                    resultsUser={resultsUser}
                    selectedRanking={selectedRanking}
                    isExpanded={isExpanded}
                />
            ));
        }
    }

    return (
        <div>
            <div className='filters-rankings'>
                <RankingSelect onSelect={changeRanking} queryParams={selectedRanking}/>
                <ArtistFilter albums={albums} onSelect={filterArtist} onRemove={filterArtist} queryParams={artistFilter} yearFilter={yearFilter} typeFilter={typeFilter} />
                <YearFilter onChange={filterYear} queryParams={yearFilter} albums={albums} artistFilter={artistFilter} typeFilter={typeFilter} />
                <TypeSelect onSelect={filterType} onRemove={filterType} queryParams={typeFilter} albums={albums} artistFilter={artistFilter} yearFilter={yearFilter} />
                <div className='share' >
                    {selectedRanking === 'personal' ? 
                    <ThemeProvider theme={theme}>
                        <Button variant="contained" onClick ={shareRanking} color='secondary' sx={{ borderRadius: '20px', height: '40px', padding: '0px 32px 0px 32px', textTransform: 'none', fontSize: '16px', fontFamily: 'Helvetica', color: '#FFFFFF' }} endIcon={<ShareOutlined size='small'/>} >
                            Share
                        </Button> 
                    </ThemeProvider>
                    : null}
                </div>
            </div>
            <TableHeader />
            <div className='table-container' id='table-container'>
                {renderTable()}
            </div>
            <div className='embed'>
                
            </div>
        </div>
    );
}

export default Rankings;