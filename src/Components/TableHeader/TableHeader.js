import React from "react";
import './TableHeader.css';

const TableHeader = () => {
    return (
        <div className="table-header">
            <div className="table-label" id="rank-label">RANK</div>
            <div className="table-label" id="album-label">ALBUM</div>
            <div className="table-label" id="release-label">RELEASE DATE</div>
            <div className="table-label" id="type-label">PROJECT TYPE</div>
        </div>
    );
}

export default TableHeader;