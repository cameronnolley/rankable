import './App.css';
import AlbumContainer from '../AlbumContainer/AlbumContainer';
import React, { useState, useEffect } from 'react';
import ArtistFilter from '../ArtistFilter/ArtistFilter';
import { YearFilter } from '../YearFilter/YearFilter';
import * as Realm from "realm-web";
import axios from 'axios';

const App = () => {

  let [artistFilter, setArtistFilter] = useState([]);
  let [yearFilter, setYearFilter] = useState([]);
  let [allAlbums, setAllAlbums] = useState([]);
  let [availableAlbums, setAvailableAlbums] = useState([]);

  useEffect(() => {
    fetchAlbums();
  }, []) 

  useEffect(() => {
      filterAlbums();
  }, [artistFilter, yearFilter]);

  const fetchAlbums = () => {
    axios.get('https://data.mongodb-api.com/app/rankabl-bwhkm/endpoint/albums', {
      params: {
        "verification_method": "SECRET_AS_QUERY_PARAM",
        "secret": "temperature"
      }
    })
    .then(response => {
      console.log(response.data);
      setAllAlbums(response.data);
      setAvailableAlbums(response.data);
    })
    .catch(err => {
      console.log(err);
    });
  }

  const filterAlbums = () => {
    if (artistFilter.length === 0 && yearFilter.length === 0) {
      setAvailableAlbums(allAlbums);
    } else if (artistFilter.length > 0 && yearFilter.length === 0) {
      const filteredAlbums = allAlbums.filter(album => artistFilter.includes(album.attributes.artistName));
      setAvailableAlbums(filteredAlbums);
    } else if (artistFilter.length === 0 && yearFilter.length > 0) {
      const filteredAlbums = allAlbums.filter(album => yearFilter.some(year => album.attributes.releaseDate.includes(year)))
      setAvailableAlbums(filteredAlbums);
    } else if (artistFilter.length > 0 && yearFilter.length > 0) {
      const filteredAlbums = allAlbums.filter(album => artistFilter.includes(album.attributes.artistName));
      const doubleFilter = filteredAlbums.filter(album => yearFilter.some(year => album.attributes.releaseDate.includes(year)));
      setAvailableAlbums(doubleFilter);
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
        <ArtistFilter id='artist-filter' onSelect={filterArtist} onRemove={filterArtist} />
        <YearFilter onChange={filterYear} />
      </div>
      <AlbumContainer albums={availableAlbums}/>
    </div>
  );
}

export default App;
