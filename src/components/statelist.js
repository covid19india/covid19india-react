// Temp data
import GeoData from './essentials.json';

import L from 'leaflet';
import * as Knn from 'leaflet-knn';
import React from 'react';
import 'leaflet/dist/leaflet.css';
import {ExternalLink, Phone} from 'react-feather';

function medFilter(feature) {
  return feature.properties.priority;
}
function othersFilter(feature) {
  return !feature.properties.priority;
}

export default function MapChart(props) {
  let medKnn;
  let restKnn;

  const hK = 5; // K nearest hospitals/labs wrt user location
  const rK = 10; // K nearest essentials wrt user location
  const rad = 100 * 1000; // Max distance of the K points, in meters

  if (props.userLocation) {
    medKnn = new Knn(L.geoJSON(GeoData, {filter: medFilter})).nearestLayer(
      [props.userLocation[1], props.userLocation[0]],
      hK
    );
    restKnn = new Knn(L.geoJSON(GeoData, {filter: othersFilter})).nearestLayer(
      [props.userLocation[1], props.userLocation[0]],
      rK,
      rad
    );
  }

  const gjKnn = {
    name: 'NearestK-Essentials',
    type: 'FeatureCollection',
    features: [],
  };

  if (medKnn) {
    for (let i = 0; i < medKnn.length; i++) {
      gjKnn.features.push({
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
          icon: './icons/' + medKnn[i].layer.feature.properties.icon + '.svg',
          id: i + 1,
        },
      });
    }
  }

  if (restKnn) {
    for (let j = 0; j < restKnn.length; j++) {
      gjKnn.features.push({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: restKnn[j].layer.feature.geometry.coordinates,
        },
        properties: {
          name: restKnn[j].layer.feature.properties.name,
          desc: restKnn[i].layer.feature.properties.desc,
          addr: restKnn[i].layer.feature.properties.addr,
          phone: restKnn[i].layer.feature.properties.phone,
          contact: restKnn[i].layer.feature.properties.contact,
          icon: './icons/' + restKnn[i].layer.feature.properties.icon + '.svg',
          id: j + 100,
        },
      });
    }
  }

  return (
    <div className="results">
      {gjKnn.features.map((d) => (
        <a
          key={d.properties.id}
          href={d.properties.contact}
          target="_noblank"
          className="essential-result"
        >
          <div className="result-top">
            <div className="result-top-left">
              <div className="result-name">{d.properties.name}</div>
              <div className="result-location">{d.properties.addr}</div>
            </div>
            <div className="result-category">
              <img src={d.properties.icon} alt="icon" />
              <ExternalLink />
            </div>
          </div>
          <div className="result-description">{d.properties.desc}</div>
          <div className="result-contact">
            <Phone />
            <div>{d.properties.phone}</div>
          </div>
        </a>
      ))}

      <a
        key={1000}
        href="https://www.covid19india.org/essentials"
        target="_noblank"
        className="essential-result"
      >
        <div className="result-top">
          <div className="result-top-left">
            <div className="result-name">View all essentials</div>
          </div>
          <div className="result-category">
            <ExternalLink />
          </div>
        </div>
      </a>
    </div>
  );
}
