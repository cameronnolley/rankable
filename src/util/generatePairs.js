
import seenPairs from "../seenPairs";

export const generatePairs = (array) => {
    let results = [];
    for (let i = 0; i < array.length - 1; i++) {
        for (let j = i + 1; j < array.length; j++)
        results.push([array[i].id, array[j].id])
    };
    console.log(results);
    return results;
}

export const filterPairs = (array) => {
    const pairs = generatePairs(array);
    const filteredPairs = pairs.filter(pair => !seenPairs.includes(pair));
    console.log(filteredPairs);
    return filteredPairs;
}

