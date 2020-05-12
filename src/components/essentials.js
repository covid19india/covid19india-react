import KnnResults from './knnresults';

import axios from 'axios';
import React, {useState} from 'react';
import * as Icon from 'react-feather';

const Essentials = (props) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [currentAddress, setCurrentAddress] = useState(null);
  const [currentState, setCurrentState] = useState(null);

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      setCurrentLocation([position.coords.latitude, position.coords.longitude]);
      getCurrentAddress(position.coords.latitude, position.coords.longitude);
    });
  };

  const getCurrentAddress = (lat, lng) => {
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
          setCurrentAddress(response.data.locality);
          setCurrentState(response.data.principalSubdivision);
        });
    } catch (err) {
      console.log(err);
      setCurrentAddress('Error fetching name of your location');
      setCurrentState(null);
    }
  };

  return (
    <div className="Essentials">
      <img
        src="/essentials_1.svg"
        alt="essentials platform"
        className="fadeInUp"
        style={{animationDelay: '0.3s'}}
      />
      <img
        src="/essentials_2.svg"
        alt="essentials woman pushing cart"
        className="fadeInUp"
        style={{position: 'absolute', animationDelay: '0.1s'}}
      />

      {!currentLocation && (
        <React.Fragment>
          <button
            className="button fadeInUp"
            style={{animationDelay: '0.6s'}}
            onClick={() => getLocation()}
          >
            View essentials nearby offering special assistance
          </button>
          <div className="alert fadeInUp" style={{animationDelay: '0.7s'}}>
            <Icon.AlertOctagon size={16} />
            <div className="alert-right is-full">
              {`We do not collect any location data; they're all stored 
              inside your browser and are inaccessible to no one except 
              you.`}
            </div>
          </div>
          <div className="alert fadeInUp" style={{animationDelay: '0.8s'}}>
            <Icon.AlertOctagon size={16} />
            <div className="alert-right is-full">
              {`We are a community sourced listing platform and are not associated
              with any of the organizations listed below. Although we verify all
              our listings, we request you to follow all the guidelines and take
              the necessary precautions. We encourage you to report any error or
              suspicious activity so that we can take immediate action.`}
            </div>
          </div>
        </React.Fragment>
      )}

      {currentAddress && (
        <div className="address fadeInUp">
          <h3>{currentAddress + ', ' + currentState}</h3>

          <Icon.XCircle
            size={16}
            onClick={() => {
              setCurrentLocation(null);
              setCurrentAddress(null);
              setCurrentState(null);
            }}
          />
        </div>
      )}

      <div className="Search">
        {currentAddress && (
          <KnnResults userLocation={currentLocation} userState={currentState} />
        )}
      </div>
    </div>
  );
};
export default Essentials;
