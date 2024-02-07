import React, { useEffect, useState } from 'react';

const PokemonList = ({ pokemonData, searchQuery }) => {
    const [filteredPokemon, setFilteredPokemon] = useState([]);

  useEffect(() => {

                const getCachedData = () => {
                    const cachedData = localStorage.getItem('cachedPokemonData');
                    if (cachedData) {
                    const parsedData = JSON.parse(cachedData);
                    setFilteredPokemon(parsedData);
                    }
                };


                const setCachedData = (data) => {
                    localStorage.setItem('cachedPokemonData', JSON.stringify(data));
                };


                const fetchData = () => {
                    const filtered = pokemonData.filter((pokemon) =>
                        pokemon.name.toLowerCase().includes(searchQuery.toLowerCase()));

                setFilteredPokemon(filtered);
                setCachedData(filtered) };


                const cachedData = localStorage.getItem('cachedPokemonData');
                    if (cachedData) {
                            const parsedData = JSON.parse(cachedData);
                            const cacheTimestamp = parsedData?.timestamp || 0;
                            const currentTimestamp = new Date().getTime();
                            const timeDifference = currentTimestamp - cacheTimestamp;


                    if (timeDifference < 3600000) {
                            setFilteredPokemon(parsedData.data);
                    } 

                    else {
                            fetchData();
                     }} 

                    else {
                            fetchData();
                    }

}, [pokemonData, searchQuery]);

  return (
                <div className="container">
                <h1>Pokemon List</h1>
                    <div id="pokedex">
                            <div className="card-container">
                                {filteredPokemon.map(( pokemon ) => (
                                    <div className="card" key={pokemon.id} >
                                    <img className="card-image" src={pokemon.image} alt={pokemon.name} />
                                    <h2 className="card-title"> {pokemon.name} </h2>
                                    <p className="card-subtitle">{pokemon.type} </p>
                                </div>
                        ))}
                        </div>
                    </div>
                </div>
  );
};

export default PokemonList;