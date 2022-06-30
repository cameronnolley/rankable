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
function arrayEquals(a, b) {
    return Array.isArray(a) &&
      Array.isArray(b) &&
      a.length === b.length &&
      a.every((val, index) => val === b[index]);
  }

export const filterPairs = (array) => {
    const pairs = generatePairs(array);
    let lastTry = [];
    for (let i = 0; i < pairs.length; i++) {
        for (let j = 0; j < seenPairs.length; j++) {
            if (arrayEquals(pairs[i], seenPairs[j])) {
                lastTry.push(pairs[i]);
            }
        }
    }
    console.log('last try');
    console.log(lastTry);
    const finalTry = pairs.filter(pair => !lastTry.includes(pair))
    console.log(finalTry);
    return finalTry;
    
}

