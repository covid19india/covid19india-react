import React, {useState, useCallback} from 'react';
import * as Icon from 'react-feather';
import {Link} from 'react-router-dom';
import {
  STATE_CODES_ARRAY,
  DISTRICTS_ARRAY,
  STATE_CODES_REVERSE,
} from '../constants';
import Bloodhound from 'corejs-typeahead';

const engine = new Bloodhound({
  initialize: true,
  local: STATE_CODES_ARRAY,
  queryTokenizer: Bloodhound.tokenizers.whitespace,
  datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
});

const districtEngine = new Bloodhound({
  initialize: true,
  local: DISTRICTS_ARRAY,
  limit: 5,
  queryTokenizer: Bloodhound.tokenizers.whitespace,
  datumTokenizer: Bloodhound.tokenizers.obj.whitespace('district'),
});

const essentialsEngine = new Bloodhound({
  initialize: true,
  limit: 5,
  queryTokenizer: Bloodhound.tokenizers.whitespace,
  datumTokenizer: Bloodhound.tokenizers.obj.whitespace(
    'category',
    'city',
    'contact',
    'descriptionandorserviceprovided',
    'nameoftheorganisation',
    'state'
  ),
  indexRemote: true,
  remote: {
    url: 'https://api.covid19india.org/resources/resources.json',
    transform: function (response) {
      return response.resources;
    },
  },
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
    };

    const districtSync = (datums) => {
      datums.slice(0, 5).map((result, index) => {
        const districtObj = {
          name: result.district + ', ' + result.state,
          type: 'state',
          route: STATE_CODES_REVERSE[result.state],
        };
        results.push(districtObj);
        return null;
      });
    };

    const essentialsSync = (datums) => {
      datums.slice(0, 5).map((result, index) => {
        const essentialsObj = {
          name: result.nameoftheorganisation,
          type: 'essentials',
          category: result.category,
          website: result.contact,
          description: result.descriptionandorserviceprovided,
          city: result.city,
          state: result.state,
          contact: result.phonenumber,
        };
        results.push(essentialsObj);
        return null;
      });
    };

    engine.search(searchInput, sync);
    districtEngine.search(searchInput, districtSync);
    essentialsEngine.search(searchInput, essentialsSync);
    setResults(results);
  }, []);

  return (
    <div className="Search">
      <label>Search your city, resources, etc</label>
      <div className="line"></div>
      <input
        type="text"
        value={searchValue}
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
      <div className={`search-button`}>
        <Icon.Search />
      </div>
      {results.length > 0 && (
        <div
          className={`close-button`}
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
            if (result.type === 'state') {
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
            } else {
              return (
                <a
                  key={index}
                  href={result.website}
                  target="_noblank"
                  className="essential-result"
                >
                  <div className="result-top">
                    <div className="result-top-left">
                      <div className="result-name">{result.name}</div>
                      <div className="result-location">
                        {result.city}, {result.state}
                      </div>
                    </div>
                    <div className="result-category">
                      <div>{result.category}</div>
                      <Icon.ExternalLink />
                    </div>
                  </div>
                  <div className="result-description">{result.description}</div>
                  <div className="result-contact">
                    <Icon.Phone />
                    <div>{result.contact}</div>
                  </div>
                </a>
              );
            }
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
