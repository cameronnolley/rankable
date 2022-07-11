import React from "react";
import './TableRow.css';
import moment from "moment";

const TableRow = (props) => {

    const formatDate = (date) => {
    return moment(date).format('MMMM Do YYYY');
    }

    return (
        <div className="table-row">
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
        </div>
    );
}

export default TableRow;