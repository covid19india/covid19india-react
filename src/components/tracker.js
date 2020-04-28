import MapChart from './statelist';

import React, {useState} from 'react';
import * as Icon from 'react-feather';

const Tracker = (props) => {
  const [currentLocation, setCurrentLocation] = useState(null);

  const getLocationHandler = (event) => {
    event.preventDefault();
    navigator.geolocation.getCurrentPosition((position) => {
      setCurrentLocation([position.coords.latitude, position.coords.longitude]);
    });
  };

  return (
    <div className="Tracker">
      {currentLocation ? (
        <div className="Search">
          <div className="location">{currentLocation}</div>
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
export default Tracker;
