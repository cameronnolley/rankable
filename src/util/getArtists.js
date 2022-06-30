function getArtists(array) {
    let results = [];
    for (let i = 0; i < array.length; i++) {
        let artistName = array[i].attributes.artistName;
        let exists = results.some(obj => obj.name === artistName);
        if (!exists) {
            results.push({
                name: artistName,
                id: results.length + 1})
        }
    };
    return results;
}

export default getArtists;