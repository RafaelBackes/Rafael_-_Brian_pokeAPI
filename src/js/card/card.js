import { pokemonList } from "../constants/constants.js";
import { searchPokemon } from "../main.js";

// Traduções de descrição (já fornecido no seu código)
const translations = {
    bulbasaur: "Bulbasaur is a grass and poison-type Pokémon.",
    ivysaur: "Ivysaur is a Pokémon that evolves from Bulbasaur.",
    venusaur: "A plant blooms when it is absorbing solar energy. It moves to seek sunlight.",
    charmander: "Charmander is a fire-type Pokémon. It releases fire from its tail.",
    charmeleon: "Charmeleon is the evolved form of Charmander, more temperamental.",
    charizard: "Charizard is the final form of Charmander, known for its large wings.",
    squirtle: "Squirtle is a water-type Pokémon. He is known for his swimming ability.",
    wartortle: "Wartortle is the evolved form of Squirtle, known for its agility in water.",
    blastoise: "Blastoise is a Pokémon that has a powerful shell and can shoot water at high pressure.",
    // Adicione mais traduções conforme necessário
};

// Função que cria o card
export async function createCard(pokemon, index) {
    try {
        // Busca a URL da espécie do Pokémon
        const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${index}`);
        if (!speciesResponse.ok) {
            throw new Error(`Erro ao buscar detalhes da espécie para o Pokémon: ${pokemon.name}`);
        }
        const speciesData = await speciesResponse.json();

        // Obtém a descrição do Pokémon
        const descriptionEntry = speciesData.flavor_text_entries.find(entry => entry.language.name === "en");
        let description = descriptionEntry 
            ? descriptionEntry.flavor_text.replace(/\n|\f/g, ' ') 
            : "Descrição não disponível.";

        // Se houver uma tradução disponível, substitua a descrição
        description = translations[pokemon.name] || description;

        // Criação do card
        const card = document.createElement("div");
        card.classList.add("card");
        card.style.width = "18rem";

        const image = document.createElement("img");
        image.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index}.png`;
        image.classList.add("card-img-top");
        image.alt = pokemon.name;

        const cardBody = document.createElement("div");
        cardBody.classList.add("card-body");

        const cardTitle = document.createElement("h5");
        cardTitle.classList.add("card-title");
        cardTitle.style.textAlign = "center";
        cardTitle.innerText = pokemon.name;

        const cardText = document.createElement("p");
        cardText.classList.add("card-text");
        cardText.innerText = description;

        const cardClick = document.createElement("a");
        cardClick.addEventListener("click", () => searchPokemon(pokemon.name));
        cardClick.innerText = "Ver mais";
        cardClick.classList.add("btn");
        cardClick.classList.add("btn-primary");

        // Botão de Favoritar
        const favoriteButton = document.createElement("button");
        favoriteButton.classList.add("btn", "btn-outline-warning", "mt-2");
        favoriteButton.innerHTML = '<i class="bi bi-star"></i> Favoritar';
        favoriteButton.id = `favorite-button-${index}`;

        // Verifica se o Pokémon já está nos favoritos
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        if (favorites.includes(index.toString())) {
            favoriteButton.classList.add('active');
            favoriteButton.innerHTML = '<i class="bi bi-star-fill"></i> Favorito';
        }

        // Função para adicionar/remover dos favoritos
        favoriteButton.addEventListener("click", () => toggleFavorite(index, favoriteButton));

        // Adiciona todos os elementos ao card
        cardBody.appendChild(cardTitle);
        cardBody.appendChild(cardText);
        cardBody.appendChild(cardClick);
        cardBody.appendChild(favoriteButton); // Botão de Favoritar
        card.appendChild(image);
        card.appendChild(cardBody);

        // Adiciona o card ao container de Pokémon
        pokemonList.appendChild(card);
    } catch (error) {
        console.error("Erro ao criar o card:", error);
        // Adiciona um card de erro, se necessário, para feedback visual
        pokemonList.innerHTML += `<div class="card-error">Não foi possível carregar ${pokemon.name}</div>`;
    }
}

// Função para adicionar/remover Pokémon dos favoritos
function toggleFavorite(index, button) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    if (favorites.includes(index.toString())) {
        // Remove dos favoritos
        favorites = favorites.filter(favoriteId => favoriteId !== index.toString());
        button.classList.remove('active');
        button.innerHTML = '<i class="bi bi-star"></i> Favoritar';
    } else {
        // Adiciona aos favoritos
        favorites.push(index.toString());
        button.classList.add('active');
        button.innerHTML = '<i class="bi bi-star-fill"></i> Favorito';
    }

    // Salva os favoritos no localStorage
    localStorage.setItem('favorites', JSON.stringify(favorites));
}
