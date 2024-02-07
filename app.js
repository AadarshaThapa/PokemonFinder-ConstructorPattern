angular.module('pokemonApp', [])


    .controller('AppController', function ($scope, PokemonService) {
        $scope.pokemonData = [];
        $scope.searchQuery = '';

        $scope.fetchPokemon = function () {
            PokemonService.fetchAllPokemon().then(function (pokemon) {
                $scope.pokemonData = pokemon;
            });
        };
        $scope.fetchPokemon();
        $scope.handleSearchChange = function () {
            $scope.searchQuery = $scope.query;
        };

      

        $scope.filterPokemon = function (pokemon) {
            return pokemon.name.toLowerCase().includes($scope.searchQuery.toLowerCase());
        };
    })

   

    .directive('pokemonList', function () {
        return {
            restrict: 'E',
            templateUrl: 'pokemon.html',
            scope: {
                pokemonData: '=',
                searchQuery: '='
            }
        };
    })
    .factory('PokemonService', function ($http, $q) {
        var localStorageKey = 'pokemonData';
        var apiBaseUrl = 'https://pokeapi.co/api/v2/pokemon/';

        function fetchPokemonFromApi() {
            var promises = [];
            for (var i = 1; i <= 250; i++) {
                var url = apiBaseUrl + i;
                //var url = `https://pokeapi.co/api/v2/pokemon/${i}`;
                promises.push($http.get(url));
            }
    
            return $q.all(promises).then(function (responses) {
                var pokemon = responses.map(function (response) {
                    var data = response.data;
                    return {
                        name: data.name,
                        image: data.sprites['front_default'],
                        type: data.types.map(function (type) {
                            return type.type.name;
                        }).join(', '),
                        id: data.id
                    };
                });
                return pokemon;
            });
        }
    
        function fetchPokemonFromLocalStorage() {
            var cachedData = localStorage.getItem(localStorageKey);
            if (cachedData) {
                var parsedData = JSON.parse(cachedData);
                return $q.resolve(parsedData);
            } else {
                return $q.reject("No cached data");
            }
        }
    
        function storePokemonInLocalStorage(data) {
            localStorage.setItem(localStorageKey, JSON.stringify(data));
        }
    
        function clearLocalStorage() {
            localStorage.removeItem(localStorageKey);
        }
    
        return {
            fetchAllPokemon: function () {
                return fetchPokemonFromLocalStorage()
                    .catch(function () {
                        return fetchPokemonFromApi().then(function (pokemon) {
                            storePokemonInLocalStorage(pokemon);
                            return pokemon;
                        });
                    });
            },
            clearCache: function () {
                clearLocalStorage();
            }
        };
    });
    

     // .directive('search', function () {
    //     return {
    //         restrict: 'E',
    //         templateUrl: 'search.html',
    //         scope: {
    //             onSearchChange: '&',
    //             // searchQuery: '=',
    //             // pokemonData: '=',
    //         }
    //     };
    // })
