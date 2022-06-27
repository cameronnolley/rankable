import React from "react";
import "./Album.css";

const album = {
    title: "Sour",
    artist: "Olivia Rodrigo",
    url: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/33/fd/32/33fd32b1-0e43-9b4a-8ed6-19643f23544e/21UMGIM26092.rgb.jpg/1200x1200bb.jpg",
    bgColor: "675f9a",
    textColor1: "f3f6fb",
    textColor2: "fbeaf0",
    textColor3: "d7d8e8",
    textColor4: "decedf"
}

const style = { '--bg-color': '#' + album.bgColor, 
                '--text-color-1': '#' + album.textColor1, 
                '--text-color-2': '#' + album.textColor2, 
                '--text-color-3': '#' + album.textColor3, 
                '--text-color-4': '#' + album.textColor4};

class Album extends React.Component {
  mouseDown() {
    document.getElementById("album").style.transform = "scale(0.99)";
  }

  mouseUp() {
    document.getElementById("album").style.transform = "scale(1)";
  }

  render() {
    return (
      <div className="album" id="album" style={style} onMouseDown={this.mouseDown} onMouseUp={this.mouseUp} >
        <img src={album.url} alt={album.title} />
        <h1 className="album-title" >{album.title}</h1>
        <h2 className="album-artist" >{album.artist}</h2>
      </div>
    );
  }
}

export default Album;