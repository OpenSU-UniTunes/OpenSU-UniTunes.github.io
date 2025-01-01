const token = 'BQCZ96F7qfQF4BH6ZB7vvqFnXLBuOXIhlf2B1VB4GTpzKJoYmu10hY3XXE_vB1-w7Uji7_UirJhM0FXvgwH2bv3vyHkZVqvkO94X2N9XVarVEoB3fro'; // Replace with your new access token

document.getElementById('songSearchForm').addEventListener('submit', function(e) { 
    e.preventDefault(); 

    const artist = document.getElementById('artist').value; 
    const song = document.getElementById('song').value; 
    const query = `track:${song} artist:${artist}`; 
    
    fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track`, { 
    headers: { 'Authorization': `Bearer ${token}` 
} 
}) 
.then(response => { 
    if (!response.ok) { 
        throw new Error(`HTTP error! Status: ${response.status}`); 
    } 
    return response.json(); 
}) 
.then(data => { 
    const searchResultsDiv = document.getElementById('searchResults'); 
    searchResultsDiv.innerHTML = data.tracks.items.map(track => ` 
        <div> 
        <input type="radio" name="track" value="${track.uri}"> 
        ${track.name} by ${track.artists.map(artist => artist.name).join(', ')} 
        </div> 
        `).join(''); 
        document.getElementById('addToQueue').disabled = false; 
    }) 
    .catch(error => console.error('Error during search:', error)); 
}); 

document.getElementById('addToQueue').addEventListener('click', function() { 
    const selectedTrack = document.querySelector('input[name="track"]:checked').value; 
    console.log(`Selected track URI: ${selectedTrack}`); 
    fetch(`https://api.spotify.com/v1/me/player/queue?uri=${selectedTrack}`, { 
    method: 'POST', 
    headers: { 
        'Authorization': `Bearer ${token}` 
    } 
}) 
.then(response => { 
    console.log('API Response:', response); // Log the entire response 
    if (!response.ok) { 
        throw new Error(`HTTP error! Status: ${response.status}`); 
    } 
    return response.json(); 
}) 
.then(data => { 
    console.log('Track added to queue!', data); 
}) 
.catch(error => console.error('Error adding track to queue:', error)); 
});
