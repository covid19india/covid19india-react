import axios from 'axios';
import classnames from 'classnames';
import produce from 'immer';
import {layer} from 'leaflet';
import * as Knn from 'leaflet-knn';
import React, {useState, useEffect, useCallback} from 'react';
import {ExternalLink, Phone} from 'react-feather';
import {useEffectOnce} from 'react-use';

function medFilter(feature) {
  return feature.properties.priority;
}

function othersFilter(feature) {
  return !feature.properties.priority;
}

function getDistance(p1, p2) {
  // p1 and p2 => [lat1, long1], [lat2, long2]
  const phi1 = (p1[0] * Math.PI) / 180;
  const phi2 = (p2[0] * Math.PI) / 180;
  const dLambda = ((p2[1] - p1[1]) * Math.PI) / 180;
  const R = 6371e3;
  const d =
    Math.acos(
      Math.sin(phi1) * Math.sin(phi2) +
        Math.cos(phi1) * Math.cos(phi2) * Math.cos(dLambda)
    ) * R;
  return Number((d / 1000).toFixed(2));
}

function KnnResults({userLocation, userState}) {
  const [geoData, setGeoData] = useState([]);
  const [results, setResults] = useState();
  const [categories, setCategories] = useState([]);

  useEffectOnce(() => {
    getJSON();
  }, []);

  const getJSON = useCallback(() => {
    axios
      .get('https://api.covid19india.org/resources/geoResources.json')
      .then((response) => {
        setGeoData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    let medKnn;
    let restKnn;
    let panKnn;

    const hK = 5; // K nearest hospitals/labs wrt user location
    const rK = 100; // K nearest essentials wrt user location
    const rad = 10 * 1000; // Max distance of the K points, in meters ; aim to be  ~(avg city radius)

    if (userLocation) {
      medKnn = new Knn(
        layer.geoJSON(geoData, {filter: medFilter})
      ).nearestLayer([userLocation[1], userLocation[0]], hK);
      restKnn = new Knn(
        layer.geoJSON(geoData, {filter: othersFilter})
      ).nearestLayer([userLocation[1], userLocation[0]], rK, rad);
      panKnn = geoData?.features?.filter(
        (feat) =>
          feat.properties.state === 'PAN India' ||
          (feat.properties.state.includes('PAN') &&
            feat.properties.state.includes(userState))
      );
    }

    const result = {
      name: 'NearestK-Essentials',
      type: 'FeatureCollection',
      features: [],
    };

    if (medKnn) {
      let i = 0;
      for (i = 0; i < medKnn.length; i++) {
        result.features.push({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: medKnn[i].layer.feature.geometry.coordinates,
          },
          properties: {
            name: medKnn[i].layer.feature.properties.name,
            desc: medKnn[i].layer.feature.properties.desc,
            addr: medKnn[i].layer.feature.properties.addr,
            phone: medKnn[i].layer.feature.properties.phone,
            contact: medKnn[i].layer.feature.properties.contact,
            icon: medKnn[i].layer.feature.properties.icon,
            recordid: medKnn[i].layer.feature.properties.recordid,
            dist: getDistance(
              userLocation,
              medKnn[i].layer.feature.geometry.coordinates.reverse()
            ),
          },
        });
      }
    }

    if (restKnn) {
      let j = 0;
      for (j = 0; j < restKnn.length; j++) {
        result.features.push({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: restKnn[j].layer.feature.geometry.coordinates,
          },
          properties: {
            name: restKnn[j].layer.feature.properties.name,
            desc: restKnn[j].layer.feature.properties.desc,
            addr: restKnn[j].layer.feature.properties.addr,
            phone: restKnn[j].layer.feature.properties.phone,
            contact: restKnn[j].layer.feature.properties.contact,
            icon: restKnn[j].layer.feature.properties.icon,
            recordid: restKnn[j].layer.feature.properties.recordid,
            dist: getDistance(
              userLocation,
              restKnn[j].layer.feature.geometry.coordinates.reverse()
            ),
          },
        });
      }
    }

    if (panKnn) {
      let k = 0;
      for (k = 0; k < panKnn.length; k++) {
        result.features.push(panKnn[k]);
      }
    }

    setResults(result);
  }, [geoData, userLocation, userState]);

  const toggleFilter = (categoryName, newIsSelected) => {
    setCategories(
      produce((draft) => {
        draft[categoryName].isSelected = newIsSelected;
      })
    );
  };

  useEffect(() => {
    const categories = {};
    if (results) {
      results.features
        .map(function (feature) {
          return feature?.properties?.icon;
        })
        .reduce((acc, e) => acc.set(e, (acc.get(e) || 0) + 1), new Map())
        .forEach((value, key, map) => {
          const categoryMeta = {count: value, isSelected: true};
          categories[key] = categoryMeta;
        });
    }
    setCategories(categories);
  }, [results]);

  if (results)
    return (
      <div className="results fadeInUp" style={{animationDelay: '0.5s'}}>
        <div className="labels">
          {Object.keys(categories).map((categoryName) => (
            <div
              key={categoryName}
              className={classnames('label', {
                'is-selected': categories[categoryName].isSelected,
              })}
              onClick={() =>
                toggleFilter(categoryName, !categories[categoryName].isSelected)
              }
            >
              {categoryName}
              <div className="count">{categories[categoryName].count}</div>
            </div>
          ))}
        </div>

        {results?.features
          .filter((feature) => {
            return (
              Object.keys(categories)
                .filter(
                  (categoryName) => categories[categoryName].isSelected === true
                )
                .includes(feature.properties.icon) && feature.properties.dist
            );
          })
          .map((result, i) => (
            <div
              key={result.properties.recordid ? result.properties.recordid : i}
              className="essential-result"
            >
              <div className="result-top">
                <div className="result-top-left">
                  <div className="result-name">{result.properties.name}</div>
                  <div className="result-location">
                    {result.properties.addr}
                  </div>
                  {result.properties.dist && (
                    <div className="result-distance">
                      {result.properties.dist + ' km away'}
                    </div>
                  )}
                </div>
                <a
                  className="result-category"
                  href={result.properties.contact}
                  target="_noblank"
                >
                  <span>{result.properties.icon}</span>
                  <ExternalLink />
                </a>
              </div>
              <div className="result-description">{result.properties.desc}</div>
              <div className="result-contacts">
                {result.properties.phone.split('\n').map((contact) => (
                  <div key={contact} className="result-contact">
                    <Phone />
                    <a href={`tel:${contact}`}>{contact.replace(',', '')}</a>
                  </div>
                ))}
              </div>
            </div>
          ))}

        <div>
          <h3 className="pan-divider">{`Throughout ${userState} and India`}</h3>
        </div>

        {results?.features
          .filter((feature) => {
            return (
              Object.keys(categories)
                .filter(
                  (categoryName) => categories[categoryName].isSelected === true
                )
                .includes(feature.properties.icon) && !feature.properties.dist
            );
          })
          .map((result, i) => (
            <div
              key={result.properties.recordid ? result.properties.recordid : i}
              className="essential-result"
            >
              <div className="result-top">
                <div className="result-top-left">
                  <div className="result-name">{result.properties.name}</div>
                  <div className="result-location">
                    {result.properties.addr}
                  </div>
                  {result.properties.dist && (
                    <div className="result-distance">
                      {result.properties.dist + ' km away'}
                    </div>
                  )}
                </div>
                <a
                  className="result-category"
                  href={result.properties.contact}
                  target="_noblank"
                >
                  <span>{result.properties.icon}</span>
                  <ExternalLink />
                </a>
              </div>
              <div className="result-description">{result.properties.desc}</div>
              <div className="result-contacts">
                {result.properties.phone.split('\n').map((contact) => (
                  <div key={contact} className="result-contact">
                    <Phone />
                    <a href={`tel:${contact}`}>{contact.replace(',', '')}</a>
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>
    );
  else return null;
}

export default KnnResults;
