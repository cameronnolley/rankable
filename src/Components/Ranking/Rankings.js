import React, { useState, useEffect } from "react";
import TableRow from "../TableRow/TableRow";
import axios from "axios";
import TableHeader from "../TableHeader/TableHeader";
import './Rankings.css';
import RankingSelect from "../RankingSelect/RankingSelect";
import ArtistFilter from "../ArtistFilter/ArtistFilter";
import solveRanking from "../../util/solveRanking";
import jsCookie from "js-cookie";
import uuid from "uuid";

const Rankings = () => {

    let [albums, setAlbums] = useState([]);
    let [resultsGlobal, setResultsGlobal] = useState([]);
    let [resultsUser, setResultsUser] = useState([]);
    let [rankingGlobal, setRankingGlobal] = useState([]);
    let [rankingUser, setRankingUser] = useState([]);
    let [userId, setUserId] = useState('');
    let [selectedRanking, setSelectedRanking] = useState('global');
    let [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        getUserId();
        fetchAlbums();
        fetchResults();
    }, []);

    useEffect(() => {
        getUserData();
    }, [userId]);

    useEffect(() => {
        if (resultsGlobal.length > 0) {
            setRankingGlobal(solveRanking(resultsGlobal));
        }
    }, [resultsGlobal]);

    useEffect(() => {
        if (resultsUser.length > 0) {
            setRankingUser(solveRanking(resultsUser));
        }
    }, [resultsUser]);

    useEffect(() => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
        }, 500);
    }, [selectedRanking]);

    const getUserId = () => {
        if (!jsCookie.get('user')) {
          jsCookie.set('user', uuid.v4(), { expires: 10000 });
        } else {
          setUserId(jsCookie.get('user'));
        }
      }

    const fetchAlbums = () => {
        axios.get('https://data.mongodb-api.com/app/rankabl-bwhkm/endpoint/albums', {
          params: {
            "verification_method": "SECRET_AS_QUERY_PARAM",
            "secret": "temperature"
          }
        })
        .then(response => {
          setAlbums(response.data);
        })
        .catch(err => {
          console.log(err);
        });
      }

    const fetchResults = () => {
        axios.get('https://data.mongodb-api.com/app/rankabl-bwhkm/endpoint/getResults', {
        })
        .then(response => {
            setResultsGlobal(response.data);
        })
        .catch(err => {
            console.log(err);
         });
    }

    const getUserData = () => {
        if (userId !== '') {
          axios.get('https://data.mongodb-api.com/app/rankabl-bwhkm/endpoint/getuser', {
            params: {
              userId: userId
            }
          }).then (response => {
            if (response.data !== null) {
            setResultsUser(response.data.results);
            console.log(resultsUser);
            }
          })
        }
      }

    const changeRanking = (selectedItem) => {
        setSelectedRanking(selectedItem[0].value);
    };


    const renderTable = (ranking) => {
        if (isLoading) {
            return <span className='loader' ></span>
        } else {
            return ranking.map((result, index) => (
                <TableRow key={index} album={albums.find(album => album.id === result.albumId)} rank={index + 1} albums={albums} ranking={rankingGlobal}/>
            ));
        }
    }

    return (
        <div>
            <div className='filters-rankings'>
                <RankingSelect onSelect={changeRanking}/>
                <ArtistFilter />
                <button className='share'>Share</button>
            </div>
            <TableHeader />
            <div className='table-container' id='table-container'>
                {selectedRanking === 'personal' ? renderTable(rankingUser) : renderTable(rankingGlobal)}
            </div>
        </div>
    );
}

export default Rankings;