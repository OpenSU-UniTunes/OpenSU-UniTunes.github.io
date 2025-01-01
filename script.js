
const Bearer ='BQCZ96F7qfQF4BH6ZB7vvqFnXLBuOXIhlf2B1VB4GTpzKJoYmu10hY3XXE_vB1-w7Uji7_UirJhM0FXvgwH2bv3vyHkZVqvkO94X2N9XVarVEoB3fro'; 

document.getElementById('songSearchForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const artist = document.getElementById('artist').value;
    const song = document.getElementById('song').value;
    const query = `track:${song} artist:${artist}`;
    const searchResultsDiv = document.getElementById('searchResults');
    const addToQueueButton = document.getElementById('addToQueue');
    searchResultsDiv.innerHTML = '<p>Searching...</p>'; // Show loading state

    fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track`, {
        headers: {
            'Authorization': `Bearer ${Bearer}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.tracks.items.length === 0) {
            searchResultsDiv.innerHTML = '<p>No results found.</p>';
            addToQueueButton.disabled = true;
        } else {
            searchResultsDiv.innerHTML = data.tracks.items.map(track => `
                <div>
                    <input type="radio" name="track" value="${track.uri}">
                    ${track.name} by ${track.artists.map(artist => artist.name).join(', ')}
                </div>
            `).join('');
            addToQueueButton.disabled = false;
        }
    })
    .catch(error => {
        console.error('Error during search:', error);
        searchResultsDiv.innerHTML = '<p>An error occurred while searching. Please try again.</p>';
    });
});

document.getElementById('addToQueue').addEventListener('click', function() {
    const selectedTrack = document.querySelector('input[name="track"]:checked');
    if (!selectedTrack) {
        alert('Please select a track.');
        return;
    }

    const trackUri = selectedTrack.value;
    console.log(`Selected track URI: ${trackUri}`);

    fetch(`https://api.spotify.com/v1/me/player/queue?uri=${encodeURIComponent(trackUri)}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        console.log('API Response:', response);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Track added to queue!', data);
        alert('Track added to queue successfully!');
    })
    .catch(error => {
        console.error('Error adding track to queue:', error);
        alert('Failed to add track to queue. Please try again.');
    });
});
