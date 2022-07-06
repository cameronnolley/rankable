import './App.css';
import AlbumContainer from '../AlbumContainer/AlbumContainer';
import React from 'react';
import ArtistFilter from '../ArtistFilter/ArtistFilter';
import albums from '../../database';
import { YearFilter } from '../YearFilter/YearFilter';
import * as Realm from "realm-web";
import { useEffect } from "react";

function getAlbums() {
    useEffect(async () => {
        const app = new Realm.App({ id: "rankabl-bwhkm" });
        const credentials = Realm.Credentials.anonymous();
        try {
        const user = await app.logIn(credentials);
        const allAlbums = await user.functions.getAllAlbums();
        } catch(err) {
        console.error("Failed to log in", err);
        }
    })
}

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      artistFilter: [],
      yearFilter: [],
      availableAlbums: albums
    }

    this.filterArtist = this.filterArtist.bind(this);
    this.filterYear = this.filterYear.bind(this);
    this.filterAlbums = this.filterAlbums.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.artistFilter !== prevState.artistFilter || this.state.yearFilter !== prevState.yearFilter) {
      this.filterAlbums();
    }
  }

  filterAlbums() {
    if (this.state.artistFilter.length === 0 && this.state.yearFilter.length === 0) {
      this.setState({
        availableAlbums: albums
      });
    } else if (this.state.artistFilter.length > 0 && this.state.yearFilter.length === 0) {
      const filteredAlbums = albums.filter(album => this.state.artistFilter.includes(album.attributes.artistName));
      this.setState({
          availableAlbums: filteredAlbums
      })
    } else if (this.state.artistFilter.length === 0 && this.state.yearFilter.length > 0) {
      const filteredAlbums = albums.filter(album => this.state.yearFilter.some(year => album.attributes.releaseDate.includes(year)))
      this.setState({
        availableAlbums: filteredAlbums
      });
    } else if (this.state.artistFilter.length > 0 && this.state.yearFilter.length > 0) {
      const filteredAlbums = albums.filter(album => this.state.artistFilter.includes(album.attributes.artistName));
      const doubleFilter = filteredAlbums.filter(album => this.state.yearFilter.some(year => album.attributes.releaseDate.includes(year)));
      this.setState({
        availableAlbums: doubleFilter
      });
    }
      
  }

  filterArtist(selectedList) {
    const artistFilter = selectedList.map(artist => artist.name);
    this.setState({
      artistFilter: artistFilter
    });
    /* if (selectedList.length === 0) {
      this.setState({
        availableAlbums: albums
      })
    } else {
      console.log(selectedList);
      let artistFilter =[];
      for (let i = 0; i < selectedList.length; i++) {
          artistFilter.push(selectedList[i].name)
      }
      console.log(artistFilter);
      const filteredAlbums = albums.filter(album => artistFilter.includes(album.attributes.artistName));
      console.log(filteredAlbums);
      this.setState({
          availableAlbums: filteredAlbums

      })
    } */
  }

  filterYear(selectedList) {
    this.setState({
      yearFilter: selectedList
    });
  }

  render() {
    return (
      <div className="App">
        <div className='filters'>
          <ArtistFilter id='artist-filter' onSelect={this.filterArtist} onRemove={this.filterArtist} />
          <YearFilter onChange={this.filterYear} />
        </div>
        <AlbumContainer albums={this.state.availableAlbums}/>
      </div>
    );
  }
}

export default App;
