import {
  STATE_CODES_ARRAY,
  DISTRICTS_ARRAY,
  STATE_CODES_REVERSE,
} from '../constants';

import Bloodhound from 'corejs-typeahead';
import React, {useState, useCallback, useRef} from 'react';
import * as Icon from 'react-feather';
import {Link} from 'react-router-dom';

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
  const searchInput = useRef(null);

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
      setResults([...results]);
    };

    const essentialsAsync = (datums) => {
      // to handle async remote call on initial launch
      essentialsEngine.search(searchInput, essentialsSync);
    };

    engine.search(searchInput, sync);
    districtEngine.search(searchInput, districtSync);
    essentialsEngine.search(searchInput, essentialsSync, essentialsAsync);
  }, []);

  function setNativeValue(element, value) {
    const valueSetter = Object.getOwnPropertyDescriptor(element, 'value').set;
    const prototype = Object.getPrototypeOf(element);
    const prototypeValueSetter = Object.getOwnPropertyDescriptor(
      prototype,
      'value'
    ).set;

    if (valueSetter && valueSetter !== prototypeValueSetter) {
      prototypeValueSetter.call(element, value);
    } else {
      valueSetter.call(element, value);
    }
  }

  return (
    <div className="Search">
      <label>Search your city, resources, etc</label>
      <div className="line"></div>

      <input
        type="text"
        value={searchValue}
        ref={searchInput}
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
                      <div>
                        {result.category.match('Delivery')
                          ? 'Home Delivery'
                          : result.category}
                      </div>
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
            <h3>Essentials</h3>
            <div className="suggestions">
              <div className="suggestion">
                <div>-</div>
                <h4
                  onMouseDown={(event) => {
                    event.preventDefault();
                    setNativeValue(searchInput.current, 'Testing Pune');
                    searchInput.current.dispatchEvent(
                      new Event('input', {bubbles: true})
                    );
                  }}
                >
                  Testing Pune
                </h4>
              </div>
              <div className="suggestion">
                <div>-</div>
                <h4
                  onMouseDown={(event) => {
                    event.preventDefault();
                    setNativeValue(searchInput.current, 'Delhi Shelter');
                    searchInput.current.dispatchEvent(
                      new Event('input', {bubbles: true})
                    );
                  }}
                >
                  Delhi Shelter
                </h4>
              </div>
              <div className="suggestion">
                <div>-</div>
                <h4
                  onMouseDown={(event) => {
                    event.preventDefault();
                    setNativeValue(
                      searchInput.current,
                      'Community Kitchen in Kerala'
                    );
                    searchInput.current.dispatchEvent(
                      new Event('input', {bubbles: true})
                    );
                  }}
                >
                  Community Kitchen in Kerala
                </h4>
              </div>
              <div className="suggestion">
                <div>-</div>
                <h4
                  onMouseDown={(event) => {
                    event.preventDefault();
                    setNativeValue(searchInput.current, 'Groceries Chennai');
                    searchInput.current.dispatchEvent(
                      new Event('input', {bubbles: true})
                    );
                  }}
                >
                  Groceries Chennai
                </h4>
              </div>
              <div className="suggestion">
                <div>-</div>
                <h4
                  onMouseDown={(event) => {
                    event.preventDefault();
                    setNativeValue(
                      searchInput.current,
                      'Senior citizen support bangalore'
                    );
                    searchInput.current.dispatchEvent(
                      new Event('input', {bubbles: true})
                    );
                  }}
                >
                  Senior citizen support bangalore
                </h4>
              </div>
            </div>
          </div>
          <div className="expanded-right">
            <h3>Locations</h3>
            <div className="suggestions">
              <div className="suggestion">
                <div>-</div>
                <h4
                  onMouseDown={(event) => {
                    event.preventDefault();
                    setNativeValue(searchInput.current, 'Hyderabad');
                    searchInput.current.dispatchEvent(
                      new Event('input', {bubbles: true})
                    );
                  }}
                >
                  Hyderabad
                </h4>
              </div>
              <div className="suggestion">
                <div>-</div>
                <h4
                  onMouseDown={(event) => {
                    event.preventDefault();
                    setNativeValue(searchInput.current, 'Karnataka');
                    searchInput.current.dispatchEvent(
                      new Event('input', {bubbles: true})
                    );
                  }}
                >
                  Karnataka
                </h4>
              </div>
              <div className="suggestion">
                <div>-</div>
                <h4
                  onMouseDown={(event) => {
                    event.preventDefault();
                    setNativeValue(searchInput.current, 'Chennai');
                    searchInput.current.dispatchEvent(
                      new Event('input', {bubbles: true})
                    );
                  }}
                >
                  Chennai
                </h4>
              </div>
              <div className="suggestion">
                <div>-</div>
                <h4
                  onMouseDown={(event) => {
                    event.preventDefault();
                    setNativeValue(searchInput.current, 'Jharkhand');
                    searchInput.current.dispatchEvent(
                      new Event('input', {bubbles: true})
                    );
                  }}
                >
                  Jharkhand
                </h4>
              </div>
              <div className="suggestion">
                <div>-</div>
                <h4
                  onMouseDown={(event) => {
                    event.preventDefault();
                    setNativeValue(searchInput.current, 'Alappuzha');
                    searchInput.current.dispatchEvent(
                      new Event('input', {bubbles: true})
                    );
                  }}
                >
                  Alappuzha
                </h4>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default React.memo(Search);
