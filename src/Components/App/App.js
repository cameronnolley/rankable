import './App.css';
import AlbumContainer from '../AlbumContainer/AlbumContainer';
import React, { useState, useEffect } from 'react';
import ArtistFilter from '../ArtistFilter/ArtistFilter';
import albums from '../../database';
import { YearFilter } from '../YearFilter/YearFilter';
import * as Realm from "realm-web";

const App = () => {

  let [artistFilter, setArtistFilter] = useState([]);
  let [yearFilter, setYearFilter] = useState([]);
  let [availableAlbums, setAvailableAlbums] = useState(albums);

  useEffect(() => {
    fetchAlbums();
  }, []) 

  useEffect(() => {
      filterAlbums();
  }, [artistFilter, yearFilter]);

  async function fetchAlbums() {
    const app = new Realm.App({ id: "rankabl-bwhkm" });
    const credentials = Realm.Credentials.anonymous();
    try {
      const user = await app.logIn(credentials);
      const allAlbums = await user.functions.getAllAlbums();
      console.log(allAlbums);
    } catch(err) {
      console.error("Failed to log in", err);
    }
  }

  const filterAlbums = () => {
    if (artistFilter.length === 0 && yearFilter.length === 0) {
      setAvailableAlbums(albums);
    } else if (artistFilter.length > 0 && yearFilter.length === 0) {
      const filteredAlbums = albums.filter(album => artistFilter.includes(album.attributes.artistName));
      setAvailableAlbums(filteredAlbums);
    } else if (artistFilter.length === 0 && yearFilter.length > 0) {
      const filteredAlbums = albums.filter(album => yearFilter.some(year => album.attributes.releaseDate.includes(year)))
      setAvailableAlbums(filteredAlbums);
    } else if (artistFilter.length > 0 && yearFilter.length > 0) {
      const filteredAlbums = albums.filter(album => artistFilter.includes(album.attributes.artistName));
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
