import React from 'react';

    const Search = ({ onSearchChange }) => {

        const handleSearch = (e) => {
            onSearchChange(e.target.value);
        };

        const handleSubmit = (e) => {
            e.preventDefault();
        };


        return (
            <form onSubmit={handleSubmit} className='search'>

                <input
                    type="text"
                    id="searchbar"
                    placeholder="Enter a name"
                    onChange={handleSearch}
                />

                <button type="submit">Search</button>
                
            </form>
        );
    };

export default Search;
