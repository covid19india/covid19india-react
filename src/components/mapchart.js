import axios from 'axios';
import * as Knn from "leaflet-knn";
import React, { useState, useEffect } from 'react';
import * as Icons from 'react-feather';
import { Map, Marker, Popup, TileLayer, LayerGroup, LayersControl } from "react-leaflet";
import L from 'leaflet';
import MarkerClusterGroup from "react-leaflet-markercluster";
import Search from './geosearch';
import 'leaflet/dist/leaflet.css';

const {BaseLayer} = LayersControl;

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

function generateIcon(result) {
  return new L.Icon({
    iconUrl: require('../icons/' + result.layer.feature.properties.icon + '.svg'),
    iconRetinaUrl: require('../icons/' + result.layer.feature.properties.icon + '.svg'),
    iconSize: [25, 25],
  })
}

export default function MapChart(props) {
  const [geoData, setGeoData] = useState([]);

  useEffect(() => {
    getJSON();
  }, []);

  // Get processed data from forked repo until its pushed to API
  const getJSON = () => {
    axios
      .get('https://api.covid19india.org/resources/geoResources.json')
      .then((response) => {
        setGeoData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const center =  props.currentLocation || [21.3041, 77.1025];
  const zoom = 5;
  let medKnn;
  let restKnn;
  let panKnn

  const userLocation = props.currentLocation
  const hK = 5; // Finds the K nearest hospitals/labs wrt user location
  const rK = 50;// Finds the K nearest essentials wrt user location
  const rad = 100 * 1000; // Max distance of the K points, in meters

  if (userLocation) {
    medKnn = new Knn(L.geoJSON(geoData, { filter: medFilter })).nearestLayer([userLocation[1], userLocation[0]], hK);
    restKnn = new Knn(L.geoJSON(geoData, { filter: othersFilter })).nearestLayer([userLocation[1], userLocation[0]], rK, rad);
    panKnn = geoData?.features?.filter(
      (feat) =>
        feat.properties.state === 'PAN India' ||
        (feat.properties.state.includes('PAN') &&
          feat.properties.state.includes(props.userState))
    );
  }

  var results = {
    "name": "NearestK-Essentials",
    "type": "FeatureCollection",
    "features": []

  };

  
  if (medKnn) {
    let i = 0;
    for (i = 0; i < medKnn.length; i++) {
      results.features.push({
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
          "dist": getDistance(
            userLocation,
            medKnn[i].layer.feature.geometry.coordinates.reverse()
          ),
          "icon": generateIcon(medKnn[i]),
          "recordid": medKnn[i].layer.feature.properties.recordid,
        }
      });
    }
  }


  if (restKnn) {
    let j = 0;
    for (j = 0; j < restKnn.length; j++) {
      results.features.push({
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
          "dist": getDistance(
            userLocation,
            restKnn[j].layer.feature.geometry.coordinates.reverse()
          ),
          "icon": generateIcon(restKnn[j]),
          "recordid": restKnn[j].layer.feature.properties.recordid
        }
      });
    }
  }

  if (panKnn) {
    let k = 0;
    for (k = 0; k < panKnn.length; k++) {
      results.features.push(panKnn[k]);
    }
  }

  return (
    <div>


      <Map 
        center={center} 
        zoom={zoom} 
        // minZoom={5}
        // maxZoom={20}
      >
        <LayersControl position="topright" >
        <BaseLayer checked name="Light Mode">
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url='https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png' // != DarkMode
            detectRetina={true}
          />
        </BaseLayer>
        <BaseLayer name="Dark Mode">
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url='https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png' // == DarkMode
            detectRetina={true}
          />
        </BaseLayer>
        </LayersControl>
        
        <Search search={props.searchMap} />
        {(props.currentLocation) && (
          <Marker position={props.currentLocation} icon={user} key="userLoc">
            <Popup>
              <h2>Your current location</h2>
                {results?.features
                .filter((feature) => {
                  return (
                    // Object.keys(categories)
                    //   .filter(
                    //     (categoryName) => categories[categoryName].isSelected === true
                    //   )
                    //   .includes(feature.properties.icon) && 
                    !feature.properties.dist
                  );
                })
                .map( p => (
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
          {results?.features
          .filter((feature) => {
            return (
              // Object.keys(categories)
              //   .filter(
              //     (categoryName) => categories[categoryName].isSelected === true
              //   )
              //   .includes(feature.properties.icon) && 
              feature.properties.dist
            );
          })
          .map(d => (
            <Marker
              key={d.properties.id}
              position={d.geometry.coordinates}
              icon={d.properties.icon}
            >
              <Popup className="custom-popup" >
                <div>
                  <a 
                    href={d.properties.contact} 
                    target="_noblank" 
                    >
                    <h2>{d.properties.name} {"  "}
                    <Icons.ExternalLink/></h2> 
                    </a>
                    <p>
                    <b>Description:</b> {d.properties.desc}<br />
                    <b>Address:</b> {d.properties.addr}
                    {d.properties.phone?(<><br />
                    <b>Phone:</b> {d.properties.phone}<br/> </>):null
                    }
                    {d.properties.dist} km away from your location
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

