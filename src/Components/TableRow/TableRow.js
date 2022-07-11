import React, { useState, useEffect } from "react";
import './TableRow.css';
import moment from "moment";
import newShade from "../../util/newShade";

const TableRow = (props) => {

    const formatDate = (date) => {
    return moment(date).format('MMMM Do, YYYY');
    }

    useEffect(() => {
        if (props.album) {
            document.getElementById('editorial-notes-' + props.rank).innerHTML = props.album.attributes.editorialNotes.standard;
        }
    }, [props.album]);
    
    const style = { '--bg-color': '#' + props.album.attributes.artwork.bgColor, 
                '--text-color-1': '#' + props.album.attributes.artwork.textColor1, 
                '--text-color-2': '#' + props.album.attributes.artwork.textColor2, 
                '--text-color-3': '#' + props.album.attributes.artwork.textColor3, 
                '--text-color-4': '#' + props.album.attributes.artwork.textColor4,
                '--shadow': '#' + props.album.attributes.artwork.textColor4 + '25',
                '--shadow-hover': '#' + props.album.attributes.artwork.textColor4 + '50',
                '--bg-gradient': '#' + newShade(props.album.attributes.artwork.bgColor, 8)}

    const expandTableRow = () => {
        document.getElementById(`table-row-${props.rank}`).style.height = '481px';
        document.getElementById(`table-row-${props.rank}`).scrollIntoView({ behavior: 'smooth' });
        
    }

    const getOtherAlbums = () => {
        const sameArtist = props.albums.filter(album => album.attributes.artistName === props.album.attributes.artistName);
        const otherAlbums = sameArtist.filter(album => album.id !== props.album.id);
        const rankings = otherAlbums.map(album => {
            return {
                album: album,
                ranking: props.ranking.findIndex(ranking => ranking.albumId === album.id) + 1
            }
        });
        const sortedAlbums = rankings.sort((a, b) => a.ranking - b.ranking);
        return sortedAlbums;
    }

    const getAllArtistAlbums = () => {
        const sameArtist = props.albums.filter(album => album.attributes.artistName === props.album.attributes.artistName);
        const rankings = sameArtist.map(album => {
            return {
                album: album,
                ranking: props.ranking.findIndex(ranking => ranking.albumId === album.id) + 1
            }
        });
        const sortedAlbums = rankings.sort((a, b) => a.ranking - b.ranking);
        return sortedAlbums;
    }

    const renderOtherAlbums = () => {
        return getOtherAlbums().map((album, index) => (
            <div className='other-album' key={index}>
                <div className='other-album-rank'>
                    {album.ranking}
                </div>
                <img src={album.album.attributes.artwork.url} alt={album.album.attributes.name} className='other-album-image'/>
                <p className='other-album-name'>{album.album.attributes.name}</p>
            </div>
        ))
    };

    return (
        <div className="table-row" id={`table-row-${props.rank}`} style={style}>
            <div className="row-default">
                <div className="table-cell" id="rank-cell">
                    <div className='rank-container'>
                        <p>{props.rank}</p>
                    </div>
                </div>
                <div className="table-cell" id="album-cell">
                    {props.album &&
                    <div className="album-info">
                        <img src={props.album.attributes.artwork.url} alt="album artwork" className="albumArtwork"/>
                        <div className="album-name-artist">
                            <div className="album-text">
                                <p className="album-name-table">{props.album.attributes.name}</p>
                                <p className="album-artist-table">{props.album.attributes.artistName}</p>
                            </div>
                        </div>
                    </div>
                    }
                </div>
                <div className="table-cell" id="release-cell">
                    <p>{props.album && formatDate(props.album.attributes.releaseDate)}</p>
                </div>
                <div className="table-cell" id="type-cell">
                    <p>{props.album && props.album.type}</p>
                </div>
                <div className="table-cell" id="more-cell">
                    <button id='more' onClick={expandTableRow}>More &nbsp; ▼</button>
                </div>
            </div>
            <div className="row-expanded" id={`row-expanded-${props.rank}`}>
                <div className='album-stats'>

                </div>
                <div className="album-description">
                    <p id={'editorial-notes-' + props.rank}></p>
                </div>
                <vl></vl>
                <div className="artist-info">
                    <img src='https://is1-ssl.mzstatic.com/image/thumb/Features125/v4/b2/bd/8b/b2bd8b72-6528-28e3-7e5f-d637c9c89f4e/mza_17710009188773268806.png/1200x1200bb.jpg' alt="artist artwork" className="artist-artwork"/>
                    <p className='artist-name'>{props.album.attributes.artistName}</p>
                    <div className='artist-stats'>
                        <p>{`Highest album rank: #${getAllArtistAlbums()[0].ranking}`}</p>
                        <p>{`Lowest album rank: #${getAllArtistAlbums()[getAllArtistAlbums().length - 1].ranking}`}</p>
                        <p>{`Average album rank: #${getAllArtistAlbums().reduce((a, b) => a + b.ranking, 0 ) / getAllArtistAlbums().length}`}</p>
                    </div>
                </div>
                <div className="other-albums">
                    {renderOtherAlbums()}
                </div>
            </div>
        </div>
    );
}

export default TableRow;