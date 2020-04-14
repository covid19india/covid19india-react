import React, {useState, useCallback} from 'react';
import * as Icon from 'react-feather';
import {Link} from 'react-router-dom';
import {STATE_CODES_ARRAY} from '../constants';
import Bloodhound from 'corejs-typeahead';

const engine = new Bloodhound({
  initialize: false,
  local: STATE_CODES_ARRAY,
  queryTokenizer: Bloodhound.tokenizers.whitespace,
  datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
});

const promise = engine.initialize();

promise
  .done(function () {
    console.log('Initialized Search!');
  })
  .fail(function () {
    console.log("Search didn't initialize!");
  });

function Search(props) {
  const [searchValue, setSearchValue] = useState('');
  const [expand, setExpand] = useState(false);
  const [results, setResults] = useState([]);

  const handleSearch = useCallback((searchInput) => {
    const results = [];
    const sync = (datums) => {
      datums.map((result, index) => {
        const stateObj = {
          name: result.name,
          type: 'state',
          route: result.code,
        };
        results.push(stateObj);
        return null;
      });
      setResults(results);
    };

    const async = (datums) => {
      console.log('datums from `remote`');
      console.log(datums);
    };

    engine.search(searchInput, sync, async);
  }, []);

  return (
    <div className="Search">
      <label>Search your city, resources, etc</label>
      <div className="line"></div>
      <input
        type="text"
        value={searchValue}
        style={{
          width: expand ? 'calc(100% - 3.5rem)' : '',
          height: expand ? '2.1rem' : '',
        }}
        onFocus={(event) => {
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
      <div className={`search-button ${expand ? 'is-expand' : ''}`}>
        <Icon.Search />
      </div>
      {results.length > 0 && (
        <div
          className={`close-button ${expand ? 'is-expand' : ''}`}
          onClick={() => {
            setSearchValue('');
            setResults([]);
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
