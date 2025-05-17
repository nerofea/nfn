const PEXELS_API_KEY = 'YOUR_PEXELS_API_KEY'; // Replace with your actual API key

async function searchPexelsPhotos(query) {
  const response = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=10`, {
    headers: {
      Authorization: PEXELS_API_KEY,
    },
  });
  const data = await response.json();
  return data.photos;
}

function displayPhotoResults(photos) {
  const container = document.getElementById('photo-results');
  container.innerHTML = '';

  photos.forEach(photo => {
    const img = document.createElement('img');
    img.src = photo.src.small;
    img.alt = photo.alt;
    img.style = 'cursor: pointer; margin: 10px; border-radius: 8px;';
    img.onclick = () => setStreamBackground(photo.src.original);
    container.appendChild(img);
  });
}

function setStreamBackground(imageUrl) {
  const stream = document.getElementById('stream-background');
  stream.style.backgroundImage = `url('${imageUrl}')`;
  stream.style.backgroundSize = 'cover';
  stream.style.backgroundPosition = 'center';
}

// Optional: hook to a search input + button
document.getElementById('search-btn').addEventListener('click', async () => {
  const query = document.getElementById('search-input').value;
  if (!query) return;
  const photos = await searchPexelsPhotos(query);
  displayPhotoResults(photos);
});
