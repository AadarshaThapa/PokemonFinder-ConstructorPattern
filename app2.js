angular.module('pokemonApp', [])

    .controller('AppController', function (PokemonService) {
        var vm = this;

        vm.pokemonData = [];
        vm.searchQuery = '';

        vm.fetchPokemon = function () {
            PokemonService.fetchAllPokemon().then(function (pokemon) {
                vm.pokemonData = pokemon.filter(vm.filterPokemon);
            });
        };
        vm.fetchPokemon();


        vm.filterPokemon = function (pokemon) {
            return pokemon.name.toLowerCase().includes(vm.searchQuery.toLowerCase());
        };

    })

    .directive('search', function () {
        return {
            restrict: 'E',
            templateUrl: 'views/search.html',
            controller: 'AppController',
            controllerAs: 'appCtrl',
            bindToController: true
        };
    })
    .directive('pokemonList', function () {
        return {
            restrict: 'E',
            templateUrl: 'views/pokemon.html',
            controller: 'AppController',
            controllerAs: 'appCtrl',
            bindToController: true

        };
    })
    .factory('PokemonService', function ($http, $q) {
        var localStorageKey = 'pokemonData';
        var apiBaseUrl = 'https://pokeapi.co/api/v2/pokemon/';

        function fetchPokemonFromApi() {
            var promises = [];
            for (var i = 1; i <= 1000; i++) {
                var url = apiBaseUrl + i;
                promises.push($http.get(url));
            }

            return $q.all(promises)
                .then(function (responses) {
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
