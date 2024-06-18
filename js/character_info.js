document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const characterId = urlParams.get('id');
    const response = await fetch(`https://rickandmortyapi.com/api/character/${characterId}`);
    const character = await response.json();

    document.getElementById('characterName').textContent = character.name;
    document.getElementById('characterDetail').innerHTML = `
        <img src="${character.image}" alt="${character.name}">
        <p>Status: ${character.status}</p>
        <p>Species: ${character.species}</p>
        <p>Gender: ${character.gender}</p>
        ${character.type ? `<p>Type: ${character.type}</p>` : ''}
        <p>Origin: ${character.origin.name}</p>
        <p>Location: ${character.location.name}</p>
    `;
    document.getElementById('backButton').addEventListener('click', () => {
                history.back();
            });
});
