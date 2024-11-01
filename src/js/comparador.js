// Elementos DOM
const pokemonCard1 = document.getElementById('pokemon-card-1');
const pokemonCard2 = document.getElementById('pokemon-card-2');
const compareButton = document.getElementById('compare-button');

// Função para buscar e exibir os detalhes do Pokémon
async function fetchAndDisplayPokemon(query, cardElement) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${query.toLowerCase()}`);
        if (!response.ok) throw new Error('Pokémon não encontrado');
        const pokemon = await response.json();
        
        // Renderizar os detalhes do Pokémon no card
        cardElement.innerHTML = `
            <div class="pokemon-details">
                <img src="${pokemon.sprites.front_default}" class="img-fluid" alt="${pokemon.name}">
                <h3>${capitalizeFirstLetter(pokemon.name)}</h3>
                <p><strong>Tipo(s):</strong> ${pokemon.types.map(type => capitalizeFirstLetter(type.type.name)).join(', ')}</p>
                <p><strong>HP:</strong> ${pokemon.stats.find(stat => stat.stat.name === "hp")?.base_stat || 0}</p>
                <p><strong>Ataque:</strong> ${pokemon.stats.find(stat => stat.stat.name === "attack")?.base_stat || 0}</p>
                <p><strong>Defesa:</strong> ${pokemon.stats.find(stat => stat.stat.name === "defense")?.base_stat || 0}</p>
                <p><strong>Velocidade:</strong> ${pokemon.stats.find(stat => stat.stat.name === "speed")?.base_stat || 0}</p>
                <p><strong>Habilidade:</strong> ${capitalizeFirstLetter(pokemon.abilities[0]?.ability.name || 'Nenhuma')}</p>
            </div>
        `;
    } catch (error) {
        console.error(error.message);
        cardElement.innerHTML = '<p>Pokémon não encontrado! Por favor, verifique o nome ou número.</p>';
    }
}

// Evento de clique no botão de comparação
compareButton.addEventListener('click', () => {
    const query1 = prompt('Digite o nome ou número do primeiro Pokémon:');
    const query2 = prompt('Digite o nome ou número do segundo Pokémon:');
    if (query1 && query2) {
        fetchAndDisplayPokemon(query1, pokemonCard1);
        fetchAndDisplayPokemon(query2, pokemonCard2);
    }
});

// Função para capitalizar a primeira letra de uma string
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}