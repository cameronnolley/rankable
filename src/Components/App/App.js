import './App.css';
import AlbumContainer from '../AlbumContainer/AlbumContainer';
import React from 'react';
import ArtistFilter from '../ArtistFilter/ArtistFilter';
import albums from '../../database';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      artistFilter: [],
      availableAlbums: albums
    }

    this.filterArtist = this.filterArtist.bind(this);

  }


  filterArtist(selectedList) {
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
  }

  render() {
    return (
      <div className="App">
        <div className='filters'>
          <ArtistFilter id='artist-filter' onSelect={this.filterArtist} />
        </div>
        <AlbumContainer albums={this.state.availableAlbums}/>
      </div>
    );
  }
}

export default App;
