function getArtists(array) {
    let results = [];
    for (let i = 0; i < array.length; i++) {
        if (Array.isArray(array[i].attributes.artistName)){
            for (let j = 0; j < array[i].attributes.artistName.length; j++) {
                let artistName = array[i].attributes.artistName[j];
                let exists = results.some(obj => obj.name === artistName);
                 if (!exists) {
                    results.push({
                        name: artistName,
                        id: results.length + 1,
                        count: array.filter(album => album.attributes.artistName === artistName).length})
                }
            }
        } else {
            let artistName = array[i].attributes.artistName;
            let exists = results.some(obj => obj.name === artistName);
            if (!exists) {
            results.push({
                name: artistName,
                id: results.length + 1,
                count: array.filter(album => album.attributes.artistName === artistName).length})
            }
        }
    };
    let sortedResults = results.sort((a, b) => b.count - a.count);
    return sortedResults;
}

export default getArtists;