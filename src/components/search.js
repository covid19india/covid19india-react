import {
  STATE_CODES_ARRAY,
  STATE_CODES_REVERSE,
  STATE_CODES,
} from '../constants';

import classnames from 'classnames';
import Bloodhound from 'corejs-typeahead';
import React, {useState, useCallback, useRef} from 'react';
import * as Icon from 'react-feather';
import {useTranslation} from 'react-i18next';
import {Link} from 'react-router-dom';
import {useDebounce} from 'react-use';

const engine = new Bloodhound({
  initialize: true,
  local: STATE_CODES_ARRAY,
  queryTokenizer: Bloodhound.tokenizers.whitespace,
  datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
});

const districtEngine = new Bloodhound({
  initialize: true,
  limit: 5,
  queryTokenizer: Bloodhound.tokenizers.whitespace,
  datumTokenizer: Bloodhound.tokenizers.obj.whitespace('district'),
  indexRemote: true,
  remote: {
    url: 'https://api.covid19india.org/state_district_wise.json',
    transform: function (response) {
      const districts = [];
      Object.keys(response).map((stateName) => {
        const districtData = response[stateName].districtData;
        Object.keys(districtData).map((districtName) => {
          return districts.push({district: districtName, state: stateName});
        });
        return null;
      });
      return districts;
    },
  },
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

let focused = false;
const suggestions = [
  'Karnataka',
  'West Bengal',
  'Alappuzha',
  'Senior citizen support bangalore',
  'Community Kitchen in Kerala',
  'Groceries Chennai',
];

function Search({districtZones}) {
  const [searchValue, setSearchValue] = useState('');
  const [expand, setExpand] = useState(false);
  const [results, setResults] = useState([]);
  const searchInput = useRef(null);
  const {t} = useTranslation();

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
      datums.slice(0, 3).map((result, index) => {
        const districtObj = {
          name: result.district,
          type: 'district',
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

    engine.search(searchInput, sync);
    districtEngine.search(searchInput, districtSync);
    essentialsEngine.search(searchInput, essentialsSync);
  }, []);

  useDebounce(
    () => {
      if (searchValue) {
        handleSearch(searchValue);
      } else {
        setResults([]);
      }
    },
    100,
    [searchValue]
  );

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

  function fillPlaceholder(target, index, cursorPosition, callback) {
    if (focused) {
      target.textContent = '';
      return true;
    }
    const text = t(suggestions[index]);
    const placeholder = target.textContent;
    target.classList.remove('disappear');
    target.textContent = placeholder + text[cursorPosition];
    if (cursorPosition < text.length - 1) {
      setTimeout(function () {
        fillPlaceholder(target, index, cursorPosition + 1, callback);
      }, 200);
      return true;
    }
    callback();
  }

  function clearPlaceholder(target, callback) {
    const placeholder = target.textContent;
    target.classList.add('disappear');
    if (placeholder.length > 0) {
      setTimeout(function () {
        target.textContent = '';
        clearPlaceholder(target, callback);
      }, 1000);
      return true;
    }
    callback();
  }

  function loopThroughSuggestions(target, index) {
    if (focused) {
      target.textContent = '';
      return true;
    }
    fillPlaceholder(target, index, 0, function () {
      setTimeout(function () {
        clearPlaceholder(target, function () {
          loopThroughSuggestions(target, (index + 1) % suggestions.length);
        });
      }, 2000);
    });
  }

  const targetInput = document.getElementById('search-placeholder');
  if (targetInput) loopThroughSuggestions(targetInput, 0);

  return (
    <div className="Search">
      <label>{t('Search your city, resources, etc')}</label>
      <div className="line"></div>

      <input
        type="text"
        value={searchValue}
        ref={searchInput}
        onFocus={(event) => {
          focused = true;
          setExpand(true);
        }}
        onBlur={() => {
          setExpand(false);
        }}
        onChange={(event) => {
          setSearchValue(event.target.value);
        }}
      />
      <span id="search-placeholder" className="search-placeholder"></span>

      <div className={`search-button`}>
        <Icon.Search />
      </div>

      {searchValue.length > 0 && (
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
            if (result.type === 'state' || result.type === 'district') {
              return (
                <Link key={index} to={`state/${result.route}`}>
                  <div className="result">
                    <div className="result-left">
                      <div className="result-name">
                        {`${result.name}`}
                        {result.type === 'district' &&
                          `, ${STATE_CODES[result.route]}`}
                      </div>
                      <div
                        className={classnames('result-zone', {
                          [`is-${districtZones[STATE_CODES[result.route]][
                            result.name
                          ]?.zone.toLowerCase()}`]: true,
                        })}
                      ></div>
                    </div>
                    <div className="result-type">
                      <span>{[result.route]}</span>
                      <Icon.ArrowRightCircle size={14} />
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
            <h3>{t('Essentials')}</h3>
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
                  {t('Testing Pune')}
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
                  {t('Delhi Shelter')}
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
                  {t('Community Kitchen in Kerala')}
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
                  {t('Groceries Chennai')}
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
                  {t('Senior citizen support bangalore')}
                </h4>
              </div>
            </div>
          </div>
          <div className="expanded-right">
            <h3>{t('Locations')}</h3>
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
                  {t('Hyderabad')}
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
                  {t('Karnataka')}
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
                  {t('Chennai')}
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
                  {t('Jharkhand')}
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
                  {t('Alappuzha')}
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
