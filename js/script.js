document.addEventListener('DOMContentLoaded', () => {
    const characterCont = document.getElementById('characterCont');
    const searchInput = document.getElementById('searchInput');
    const statusFilter = document.getElementById('statusFilter');
    const speciesFilter = document.getElementById('speciesFilter');
    const genderFilter = document.getElementById('genderFilter');
    const locationFilter = document.getElementById('locationFilter');
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
                    <p>Species: ${character.species}</p>
                    <p>Status: ${character.status}</p>
                    <p>Location: ${character.location.name}</p>
                </div>
            `;
            characterCard.onclick = () => {
                window.location.href = `character.html?id=${character.id}`;
            };
            characterCont.appendChild(characterCard);
        });
    };

    const filterCharacters = () => {
            const searchTerm = searchInput.value.toLowerCase();
            const statusTerm = statusFilter.value;
            const speciesTerm = speciesFilter.value;
            const genderTerm = genderFilter.value;
            const locationTerm = locationFilter.value.toLowerCase();

            const filteredCharacters = allCharacters.filter(character => {
                const matchesName = character.name.toLowerCase().includes(searchTerm);
                const matchesStatus = !statusTerm || character.status.toLowerCase() === statusTerm;
                const matchesSpecies = !speciesTerm || character.species.toLowerCase() === speciesTerm;
                const matchesGender = !genderTerm || character.gender.toLowerCase() === genderTerm;
                const matchesLocation = !locationTerm || character.location.name.toLowerCase().includes(locationTerm);
                return matchesName && matchesStatus && matchesSpecies && matchesGender && matchesLocation;
            });

            renderCharacters(filteredCharacters);
        };

        const loadCharacters = async () => {
            allCharacters = await fetchAllCharacters();
            filterCharacters();
        };

        searchInput.addEventListener('input', filterCharacters);
        statusFilter.addEventListener('change', filterCharacters);
        speciesFilter.addEventListener('change', filterCharacters);
        genderFilter.addEventListener('change', filterCharacters);
        locationFilter.addEventListener('change', filterCharacters);

        loadCharacters();
    });
