import MapChart from './statelist';

import axios from 'axios';
import React, {useState} from 'react';
import * as Icon from 'react-feather';

const TrackerTable = (props) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [currAddr, setCurrAddr] = useState(null);

  const getLocationHandler = (event) => {
    event.preventDefault();
    navigator.geolocation.getCurrentPosition((position) => {
      setCurrentLocation([position.coords.latitude, position.coords.longitude]);
      getCurrAddr(position.coords.latitude, position.coords.longitude);
    });
  };

  const getCurrAddr = (lat, lng) => {
    try {
      axios
        .get(
          'https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=' +
            lat +
            '&longitude=' +
            lng +
            '&localityLanguage=en'
        )
        .then((response) => {
          setCurrAddr(response.data.locality);
        });
    } catch (err) {
      console.log(err);
      setCurrAddr('Error fetching name of your location');
    }
  };

  return (
    <div className="Tracker-table">
      {currentLocation ? (
        <div className="Search">
          <div className="location">{currAddr}</div>
          <span
            className="close-button"
            onClick={() => {
              setCurrentLocation(null);
            }}
          >
            <Icon.XCircle />
          </span>
          <MapChart userLocation={currentLocation} />
        </div>
      ) : (
        <div
          className="button fadeInUp"
          style={{animationDelay: '0.9s'}}
          onClick={(event) => getLocationHandler(event)}
        >
          <Icon.MapPin />
          <h3>View nearby essentials offering special assistance</h3>
        </div>
      )}
    </div>
  );
};
export default TrackerTable;
