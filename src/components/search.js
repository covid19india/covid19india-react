import React, {useState, useEffect} from 'react';
import * as Icon from 'react-feather';
import {Link} from 'react-router-dom';

function Search(props) {
  const [searchValue, setSearchValue] = useState('');
  const [expand, setExpand] = useState(false);
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (searchValue === 'Karnataka')
      setResults([
        {name: 'Karnataka', type: 'State'},
        {name: 'Karnataka', type: 'Resources'},
      ]);
    else setResults([]);
  }, [searchValue]);

  return (
    <div className="Search">
      <label>Search your city, resources, etc</label>
      <div className="line"></div>
      <input
        type="text"
        placeholder="Karnataka"
        value={searchValue}
        onFocus={() => {
          setExpand(true);
        }}
        onBlur={() => {
          setExpand(false);
        }}
        onChange={(event) => {
          setSearchValue(event.target.value);
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
              <Link key={index} to={`state/${result.name}`}>
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
