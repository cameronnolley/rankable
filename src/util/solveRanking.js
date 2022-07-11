import m4th from 'm4th';

const solveRanking = (results) => {
    let formattedResults = [];
    results.forEach(result => {
        let newResult = {};
        newResult[result.album1.id] = result.album1.result;
        newResult[result.album2.id] = result.album2.result;
        formattedResults.push(newResult);
    });
    console.log(formattedResults);
    let ids = [];
    for (let i = 0; i < formattedResults.length; i++) {
        ids.push(Object.keys(formattedResults[i]))
    };
    console.log(ids);
    let flatIds = ids.flat();
    console.log(flatIds);
    let uniqueIds = [...new Set(flatIds)];
    console.log(uniqueIds);
    let matrix = m4th.matrix(uniqueIds.length);
    matrix = matrix.map(function(element){
        return 0;
      });
    for (let i = 0; i < uniqueIds.length; i++) {
        matrix.set(i, i, flatIds.filter(id => id === uniqueIds[i]).length + 2);
        for (let j = i+1; j < uniqueIds.length; j++) {
            let gameCount = matrix.get(i, j) || 0;
            for (let k = 0; k < formattedResults.length; k++) {
                if (uniqueIds[i] in formattedResults[k] && uniqueIds[j] in formattedResults[k]) {
                    matrix.set(i, j, gameCount-1);
                    matrix.set(j, i, gameCount-1);
                }
            }
        }
    }
    console.log(matrix);
    let ratings = [];
    for (let i = 0; i < uniqueIds.length; i++) {
        let albumWL = [];
        for (let j = 0; j < formattedResults.length; j++) {
            if (uniqueIds[i] in formattedResults[j]) {
                albumWL.push(formattedResults[j][uniqueIds[i]])
            }
        };
        let albumRating = 1 + 0.5 * (albumWL.reduce((previousValue, currentValue) => previousValue + currentValue,
        0));
        ratings.push(albumRating);
    }
    let y = m4th.matrix(uniqueIds.length, ratings);
    const solution = m4th.lu(matrix).solve(y);
    const rankings = [];
    for (let i = 0; i < uniqueIds.length; i++) {
        rankings.push({
            albumId: uniqueIds[i],
            rating: solution.array[i]
        })
    };
    const sortedRankings = rankings.sort((a, b) => b.rating - a.rating);
    return sortedRankings;
}

export default solveRanking;