import albums from "../database";

function getRandomAlbums() {
    let randomAlbum = albums[Math.floor(Math.random()*albums.length)];
    console.log(randomAlbum);
    return randomAlbum
}

export default getRandomAlbums;