
// Função para buscar os dados de um Pokémon pelo seu ID na PokeAPI
async function fetchPokemonById(pokemonId) {
    const apiUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonId}`;
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Pokémon não encontrado!');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao buscar dados do Pokémon:', error.message);
        return null;
    }
}

// Função para preencher a página de detalhes com os dados do Pokémon
function updateDetailPage(pokemonData) {
    if (!pokemonData) {
        alert("Erro: Pokémon não encontrado.");
        return;
    }

    // Mapeia os elementos do HTML
    const nameElement = document.querySelector('.header .name');
    const numberElement = document.querySelector('.header .number');
    const imageElement = document.querySelector('.image img');
    const heightElement = document.getElementById('pokemon-height');
    const weightElement = document.getElementById('pokemon-weight');
    const abilitiesElement = document.getElementById('pokemon-abilities');

    // Mapeia os novos elementos da barra de status
    const hpValueElement = document.getElementById('stat-hp-value');
    const attackValueElement = document.getElementById('stat-attack-value');
    const defenseValueElement = document.getElementById('stat-defense-value');

    const hpBarElement = document.getElementById('stat-hp-bar');
    const attackBarElement = document.getElementById('stat-attack-bar');
    const defenseBarElement = document.getElementById('stat-defense-bar');

    // Mapeia os novos elementos de tipo
    const contentSection = document.querySelector('.content');
    const typesElement = document.querySelector('.pokemon-types .types');


    // Preenche os dados
    nameElement.textContent = pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1);
    numberElement.textContent = `#${pokemonData.id}`;
    imageElement.src = pokemonData.sprites.other['official-artwork'].front_default;
    imageElement.alt = `Imagem do Pokémon ${pokemonData.name}`;

    // A API retorna o tipo principal em 'pokemonData.types[0].type.name'
    const mainType = pokemonData.types[0].type.name;
    contentSection.classList.add(mainType); // Define a cor de fundo da seção principal com base no tipo

    // Preenche a lista de tipos
    const typesHtml = pokemonData.types.map(typeSlot =>
        `<li class="type ${typeSlot.type.name}">${typeSlot.type.name}</li>`
    ).join('');
    typesElement.innerHTML = typesHtml;

    // A API retorna altura em decímetros e peso em hectogramas.
    heightElement.textContent = ` ${(pokemonData.height / 10).toFixed(1)} m`;
    weightElement.textContent = ` ${(pokemonData.weight / 10).toFixed(1)} kg`;

    // Constrói a string de habilidades
    const abilitiesList = pokemonData.abilities.map(ability => ability.ability.name).join(', ');
    abilitiesElement.textContent = abilitiesList;

    // Preenche os valores numéricos dos status
    const hp = pokemonData.stats.find(stat => stat.stat.name === 'hp').base_stat;
    const attack = pokemonData.stats.find(stat => stat.stat.name === 'attack').base_stat;
    const defense = pokemonData.stats.find(stat => stat.stat.name === 'defense').base_stat;

    hpValueElement.textContent = hp;
    attackValueElement.textContent = attack;
    defenseValueElement.textContent = defense;

    const maxStatValue = 200;

    hpBarElement.classList.add('hp');
    hpBarElement.style.setProperty('--bar-width', `${(hp / maxStatValue) * 100}%`);

    attackBarElement.classList.add('attack');
    attackBarElement.style.setProperty('--bar-width', `${(attack / maxStatValue) * 100}%`);

    defenseBarElement.classList.add('defense');
    defenseBarElement.style.setProperty('--bar-width', `${(defense / maxStatValue) * 100}%`);
}


document.addEventListener('DOMContentLoaded', async () => {
    // Pega o ID do Pokémon da URL
    const urlParams = new URLSearchParams(window.location.search);
    const pokemonId = urlParams.get('id');

    if (pokemonId) {
        const pokemonData = await fetchPokemonById(pokemonId);
        updateDetailPage(pokemonData);
    } else {
        alert("Nenhum Pokémon especificado na URL!");
    }
});