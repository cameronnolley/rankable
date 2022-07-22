import './Rank.css';
import AlbumContainer from '../AlbumContainer/AlbumContainer';
import React, { useState, useEffect } from 'react';
import ArtistFilter from '../ArtistFilter/ArtistFilter';
import { YearFilter } from '../YearFilter/YearFilter';
import axios from 'axios';
import jsCookie from 'js-cookie';
import uuid from 'uuid';
import Header from '../Header/Header';
import { RankingFilter } from '../RankingFilter/RankingFilter';
import solveRanking from '../../util/solveRanking';
import { Button } from '@mui/material';
import { FilterAltRounded } from '@mui/icons-material';
import { ThemeProvider } from '@mui/system';
import { theme, filterTheme } from '../MuiTheme/Theme';
import { IconButton } from '@mui/material';
import { CloseRounded } from '@mui/icons-material';

const App = () => {

  let [artistFilter, setArtistFilter] = useState([]);
  let [yearFilter, setYearFilter] = useState([]);
  let [rankingFilterValue, setRankingFilterValue] = useState(0);
  let [allAlbums, setAllAlbums] = useState([]);
  let [availableAlbums, setAvailableAlbums] = useState([]);
  let [loadedAlbums, setLoadedAlbums] = useState(false);
  let [filtersEnabled, setFiltersEnabled] = useState(false);
  let [userId, setUserId] = useState('');
  let [userData, setUserData] = useState({ _id: '', userId: '', results: [], seenPairs: [] });
  let [loadedUserData, setLoadedUserData] = useState(false);
  let [artistParams, setArtistParams] = useState('');
  let [resultsGlobal, setResultsGlobal] = useState([]);
  let [resultsUser, setResultsUser] = useState([]);
  let [rankingGlobal, setRankingGlobal] = useState([]);
  let [rankingUser, setRankingUser] = useState([]);
  let [filterButtonColor, setFilterButtonColor] = useState('primary');

  useEffect(() => {
    getUserId();
    fetchAlbums();
    fetchResults();
    setArtistParams(splitArtistParams());
  }, []) 

  useEffect(() => {
    if (userId !== '') {
      getUserData();
    }
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
    filterAlbums();
    if (artistFilter.length > 0 || yearFilter.length > 0 || rankingFilterValue !== allAlbums.length) {
      setFiltersEnabled(true);
    } else {
      setFiltersEnabled(false);
    }
    if (artistFilter.length === 0) {
      searchParams.delete('artist');
      var newRelativePathQuery = window.location.pathname + '?' + searchParams.toString();
      window.history.pushState(null, '', newRelativePathQuery);
    }
    if (yearFilter.length === 0) {
      searchParams.delete('years');
      var newRelativePathQuery = window.location.pathname + '?' + searchParams.toString();
      window.history.pushState(null, '', newRelativePathQuery);
    }
      
  }, [artistFilter, yearFilter, rankingFilterValue]);

  useEffect(() => {
    filterAlbums();
  }, [rankingFilterValue]);

  useEffect(() => {
    if (allAlbums.length > 0) {
      setLoadedAlbums(true);
      setArtistFilter(artistParams);
      setRankingFilterValue(allAlbums.length);
    }
  }, [allAlbums])

  useEffect(() => {
    if (filtersEnabled) {
      setFilterButtonColor('secondary');
    } else {
      setFilterButtonColor('primary');
    }
  }, [filtersEnabled])

  let searchParams = new URLSearchParams(window.location.search);

  const fetchAlbums = () => {
    axios.get('https://data.mongodb-api.com/app/rankabl-bwhkm/endpoint/albums', {
      params: {
        "verification_method": "SECRET_AS_QUERY_PARAM",
        "secret": "temperature"
      }
    })
    .then(response => {
      setAllAlbums(response.data);
      setAvailableAlbums(response.data);
    })
    .catch(err => {
      console.log(err);
    });
  }

  const getUserId = () => {
    if (!jsCookie.get('user')) {
      jsCookie.set('user', uuid.v4(), { expires: 10000 });
      setUserId(jsCookie.get('user'));
    } else {
      setUserId(jsCookie.get('user'));
    }
  }

  const getUserData = () => {
    if (userId !== '') {
      axios.get('https://data.mongodb-api.com/app/rankabl-bwhkm/endpoint/getuser', {
        params: {
          userId: userId
        }
      }).then (response => {
        if (response.data !== null) {
        setUserData(response.data);
        setLoadedUserData(true);
        setResultsUser(response.data.results);
        } else {
          setLoadedUserData(true);
        }
      })
    }
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

  const splitArtistParams = () => {
    let artistParams = searchParams.get('artist');
    if (artistParams !== null) {
        let artistArray = artistParams.split(',');
        console.log('filter set from params');
        return artistArray;
    } else {
        return [];
    }
  }

  const filterAlbums = () => {
    console.log(rankingFilterValue);
    if (artistFilter.length === 0 && yearFilter.length === 0 && rankingFilterValue === allAlbums.length) {
      setAvailableAlbums(allAlbums);
    } else {
      let filteredAlbums = allAlbums.map(album => album);
      if (artistFilter.length > 0) {
        allAlbums.forEach(album => {
            if (Array.isArray(album.attributes.artistName)) {
              if (album.attributes.artistName.some(artist => artistFilter.includes(artist)) === false) {
                filteredAlbums.splice(filteredAlbums.findIndex(filterAlbum => filterAlbum === album), 1);
              } 
            } else {
              if ((artistFilter.some(artist => artist === album.attributes.artistName)) === false) {
                filteredAlbums.splice(filteredAlbums.findIndex(filterAlbum => filterAlbum === album), 1);
              }
            }
          });
          searchParams.set('artist', artistFilter);
          var newRelativePathQuery = window.location.pathname + '?' + searchParams.toString();
          window.history.pushState(null, '', newRelativePathQuery);
      }
      if (yearFilter.length > 0) {
        filteredAlbums = filteredAlbums.filter(album => yearFilter.some(year => album.attributes.releaseDate.includes(year)));
        searchParams.set('years', yearFilter);
        var newRelativePathQuery = window.location.pathname + '?' + searchParams.toString();
        window.history.pushState(null, '', newRelativePathQuery);
      }
      if (rankingGlobal.length > 0 && rankingFilterValue < allAlbums.length) {
        const rankingFilterAlbums = rankingGlobal.map(album => album.albumId).slice(0, rankingFilterValue);
        console.log(rankingFilterAlbums);
        filteredAlbums = filteredAlbums.filter(album => rankingFilterAlbums.includes(album.id));
        console.log(filteredAlbums);
      }
      setAvailableAlbums(filteredAlbums);   
    }
  }

  const filterArtist = (selectedList) => {
    const artistFilter = selectedList.map(artist => artist.name);
    setArtistFilter(artistFilter);
  }

  const filterYear = (selectedList) => {
    setYearFilter(selectedList);
  }

  const filterRanking = (value) => {
    setRankingFilterValue(value);
  }

  const openFilterDrawer = () => {
    document.getElementById('filter-drawer').style.top = '0';
    document.getElementById('rank-page-container').style.overflow = 'hidden';
  }

  const closeFilterDrawer = () => {
    document.getElementById('filter-drawer').style.top = '100%';
    document.getElementById('rank-page-container').style.overflow = 'auto';
  }

  return (
    <div classNyarn run deployame="page-container" id="rank-page-container">
      <Header headerParams={searchParams}/>
      <div className="container">
        <div className="Rank">
          <div className='filters'>
            <ArtistFilter id='artist-filter' onSelect={filterArtist} onRemove={filterArtist} albums={allAlbums} queryParams={artistFilter} yearFilter={yearFilter}/>
            <YearFilter id='year-filter' filterId='calendar' onChange={filterYear} albums={allAlbums} artistFilter={artistFilter} />
            <RankingFilter id='ranking-filter' filterId='ranking-slider' albums={allAlbums} filterRanking={filterRanking}/>
            <ThemeProvider theme={filterTheme}>
              <Button id='filter-button' onClick={openFilterDrawer} variant="outlined" color={filterButtonColor} size="small" sx={{ textTransform: "none", borderRadius: "15px" }}endIcon={<FilterAltRounded size="small" />}>
                Filters
              </Button>
            </ThemeProvider>
          </div>
          <AlbumContainer albums={availableAlbums} albumsLoaded={loadedAlbums} filters={filtersEnabled} userId={userId} seenPairs={userData.seenPairs} loadedUserData={loadedUserData}/>
        </div>
      </div>
      <div className="filter-drawer" id="filter-drawer">
        <div className="filter-drawer-content">
          <div className="filter-drawer-header">
            <div></div>
            <div className="filter-drawer-header-title">
              Filters
            </div>
            <ThemeProvider theme={theme}>
              <IconButton color='primary' size="large" onClick={closeFilterDrawer}>
                <CloseRounded fontSize="inherit"/>
              </IconButton>
            </ThemeProvider>
          </div>
          <hr/>
          <div className="filter-drawer-body">
            <ArtistFilter id='artist-filter-drawer' onSelect={filterArtist} onRemove={filterArtist} albums={allAlbums} queryParams={artistFilter} yearFilter={yearFilter}/>
            <YearFilter id='year-filter-drawer' filterId='calendar-drawer' onChange={filterYear} albums={allAlbums} artistFilter={artistFilter} />
            <RankingFilter id='ranking-filter-drawer' filterId='ranking-slider-drawer' albums={allAlbums} filterRanking={filterRanking}/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
