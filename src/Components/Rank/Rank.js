import './Rank.css';
import AlbumContainer from '../AlbumContainer/AlbumContainer';
import React, { useState, useEffect } from 'react';
import ArtistFilter from '../ArtistFilter/ArtistFilter';
import { YearFilter } from '../YearFilter/YearFilter';
import axios from 'axios';
import jsCookie from 'js-cookie';
import uuid from 'uuid';

const App = () => {

  let [artistFilter, setArtistFilter] = useState([]);
  let [yearFilter, setYearFilter] = useState([]);
  let [allAlbums, setAllAlbums] = useState([]);
  let [availableAlbums, setAvailableAlbums] = useState([]);
  let [loadedAlbums, setLoadedAlbums] = useState(false);
  let [filtersEnabled, setFiltersEnabled] = useState(false);
  let [userId, setUserId] = useState('');
  let [userData, setUserData] = useState({ _id: '', userId: '', results: [], seenPairs: [] });
  let [loadedUserData, setLoadedUserData] = useState(false);

  useEffect(() => {
    getUserId();
    fetchAlbums();
    setArtistFilter(splitArtistParams());
  }, []) 

  useEffect(() => {
    getUserData();
    }, [userId]);

  useEffect(() => {
      filterAlbums();
      if (artistFilter.length > 0 || yearFilter.length > 0) {
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
  }, [artistFilter, yearFilter]);

  useEffect(() => {
    if (allAlbums.length > 0) {
      setLoadedAlbums(true);
      filterAlbums();
    }
  }, [allAlbums])

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
        console.log(userData);
        } else {
          setLoadedUserData(true);
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

  const filterAlbums = () => {
    if (artistFilter.length === 0 && yearFilter.length === 0) {
      setAvailableAlbums(allAlbums);
    } else {
      let filteredAlbums = allAlbums.map(album => album);
      console.log(filteredAlbums);
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
      console.log(filteredAlbums);
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

  return (
    <div className="App">
      <div className='filters'>
        <ArtistFilter id='artist-filter' onSelect={filterArtist} onRemove={filterArtist} albums={allAlbums} queryParams={artistFilter} />
        <YearFilter onChange={filterYear} />
      </div>
      <AlbumContainer albums={availableAlbums} albumsLoaded={loadedAlbums} filters={filtersEnabled} userId={userId} seenPairs={userData.seenPairs} loadedUserData={loadedUserData}/>
    </div>
  );
}

export default App;
