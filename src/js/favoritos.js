
// Função para carregar os Pokémon favoritos
async function loadFavoritePokemons() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const favoritesContainer = document.getElementById('favorites-container');
    
    if (favorites.length === 0) {
        favoritesContainer.innerHTML = '<p class="text-center">Você ainda não tem Pokémon favoritos.</p>';
        return;
    }

    // Limpar o container antes de adicionar novos cards
    favoritesContainer.innerHTML = '';

    // Para cada Pokémon favorito, cria o card
    for (let index of favorites) {
        await createFavoriteCard(index, favoritesContainer);
    }
}

// Função para criar um card de Pokémon favorito
async function createFavoriteCard(index, container) {
    try {
        // Buscar informações do Pokémon
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${index}`);
        if (!response.ok) {
            throw new Error('Erro ao buscar Pokémon');
        }
        const pokemon = await response.json();

        // Criar o card
        const card = document.createElement('div');
        // card.classList.add('col-12', 'col-md-6', 'col-xl-4', 'mb-4');
        card.innerHTML = `
        <div class="card mx-auto" style="width: 18rem;" id="card-${pokemon.id}">
            <img src="${pokemon.sprites.front_default}" class="card-img-top d-block mx-auto" alt="${pokemon.name}">
            <div class="card-body">
                <h5 class="card-title text-center">${pokemon.name}</h5>
                <p class="card-text text-center">#${pokemon.id}</p>
                <button class="btn btn-primary d-block mx-auto mb-2" onclick="searchPokemon(${pokemon.id})">Ver mais</button>
                <button class="btn btn-danger d-block mx-auto" onclick="removeFromFavorites(${pokemon.id})">Excluir</button>
            </div>
        </div>
    `;
    

        container.appendChild(card);
    } catch (error) {
        console.error('Erro ao criar o card:', error);
    }
}

async function searchPokemon(pokemonId) {
    try {
        // Buscar as informações do Pokémon completo
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
        const modal = document.getElementById('pokemon-modal');
        const modalBody = document.getElementById('modal-body');
        
        if (!response.ok) {
            throw new Error('Erro ao buscar Pokémon');
        }
        const pokemon = await response.json();

        // Buscar detalhes adicionais como as habilidades e tipos
        const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon.id}`);
        const speciesData = await speciesResponse.json();
        const descriptionEntry = speciesData.flavor_text_entries.find(entry => entry.language.name === "en");
        const description = descriptionEntry ? descriptionEntry.flavor_text.replace(/\n|\f/g, ' ') : "Descrição não disponível.";

        // Exibir as informações detalhadas no container
        const detailsContainer = document.getElementById('modal-body');
        detailsContainer.innerHTML = `
            <h2>${pokemon.name}</h2>
            <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
            <p><strong>ID:</strong> #${pokemon.id}</p>
            <p><strong>Tipos:</strong> ${pokemon.types.map(type => type.type.name).join(', ')}</p>
            <p><strong>Habilidades:</strong> ${pokemon.abilities.map(ability => ability.ability.name).join(', ')}</p>
            <p><strong>Descrição:</strong> ${description}</p>
        `;

        const bla = document.getElementById("pokemon-modal");
        bla.classList.remove("d-none");
        document.getElementById('close-modal').addEventListener('click', (event) => {
            bla.classList.add('d-none');
        });
    } catch (error) {
        console.error('Erro ao buscar informações detalhadas do Pokémon:', error);
    }
}


// Função para remover um Pokémon dos favoritos
function removeFromFavorites(id) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    
    // Remover o Pokémon da lista de favoritos
    favorites = favorites.filter(favoriteId => favoriteId !== id.toString());
    
    // Atualizar o localStorage com a nova lista de favoritos
    localStorage.setItem('favorites', JSON.stringify(favorites));
    
    // Recarregar a lista de favoritos na página
    //loadFavoritePokemons();
    const cardToDelete = document.getElementById(`card-${id}`);
    cardToDelete.parentElement.remove();
}

// Carregar Pokémon favoritos quando a página for carregada
document.addEventListener('DOMContentLoaded', loadFavoritePokemons);
