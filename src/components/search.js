import {
  STATE_CODES_ARRAY,
  STATE_CODES,
  STATE_NAMES,
  ESSENTIALS_CATEGORIES,
} from '../constants';
import {capitalize} from '../utils/commonfunctions';

import produce from 'immer';
import React, {useState, useCallback, useRef} from 'react';
import * as Icon from 'react-feather';
import {useTranslation} from 'react-i18next';
import {Link} from 'react-router-dom';
import {useTrail, animated, config} from 'react-spring';
import {useDebounce, useUpdateEffect} from 'react-use';

/* let focused = false;
const suggestions = [
  'Karnataka',
  'West Bengal',
  'Alappuzha',
  'Senior citizen support bangalore',
  'Community Kitchen in Kerala',
  'Groceries Chennai',
];*/

const essentialSuggestions = [
  'Testing Pune',
  'Delhi Shelter',
  'Community Kitchen in Kerala',
  'Groceries Chennai',
  'Senior citizen support bangalore',
];

const locationSuggestions = [
  'Mumbai',
  'Karnataka',
  'Chennai',
  'Alappuzha',
  'Ganjam',
];

function Search() {
  const [searchValue, setSearchValue] = useState('');
  const [expand, setExpand] = useState(false);
  const [results, setResults] = useState([]);
  const searchInput = useRef(null);
  const {t} = useTranslation();

  const [engine, setEngine] = useState(null);
  const [districtEngine, setDistrictEngine] = useState(null);
  const [essentialsEngine, setEssentialsEngine] = useState(null);

  useUpdateEffect(() => {
    import('corejs-typeahead').then((Bloodhound) => {
      setEngine(
        // eslint-disable-next-line
        new Bloodhound.default({
          initialize: true,
          local: STATE_CODES_ARRAY,
          queryTokenizer: Bloodhound.default.tokenizers.whitespace,
          datumTokenizer: Bloodhound.default.tokenizers.obj.whitespace('name'),
        })
      );

      setDistrictEngine(
        // eslint-disable-next-line
        new Bloodhound.default({
          initialize: true,
          limit: 5,
          queryTokenizer: Bloodhound.default.tokenizers.whitespace,
          datumTokenizer: Bloodhound.default.tokenizers.obj.whitespace(
            'district'
          ),
          indexRemote: true,
          remote: {
            url: 'https://api.covid19india.org/state_district_wise.json',
            transform: function (response) {
              const districts = [];
              Object.keys(response).map((stateName) => {
                const districtData = response[stateName].districtData;
                Object.keys(districtData).map((districtName) => {
                  return districts.push({
                    district: districtName,
                    state: stateName,
                  });
                });
                return null;
              });
              return districts;
            },
          },
        })
      );

      setEssentialsEngine(
        // eslint-disable-next-line
        new Bloodhound.default({
          initialize: true,
          limit: 5,
          queryTokenizer: Bloodhound.default.tokenizers.whitespace,
          datumTokenizer: Bloodhound.default.tokenizers.obj.whitespace(
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
        })
      );
    });
  }, [expand]);

  const handleSearch = useCallback(
    (searchInput) => {
      if (!engine) return null;
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
            route: STATE_CODES[result.state],
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
    },
    [districtEngine, engine, essentialsEngine]
  );

  useDebounce(
    () => {
      if (searchValue) {
        handleSearch(searchValue);
      } else {
        setResults(
          produce(results, (draftResults) => {
            draftResults.splice(0);
          })
        );
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

  /* function fillPlaceholder(target, index, cursorPosition, callback) {
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
  if (targetInput) loopThroughSuggestions(targetInput, 0);*/

  const [trail, set] = useTrail(3, () => ({
    transform: 'translate3d(0, 10px, 0)',
    opacity: 0,
    config: config.stiff,
  }));

  set({transform: 'translate3d(0, 0px, 0)', opacity: 1});

  return (
    <div className="Search">
      <animated.label style={trail[0]}>
        {t('Search your city, resources, etc')}
      </animated.label>
      <animated.div className="line" style={trail[1]}></animated.div>

      <animated.div className="search-input-wrapper" style={trail[2]}>
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
      </animated.div>

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
                          `, ${STATE_NAMES[result.route]}`}
                      </div>
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
                  href={result.website || null}
                  target="_noblank"
                  className="essential-result"
                >
                  <div className="result-top">
                    <div className="result-top-left">
                      <div className="result-name">{result.name}</div>
                      <div className="result-location">
                        {result.city && `${result.city}, `}
                        {result.state}
                      </div>
                    </div>
                    <div className="result-category">
                      <div>
                        {capitalize(ESSENTIALS_CATEGORIES[result.category])}
                      </div>
                      {result.website && <Icon.ExternalLink />}
                    </div>
                  </div>
                  <div className="result-description">{result.description}</div>
                  <div className="result-contacts">
                    {result.contact.split('\n').map((contact) => (
                      <div key={contact} className="result-contact">
                        <Icon.Phone />
                        <a href={`tel:${contact}`}>
                          {contact.replace(',', '')}
                        </a>
                      </div>
                    ))}
                  </div>
                </a>
              );
            }
          })}
        </div>
      )}

      {expand && (
        <React.Fragment>
          {/* <p
                className="feature"
                onMouseDown={(event) => {
                  event.preventDefault();
                  setNativeValue(searchInput.current, 'Cyclone Amphan');
                  searchInput.current.dispatchEvent(
                    new Event('input', {bubbles: true})
                  );
                }}
              >
                To those who are in states affected by Cyclone Amphan or have
                family/friends there, click here to view helplines for assistance.
              </p>*/}

          <div className="expanded">
            <div className="expanded-left">
              <h3>{t('Essentials')}</h3>
              <div className="suggestions">
                {essentialSuggestions.map((suggestion, index) => (
                  <div className="suggestion" key={index}>
                    <div>-</div>
                    <h4
                      onMouseDown={(event) => {
                        event.preventDefault();
                        setNativeValue(searchInput.current, suggestion);
                        searchInput.current.dispatchEvent(
                          new Event('input', {bubbles: true})
                        );
                      }}
                    >
                      {t(suggestion)}
                    </h4>
                  </div>
                ))}
              </div>
            </div>
            <div className="expanded-right">
              <h3>{t('Locations')}</h3>
              <div className="suggestions">
                {locationSuggestions.map((suggestion, index) => (
                  <div className="suggestion" key={index}>
                    <div>-</div>
                    <h4
                      onMouseDown={(event) => {
                        event.preventDefault();
                        setNativeValue(searchInput.current, suggestion);
                        searchInput.current.dispatchEvent(
                          new Event('input', {bubbles: true})
                        );
                      }}
                    >
                      {t(suggestion)}
                    </h4>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </React.Fragment>
      )}
    </div>
  );
}

const isEqual = () => {
  return true;
};

export default React.memo(Search, isEqual);
