import React, { useState, useEffect } from "react";
import './TableRow.css';
import moment from "moment";
import newShade from "../../util/newShade";
import { Carousel, CarouselItem } from "./TableRowCarousel.js";

const TableRow = (props) => {
    let [style, setStyle] = useState({});

    const formatDate = (date) => {
    return moment(date).format('MMMM Do, YYYY');
    }

    useEffect(() => {
        if (props.album) {
            document.getElementById('editorial-notes-' + props.rank).innerHTML = props.album.attributes.editorialNotes.standard;
            setStyle({
                '--bg-color': '#' + props.album.attributes.artwork.bgColor, 
                '--text-color-1': '#' + props.album.attributes.artwork.textColor1, 
                '--text-color-2': '#' + props.album.attributes.artwork.textColor2, 
                '--text-color-3': '#' + props.album.attributes.artwork.textColor3, 
                '--text-color-4': '#' + props.album.attributes.artwork.textColor4,
                '--shadow': '#' + props.album.attributes.artwork.textColor4 + '25',
                '--shadow-hover': '#' + props.album.attributes.artwork.textColor4 + '80',
                '--bg-gradient': '#' + newShade(props.album.attributes.artwork.bgColor, 8),
                '--bg-image': `url(${props.album.attributes.artwork.url})`,
            });
        }
    }, [props.album]);

    const getArtistName = () => {
        if (Array.isArray(props.album.attributes.artistName)) {
          return props.album.attributes.artistName.join(' & ');
        } else {
          return props.album.attributes.artistName;
        }
    }

    const replaceUrl = (url) => {
        let coverArtUrl = url.replace('{w}', '600').replace('{h}', '600')
        return coverArtUrl;
      }

    const expandTableRow = () => {
        if (document.getElementById(`more ${props.rank}`).innerHTML === 'More') {
            document.getElementById(`table-row-${props.rank}`).style.height = '481px';
            setTimeout(() => {
                document.getElementById(`table-row-${props.rank}`).scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 300);
            document.getElementById(`more ${props.rank}`).innerHTML = 'Less';
            document.getElementById(`more ${props.rank}`).style.visibility = 'visible';
            props.isExpanded(props.rank);
        } else {
            document.getElementById(`table-row-${props.rank}`).style.height = '120px';
            document.getElementById(`more ${props.rank}`).innerHTML = 'More';
            document.getElementById(`more ${props.rank}`).style.visibility = '';
            props.isExpanded('')
        }  
    }

    const getOtherAlbums = (artistInput) => {
        const sameArtist = [];
        props.albums.forEach(album => {
            if (Array.isArray(album.attributes.artistName)) {
                if (album.attributes.artistName.some(artist => artist === artistInput)) {
                    sameArtist.push(album);
                  }
            } else { 
                if (album.attributes.artistName === artistInput) {
                    sameArtist.push(album);
                }
            }
        });
        props.albums.filter(album => album.attributes.artistName === artistInput);
        const otherAlbums = sameArtist.filter(album => album.id !== props.album.id);
        let rankings = [];
        if (props.selectedRanking === 'global') {
            rankings = otherAlbums.map(album => {
                return {
                    album: album,
                    ranking: props.rankingGlobal.findIndex(ranking => ranking.albumId === album.id) + 1
                }
            });
        } else {
            rankings = otherAlbums.map(album => {
                return {
                    album: album,
                    ranking: props.rankingUser.findIndex(ranking => ranking.albumId === album.id) + 1
                }
            });
        }
        const sortedAlbums = rankings.sort((a, b) => a.ranking - b.ranking);
        return sortedAlbums;
    }

    const getAllArtistAlbums = (artistInput) => {
        let sameArtist = [];
        props.albums.forEach(album => {
            if (Array.isArray(album.attributes.artistName)) {
                if (album.attributes.artistName.some(artist => artist === artistInput)) {
                    sameArtist.push(album);
                  }
            } else { 
                if (album.attributes.artistName === artistInput) {
                    sameArtist.push(album);
                }
            }
        });
        let rankings = [];
        if (props.selectedRanking === 'global') {
            rankings = sameArtist.map(album => {
                return {
                    album: album,
                    ranking: props.rankingGlobal.findIndex(ranking => ranking.albumId === album.id) + 1
                }
            });
        } else {    
            rankings = sameArtist.map(album => {
                return {
                    album: album,
                    ranking: props.rankingUser.findIndex(ranking => ranking.albumId === album.id) + 1
                }
            });
        }
        const sortedAlbums = rankings.sort((a, b) => a.ranking - b.ranking);
        return sortedAlbums;
    }

    const renderOtherAlbums = (artistInput) => {
        return getOtherAlbums(artistInput).map((album, index) => (
            <div className='other-album' key={index}>
                <div className='other-album-rank'>
                    {album.ranking}
                </div>
                <img src={replaceUrl(album.album.attributes.artwork.url)} alt={album.album.attributes.name} className='other-album-image'/>
                <p className='other-album-name'>{album.album.attributes.name}</p>
            </div>
        ))
    };

    const getRecentResults = () => {
        let reveresedArray = [];
        if (props.selectedRanking === 'global') {
            reveresedArray = props.resultsGlobal.reverse();
        } else {
            reveresedArray = props.resultsUser.reverse();
        }
        const filteredResults = reveresedArray.filter(result => result.album1.id === props.album.id || result.album2.id === props.album.id);
        let recentResults = [];
        filteredResults.map(result => {
            if (result.album1.id === props.album.id) {
                recentResults.push({
                    album: props.albums.find(album => album.id === result.album2.id),
                    result: result.album2.result
                });
            } else if (result.album2.id === props.album.id) {
                recentResults.push({
                    album: props.albums.find(album => album.id === result.album1.id),
                    result: result.album1.result
                });
            }
        });
        return recentResults;
    }

    const renderRecentResults = () => {
        return getRecentResults().map((result, index) => (
            <div className='recent-result' key={index}>
                <div className='recent-result-outcome'>
                    {result.result === -1 ? 'Win' : 'Loss'}
                </div>
                <img src={replaceUrl(result.album.attributes.artwork.url)} alt={result.album.attributes.name} className='recent-result-image'/>
                <p className='recent-result-name'>{result.album.attributes.name}</p>
            </div>
        ))
    }

    const getArtistArtworkUrl = (artistInput) => { 
        if (props.artists) {
            return props.artists.find(artist => artist.attributes.name === artistInput).attributes.artwork.url.replace('{w}', '300').replace('{h}', '300');
        }
    }

    /* const getWinLoss = () => {
        let albumWL = [];
        for (let i = 0; i < props.resultsGlobal.length; i++) {
            if (props.album.id in formattedResults[i]) {
                albumWL.push(formattedResults[j][uniqueIds[i]])
            }
        };
    } */

    if (props.album) {
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
                            <img src={replaceUrl(props.album.attributes.artwork.url)} alt="album artwork" className="albumArtwork"/>
                            <div className="album-name-artist">
                                <div className="album-text">
                                    <p className="album-name-table">{props.album.attributes.name}</p>
                                    <p className="album-artist-table">{getArtistName()}</p>
                                </div>
                            </div>
                        </div>
                        }
                    </div>
                    <div className="table-cell" id="release-cell">
                        <p>{props.album && formatDate(props.album.attributes.releaseDate)}</p>
                    </div>
                    <div className="table-cell" id="more-cell">
                        <button className='more' id={`more ${props.rank}`} onClick={expandTableRow}>More</button>
                    </div>
                </div>
                <div className="row-expanded" id={`row-expanded-${props.rank}`}>
                    <div className='album-info-expanded'>
                        <div className='album-facts'>
                                <p className="label">PROJECT TYPE:</p>
                                <p>{props.album && props.album.type}</p>
                                <p className="label">GENRE:</p>
                                <p>{props.album && props.album.attributes.genreNames[0]}</p>
                                <p className="label">TRACKs:</p>
                                <p>{props.album && props.album.attributes.trackCount}</p>
                        </div>
                        <div className='editorial-notes'>
                            <p id='editorial-label'>EDITORIAL NOTES:</p>
                            <p className='editorial-notes-standard' id={'editorial-notes-' + props.rank}></p>
                        </div>
                    </div>
                    <div className="recent-results">
                        <p className='label'>RECENT RESULTS:</p>
                        <div className='recent-results-albums'>
                            {renderRecentResults()}
                        </div>
                    </div>
                    <vl/>
                    { !Array.isArray(props.album.attributes.artistName) ?
                    <div className="artist">
                        <div className="artist-info">
                            <img src={getArtistArtworkUrl(props.album.attributes.artistName)} alt="artist artwork" className="artist-artwork"/>
                            <p className='artist-name'>{props.album.attributes.artistName}</p>
                            <div className='artist-stats'>
                                <div className='artist-stats-labels'>
                                    <p>{`Highest album rank: `}</p>
                                    <p>{`Lowest album rank: `}</p>
                                    <p>{`Average album rank: `}</p>
                                </div>
                                <div className='artist-stats-values'>
                                    <p>{`#${getAllArtistAlbums(props.album.attributes.artistName)[0].ranking}`}</p>
                                    <p>{`#${getAllArtistAlbums(props.album.attributes.artistName)[getAllArtistAlbums(props.album.attributes.artistName).length - 1].ranking}`}</p>
                                    <p>{`#${(getAllArtistAlbums(props.album.attributes.artistName).reduce((a, b) => a + b.ranking, 0 ) / getAllArtistAlbums(props.album.attributes.artistName).length).toFixed(1)}`}</p>
                                </div>
                            </div>
                        </div>
                        <div className="other-albums-container">
                            <p className='label'>OTHER ALBUMS:</p>
                            <div className="other-albums">
                                {renderOtherAlbums(props.album.attributes.artistName)}
                            </div>
                        </div>
                    </div>
                    : <Carousel>
                            {props.album.attributes.artistName.map((artist, index) => {
                                return <CarouselItem index={index}>
                                    <div className="artist">
                                        <div className="artist-info">
                                            <img src={getArtistArtworkUrl(artist)} alt="artist artwork" className="artist-artwork"/>
                                            <p className='artist-name'>{artist}</p>
                                            <div className='artist-stats'>
                                                <div className='artist-stats-labels'>
                                                    <p>{`Highest album rank: `}</p>
                                                    <p>{`Lowest album rank: `}</p>
                                                    <p>{`Average album rank: `}</p>
                                                </div>
                                                <div className='artist-stats-values'>
                                                    <p>{`#${getAllArtistAlbums(artist)[0].ranking}`}</p>
                                                    <p>{`#${getAllArtistAlbums(artist)[getAllArtistAlbums(artist).length - 1].ranking}`}</p>
                                                    <p>{`#${(getAllArtistAlbums(artist).reduce((a, b) => a + b.ranking, 0 ) / getAllArtistAlbums(artist).length).toFixed(1)}`}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="other-albums-container">
                                            <p className='label'>OTHER ALBUMS:</p>
                                            <div className="other-albums">
                                                {renderOtherAlbums(artist)}
                                            </div>
                                        </div>
                                    </div>
                                </CarouselItem> }
                            )}
                    </Carousel> }
                </div>
                <div className='expanded-row-bg' id={`expanded-row-bg-${props.rank}`}>
                </div>
            </div>
        );
    }
}

export default TableRow;