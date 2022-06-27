import React from "react";
import "./Album.css";
import getRandomAlbums from "../../util/getRandomAlbum";
import getPairs from "../../util/getPairs";
import albums from "../database";

class Album extends React.Component {
  constructor(props) {
    super(props);

    this.state= {
      title: "",
      artist: "",
      url: "",
      bgColor: "",
      textColor1: "",
      textColor2: "",
      textColor3: "",
      textColor4: ""
    }

    this.handleClick = this.handleClick.bind(this)
  }

  mouseDown() {
    document.getElementById("album").style.transform = "scale(0.99)";
  }

  mouseUp() {
    document.getElementById("album").style.transform = "scale(1)";
  }

  handleClick() {
    let album = getRandomAlbums();
    this.setState({
      title: album.attributes.name,
      artist: album.attributes.artistName,
      url: album.attributes.artwork.url,
      bgColor: album.attributes.artwork.bgColor,
      textColor1: album.attributes.artwork.textColor1,
      textColor2: album.attributes.artwork.textColor2,
      textColor3: album.attributes.artwork.textColor3,
      textColor4: album.attributes.artwork.textColor4
    })
  }

  componentDidMount() {
    this.handleClick();
    getPairs(albums);

  }

  render() {
    const style = { '--bg-color': '#' + this.state.bgColor, 
                '--text-color-1': '#' + this.state.textColor1, 
                '--text-color-2': '#' + this.state.textColor2, 
                '--text-color-3': '#' + this.state.textColor3, 
                '--text-color-4': '#' + this.state.textColor4,
                '--shadow': '#' + this.state.textColor4 + '25'}

    return (
      <div className="album" id="album" style={style} onMouseDown={this.mouseDown} onMouseUp={this.mouseUp} onClick={this.handleClick}>
        <img src={this.state.url} alt={this.state.title} />
        <h1 className="album-title" >{this.state.title}</h1>
        <h2 className="album-artist" >{this.state.artist}</h2>
      </div>
    );
  }
}

export default Album;