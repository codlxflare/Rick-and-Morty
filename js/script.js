document.addEventListener('DOMContentLoaded', () => {
    const characterCont = document.getElementById('characterCont');
    const searchInput = document.getElementById('searchInput');

    let allCharacters = [];

    const fetchAllCharacters = async () => {
    let characters = [];
    let nextPageUrl = 'https://rickandmortyapi.com/api/character/';

    try {
        while (nextPageUrl) {
            const response = await fetch(nextPageUrl);
            const data = await response.json();

            characters = characters.concat(data.results);
            nextPageUrl = data.info.next;
        }

        return characters;
    } catch (error) {
        console.error('Error fetching characters:', error);
        return [];
    }
};

    const renderCharacters = (characters) => {
        characterCont.innerHTML = '';
        characters.forEach(character => {
            const characterCard = document.createElement('div');
            characterCard.className = 'card';
            characterCard.innerHTML = `
                <img src="${character.image}" alt="${character.name}">
                <div class="character-content">
                    <h3>${character.name}</h3>
                    <p>Status: ${character.status}</p>
                    <p>Species: ${character.species}</p>
                    <p>Gender: ${character.gender}</p>
                    <p>Type: ${character.type}</p>
                    <p>Origin: ${character.origin.name}</p>
                </div>
            `;

            characterCont.appendChild(characterCard);
        });
    };

    const filterCharacters = () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredCharacters = allCharacters.filter(character => {
            const matchesName = character.name.toLowerCase().includes(searchTerm);

            return matchesName ;
        });

        renderCharacters(filteredCharacters);
    };

    const loadCharacters = async () => {
        allCharacters = await fetchAllCharacters();
        filterCharacters();
    };

    searchInput.addEventListener('input', filterCharacters);


    loadCharacters();
});
