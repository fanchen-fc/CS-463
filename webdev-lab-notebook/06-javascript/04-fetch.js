const pokemonColors = {
  normal: '#A8A77A',
  fire: '#EE8130',
  water: '#6390F0',
  electric: '#F7D02C',
  grass: '#7AC74C',
  ice: '#96D9D6',
  fighting: '#d28a87',
  poison: '#ea7ce8',
  ground: '#E2BF65',
  flying: '#A98FF3',
  psychic: '#F95587',
  bug: '#A6B91A',
  rock: '#B6A136',
  ghost: '#8e829d',
  dragon: '#b79ff5',
  dark: '#918278',
  steel: '#B7B7CE',
  fairy: '#D685AD',
};

const createNewElement = function (data) {
  const { name: pokemonName, types } = data;
  const { front_default: PokemonImage } = data.sprites.other['official-artwork'];

  const pokemonTypesArr = types.map((type) => type.type.name);

  const card = document.createElement('div');
  const h2 = document.createElement('h2');
  const img = document.createElement('img');
  const typesDiv = document.createElement('div');

  h2.textContent = pokemonName;
  img.src = PokemonImage;
  img.alt = pokemonName;
  img.width = 130;
  img.height = 130;

  card.classList.add('pokemon-card');

  pokemonTypesArr.forEach((item) => {
    const span = document.createElement('span');
    span.textContent = item;
    span.style.backgroundColor = pokemonColors[item] || '#ccc';
    span.classList.add('pokemonType');
    typesDiv.append(span);
  });

  card.append(h2, img, typesDiv);

  return card;
};

const fetchData = async function () {
  const url = 'https://pokeapi.co/api/v2/pokemon?limit=250&offset=0';
  const pokelist = document.querySelector('.poke-list');

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    const pokemonList = data.results;

    const promises = pokemonList.map((pokemon) =>
      fetch(pokemon.url).then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
    );

    const pokemonData = await Promise.all(promises);

    pokemonData.forEach((pokemon) => {
      const elem = createNewElement(pokemon);
      pokelist.append(elem);
    });
  } catch (error) {
    console.error('Error fetching data from the PokeAPI:', error);

    const errorElement = document.createElement('p');
    errorElement.textContent = 'Failed to fetch Pokémon data.';
    errorElement.classList.add('errorMessage');
    (pokelist || document.body).append(errorElement);
  } finally {
    document.querySelector('.loading')?.classList.add('display-none');
    document.querySelector('.loader')?.classList.add('display-none');
    document.querySelector('.loading-container')?.classList.add('display-none');
  }
};

fetchData();