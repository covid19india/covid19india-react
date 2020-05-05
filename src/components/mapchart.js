import testData from './_pantest.json'
import axios from 'axios';
import * as Knn from "leaflet-knn";
import React, {useState, useEffect} from 'react';
import { Map, Marker, Popup, TileLayer, LayerGroup} from "react-leaflet";
// import {Sidebar, Tab}  from 'react-leaflet-sidebarv2';
// import 'leaflet-sidebar-v2/css/leaflet-sidebar.css'; // TODO:Import just the .min.css instead of the whole package :|
import L from 'leaflet';
import MarkerClusterGroup from "react-leaflet-markercluster";
import Search from './geosearch';
import 'leaflet/dist/leaflet.css';
import {ExternalLink} from 'react-feather';

const user = new L.Icon({
  iconUrl: require('../icons/user.svg'),
  iconRetinaUrl: require('../icons/user.svg'),
  iconSize: [40, 40]
});

const createClusterCustomIcon = function (cluster) {
  return L.divIcon({
    html: cluster.getChildCount(),
    className: 'marker-cluster-custom',
    iconSize: L.point(30, 30, true),
  });
};

function medFilter(feature) {
  return (feature.properties.priority);
}
function othersFilter(feature) {
  return (!feature.properties.priority);
}

function panFilter(feature){
  const builder = [feature.properties.city,feature.properties.state].join(" ");
  return (builder.includes("PAN") || builder.includes("Pan"));
}

export default function MapChart(props) {
  const [geoData, setGeoData] = useState([]);
  const [panData, setPanData] = useState([]);


  useEffect(() => {
    getJSON();
    setPanData(testData);
  }, []);

  // Get processed data from forked repo until its pushed to API
  const getJSON = () => {
    axios
      .get('https://raw.githubusercontent.com/aswaathb/covid19india-react/80922c70bb451cda94cce1e809e54fa72754f05c/newResources/geoResources.json')
      .then((response) => {
        setGeoData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const center = props.pLocation || props.currentLocation || [21.3041, 77.1025];
  const zoom = props.radius ? (props.radius > 6 ? 11 : 12) : 5;
  let medKnn;
  let restKnn;
  let panKnn
  let icon;
  const userLocation = props.pLocation || props.currentLocation
  const hK = 5; // Finds the K nearest hospitals/labs wrt user location
  const rK = 50;// Finds the K nearest essentials wrt user location
  const rad = 100 * 1000; // Max distance of the K points, in meters

  if (userLocation) {
    medKnn = new Knn(L.geoJSON(geoData, { filter: medFilter })).nearestLayer([userLocation[1], userLocation[0]], hK);
    restKnn = new Knn(L.geoJSON(geoData, { filter: othersFilter })).nearest([userLocation[1], userLocation[0]], rK, rad);
    panKnn = panData["features"].filter(panFilter)
  }

  var gjKnn = {
    "name": "NearestK-Essentials",
    "type": "FeatureCollection",
    "features": []

  };

  
  if (medKnn) {
    let i = 0;
    for (i = 0; i < medKnn.length; i++) {
      gjKnn.features.push({
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": medKnn[i].layer.feature.geometry.coordinates
        },
        "properties": {
          "name": medKnn[i].layer.feature.properties.name,
          "desc": medKnn[i].layer.feature.properties.desc,
          "addr": medKnn[i].layer.feature.properties.addr,
          "phone": medKnn[i].layer.feature.properties.phone,
          "contact": medKnn[i].layer.feature.properties.contact,
          "icon": icon = new L.Icon({
            iconUrl: require('../icons/' + medKnn[i].layer.feature.properties.icon + '.svg'),
            iconRetinaUrl: require('../icons/' + medKnn[i].layer.feature.properties.icon + '.svg'),
            iconSize: [25, 25],
          }),
          "id": medKnn[i].layer.feature.properties.id
        }
      });
    }
  }


  if (restKnn) {
    let j = 0;
    for (j = 0; j < restKnn.length; j++) {
      gjKnn.features.push({
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": restKnn[j].layer.feature.geometry.coordinates
        },
        "properties": {
          "name": restKnn[j].layer.feature.properties.name,
          "desc": restKnn[j].layer.feature.properties.desc,
          "addr": restKnn[j].layer.feature.properties.addr,
          "phone": restKnn[j].layer.feature.properties.phone,
          "contact": restKnn[j].layer.feature.properties.contact,
          "icon": icon = new L.Icon({
            iconUrl: require('../icons/' + restKnn[j].layer.feature.properties.icon + '.svg'),
            iconRetinaUrl: require('../icons/' + restKnn[j].layer.feature.properties.icon + '.svg'),
            iconSize: [25, 25],
          }),
          "id": restKnn[j].layer.feature.properties.id
        }
      });
    }
  }

  return (
    <div>
      <Map center={center} zoom={zoom}>
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          // url='https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png' // != DarkMode
          url='https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png' // == DarkMode
          detectRetina={true}
        />
        <Search search={props.searchMap} />
        {(props.currentLocation) && (
          <Marker position={props.currentLocation} icon={user} key="userLoc">
            <Popup>
              <h2>Your current location</h2>
                {panKnn.map( p => (
                  <p key={p.properties.id} >
                  <a href={p.properties.contact}>{p.properties.name}</a> <br/>
                  {p.properties.desc} <br/>
                  {p.properties.phone}
                  </p>
                ))}
            </Popup>
          </Marker>
        )}

        <LayerGroup>
        <MarkerClusterGroup
            showCoverageOnHover={true}
            maxClusterRadius={10}
            spiderfyDistanceMultiplier={2}
            iconCreateFunction={createClusterCustomIcon}
        >
          {gjKnn.features.map(d => (
            <Marker
              key={d.properties.id}
              position={[d.geometry.coordinates[1], d.geometry.coordinates[0]]}
              icon={d.properties.icon}
            >
              <Popup className="custom-popup" >
                <div>
                  <a 
                    href={d.properties.contact} 
                    target="_noblank" 
                    >
                    <h2>{d.properties.name}</h2> 
                    </a>
                    <p>
                    <b>Description:</b> {d.properties.desc}<br />
                    <b>Address:</b> {d.properties.addr}
                    {d.properties.phone?(<><br />
                    <b>Phone:</b> {d.properties.phone}</>):null
                    }
                    </p>                  
                </div>
              </Popup>
            </Marker>

          ))}
        </MarkerClusterGroup>
        </LayerGroup>

      </Map>
    </div>
  )
}

