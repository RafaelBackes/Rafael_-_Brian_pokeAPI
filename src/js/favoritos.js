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
        card.classList.add('col-md-3', 'mb-4');

        card.innerHTML = `
            <div class="card" style="width: 18rem;">
                <img src="${pokemon.sprites.front_default}" class="card-img-top" alt="${pokemon.name}">
                <div class="card-body">
                    <h5 class="card-title">${pokemon.name}</h5>
                    <p class="card-text">#${pokemon.id}</p>
                    <button class="btn btn-danger" onclick="removeFromFavorites(${pokemon.id})">Excluir</button>
                </div>
            </div>
        `;

        container.appendChild(card);
    } catch (error) {
        console.error('Erro ao criar o card:', error);
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
    loadFavoritePokemons();
}

// Carregar Pokémon favoritos quando a página for carregada
document.addEventListener('DOMContentLoaded', loadFavoritePokemons);
