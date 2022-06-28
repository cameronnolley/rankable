function generatePairs(array) {
    let results = [];
    for (let i = 0; i < array.length - 1; i++) {
        for (let j = i + 1; j < array.length; j++)
        results.push([array[i].id, array[j].id])
    };
    return results;
}

export default generatePairs;