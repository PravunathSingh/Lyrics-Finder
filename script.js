const form = document.getElementById('form');
const result = document.getElementById('result');
const searchInput = document.getElementById('lyrics-search');
const more = document.getElementById('more');

const apiURL = 'https://api.lyrics.ovh';

async function searchSongs(searchTerm) {
    const response = await fetch(`${apiURL}/suggest/${searchTerm}`);
    const data = await response.json();

    showData(data);
}

function showData(data) {
    let output = '';
    data.data.forEach(song => {
        output += `
            <li>
                <span><strong>${song.artist.name}</strong> -- ${song.title}</span>
                <button class="btn" data-artist="${song.artist.name} data-songTitle="${song.title}">Get Lyrics</button>
            </li>
        `;
    });

    result.innerHTML = `
        <ul class="songs">
            ${output}
        </ul>
    `;

    if(data.prev || data.next) {
        more.innerHTML = `
            ${data.prev ? `<button class="btn" onClick="getMoreSongs('${data.prev}')">Prev</button>` : ''}
            ${data.next ? `<button class="btn" onClick="getMoreSongs('${data.next}')">Next</button>` : ''}
        `;
    }
    else {
        more.innerHTML = '';
    }
}

async function getMoreSongs(url) {
    const response = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);
    const data = await response.json();

    showData(data);
}

async function getLyrics(artist, songTitle) {
    const response = await fetch(`${apiURL}/v1/${artist}/${songTitle}`);
    const data = await response.json();

    const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>');

    result.innerHTML = `
        <h2><strong>${artist} </strong> -- ${songTitle}</h2>
        <span>${lyrics}</span>
    `;

    more.innerHTML = '';
}

form.addEventListener('submit', e => {
    e.preventDefault();

    const searchTerm = searchInput.value.trim();

    if (!searchTerm) {
        alert('Please enter a search term');
    }
    else {
        searchSongs(searchTerm);
    }
});

result.addEventListener('click', e => {
    const clickedEl = e.target;

    if(clickedEl.tagName == 'BUTTON') {
        const artist = clickedEl.getAttribute('data-artist');
        const songTitle = clickedEl.getAttribute('data-songTitle');

        getLyrics(artist, songTitle);
    }
})
