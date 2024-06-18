document.addEventListener('DOMContentLoaded', () => {
    const characterCont = document.getElementById('characterCont');
    const searchInput = document.getElementById('searchInput');
    const statusFilter = document.getElementById('statusFilter');
    const speciesFilter = document.getElementById('speciesFilter');
    const genderFilter = document.getElementById('genderFilter');
    const locationFilter = document.getElementById('locationFilter');
    const paginationCont = document.getElementById('paginationCont');
    let allCharacters = [];
    const charactersPerPage = 20;
    let currentPage = 1;

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
        const startIndex = (currentPage - 1) * charactersPerPage;
        const endIndex = startIndex + charactersPerPage;
        const charactersToRender = characters.slice(startIndex, endIndex);

        charactersToRender.forEach(character => {
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

        renderPagination(characters.length);
    };

    const renderPagination = (totalCharacters) => {
    paginationCont.innerHTML = '';
    const totalPages = Math.ceil(totalCharacters / charactersPerPage);

    const createPageButton = (page) => {
        const pageButton = document.createElement('button');
        pageButton.innerText = page;
        pageButton.className = page === currentPage ? 'active' : '';
        pageButton.onclick = () => {
            currentPage = page;
            filterCharacters();
        };
        return pageButton;
    };

    const addEllipsis = () => {
        const ellipsis = document.createElement('span');
        ellipsis.innerText = '...';
        ellipsis.className = 'ellipsis';
        paginationCont.appendChild(ellipsis);
    };

    if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) {
            paginationCont.appendChild(createPageButton(i));
        }
    } else {
        if (currentPage > 3) {
            paginationCont.appendChild(createPageButton(1));
            if (currentPage > 4) addEllipsis();
        }

        const startPage = Math.max(2, currentPage - 2);
        const endPage = Math.min(totalPages - 1, currentPage + 2);

        for (let i = startPage; i <= endPage; i++) {
            paginationCont.appendChild(createPageButton(i));
        }

        if (currentPage < totalPages - 2) {
            if (currentPage < totalPages - 3) addEllipsis();
            paginationCont.appendChild(createPageButton(totalPages));
        }
    }
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
