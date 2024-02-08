var PokemonApp = angular.module("pokemonApp", []);

PokemonApp.component('pokemonList', {
    templateUrl: 'views/pokemon.html',
    controller: function (PokemonService, PokemonSearchService) {
        var vm = this;
        vm.pokemonData = [];

        vm.$onInit = function () {
            vm.fetchPokemon();
        };

        vm.fetchPokemon = function () {
            PokemonService.fetchAllPokemon().then(function (pokemon) {
                vm.pokemonData = pokemon;
            });
        };

        vm.filterPokemon = function (pokemon) {
            var searchQuery = PokemonSearchService.getSearchQuery();
            return pokemon.name.toLowerCase().includes(searchQuery.toLowerCase());
        };
    },
    controllerAs: 'appCtrl'
});

PokemonApp.component('search', {
    templateUrl: 'views/search.html',
    controller: function (PokemonSearchService) {
        var vm = this;
        vm.searchQuery = '';

        vm.updateSearch = function () {
            PokemonSearchService.setSearchQuery(vm.searchQuery);
        };
    },
    controllerAs: 'searchCtrl'
});

PokemonApp.factory('PokemonService', function ($http, $q) {
    var localStorageKey = 'pokemonData';
    var apiBaseUrl = 'https://pokeapi.co/api/v2/pokemon/';

    function fetchPokemonFromApi() {
        var promises = [];
        for (var i = 1; i <= 300; i++) {
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

PokemonApp.factory('PokemonSearchService', function () {
    var searchQuery = '';

    return {
        setSearchQuery: function (query) {
            searchQuery = query;
        },
        getSearchQuery: function () {
            return searchQuery;
        }
    };
});
