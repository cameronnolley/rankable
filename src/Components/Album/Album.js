import React from "react";
import "./Album.css";
import newShade from "../../util/newShade";

class Album extends React.Component {
  
  /* mouseDown() {
    document.getElementById().style.transform = "scale(0.99)";
  } */

  /* mouseUp() {
    document.getElementById().style.transform = "scale(1)";
  } */

  
  render() {
    if (this.props.album) {
      const style = { '--bg-color': '#' + this.props.album.attributes.artwork.bgColor, 
                  '--text-color-1': '#' + this.props.album.attributes.artwork.textColor1, 
                  '--text-color-2': '#' + this.props.album.attributes.artwork.textColor2, 
                  '--text-color-3': '#' + this.props.album.attributes.artwork.textColor3, 
                  '--text-color-4': '#' + this.props.album.attributes.artwork.textColor4,
                  '--shadow': '#' + this.props.album.attributes.artwork.textColor4 + '25',
                  '--shadow-hover': '#' + this.props.album.attributes.artwork.textColor4 + '50',
                  '--bg-gradient': '#' + newShade(this.props.album.attributes.artwork.bgColor, 8)}

      return (
        <div className="album" id={this.props.id} style={style} onMouseDown={this.mouseDown} onMouseUp={this.mouseUp} onClick={this.props.onClick}>
          <img src={this.props.album.attributes.artwork.url} alt={this.props.album.attributes.name} />
          <h1 className="album-title" >{this.props.album.attributes.name}</h1>
          <h2 className="album-artist" >{this.props.album.attributes.artistName}</h2>
        </div>
      );
    } 
  }
}

export default Album;