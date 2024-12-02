// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [filteredPokemonList, setFilteredPokemonList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

 
  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=1000');
        setPokemonList(response.data.results);
        setFilteredPokemonList(response.data.results); 
        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar os Pokémons:', error);
        setLoading(false);
      }
    };

    fetchPokemons();
  }, []);

  
  const handleSearch = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (query) {
     
      const filteredList = pokemonList.filter(
        (pokemon) =>
          pokemon.name.toLowerCase().includes(query.toLowerCase()) ||
          pokemon.url.includes({query})
      );
      setFilteredPokemonList(filteredList);
    } else {
      setFilteredPokemonList(pokemonList);
    }
  };

  if (loading) {
    return <div>Carregando Pokémons...</div>;
  }

  return (
    <div className="App">
      <h1>Pokedex</h1>

      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar Pokémon por nome ou ID"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      <div className="pokemon-list">
        {filteredPokemonList.length > 0 ? (
          filteredPokemonList.map((pokemon, index) => (
            <div key={index} className="pokemon-card">
              <h2>{pokemon.name}</h2>
              <PokemonDetail url={pokemon.url} />
            </div>
          ))
        ) : (
          <div>Nenhum Pokémon encontrado</div>
        )}
      </div>
    </div>
  );
};

// eslint-disable-next-line react/prop-types
const PokemonDetail = ({ url }) => {
  const [details, setDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get(url);
        setDetails(response.data);
        setLoadingDetails(false);
      } catch (error) {
        console.error('Erro ao buscar detalhes do Pokémon:', error);
        setError('Falha ao carregar detalhes.');
        setLoadingDetails(false);
      }
    };

    fetchDetails();
  }, [url]);

  if (loadingDetails) return <div>Carregando detalhes...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="pokemon-details">
      <img src={details.sprites.front_default} alt={details.name} />
      <p>Tipo: {details.types.map(type => type.type.name).join(', ')}</p>
      <p>Altura: {details.height / 10} m</p>
      <p>Peso: {details.weight / 10} kg</p>
    </div>
  );
};

export default App;