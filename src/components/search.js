import React, {useState, useEffect, useCallback} from 'react';
import * as Icon from 'react-feather';
import {Link} from 'react-router-dom';
import {STATE_CODES} from '../constants';

function Search(props) {
  const [searchValue, setSearchValue] = useState('');
  const [expand, setExpand] = useState(false);
  const [results, setResults] = useState([]);

  useEffect(() => {});

  const handleSearch = useCallback((searchInput) => {
    if (searchInput === '') {
      setResults([]);
      return;
    }
    const result = [];
    for (const [key, value] of Object.entries(STATE_CODES)) {
      if (searchInput === value.toLowerCase()) {
        const stateResult = {name: value, type: 'State', route: key};
        result.push(stateResult);
        setResults(result);
      }
    }
  }, []);

  return (
    <div className="Search">
      <label>Search your city, resources, etc</label>
      <div className="line"></div>
      <input
        type="text"
        value={searchValue}
        onFocus={() => {
          setExpand(true);
        }}
        onBlur={() => {
          setExpand(false);
        }}
        onChange={(event) => {
          setSearchValue(event.target.value);
          handleSearch(event.target.value.toLowerCase());
        }}
      />
      <div className="search-button">
        <Icon.Search />
      </div>
      {searchValue.length > 0 && (
        <div
          className="close-button"
          onClick={() => {
            setSearchValue('');
          }}
        >
          <Icon.X />
        </div>
      )}
      {results.length > 0 && (
        <div className="results">
          {results.map((result, index) => {
            return (
              <Link key={index} to={`state/${result.route}`}>
                <div className="result">
                  <div className="result-name">{result.name}</div>
                  <div className="result-type">
                    Visit {result?.type?.toLowerCase()} page
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
      {expand && (
        <div className="expanded">
          <div className="expanded-left">
            <h3>Top Resources</h3>
            <h4> - DIY Face Masks</h4>
            <h4> - MOFHW Tips</h4>
            <h4> - Test Centers in Mumbai</h4>
            <h4> - Symptoms</h4>
            <h4> - Dave</h4>
          </div>
          <div className="expanded-right">
            <h3>Highly Searched</h3>
            <h4> - Hyderabad</h4>
            <h4> - Bengaluru</h4>
            <h4> - Test Centers</h4>
            <h4> - Lockdown</h4>
            <h4> - Also Dave</h4>
          </div>
        </div>
      )}
    </div>
  );
}

export default Search;
