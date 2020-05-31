import KnnResults from './knnresults';

import axios from 'axios';
import React, {useState, useEffect} from 'react';
import ContentLoader from 'react-content-loader';
import * as Icon from 'react-feather';
import {useMeasure} from 'react-use';

function EssentialsLoader() {
  const [svgElement, {width}] = useMeasure();

  useEffect(() => {}, [width]);

  return (
    <React.Fragment>
      <span ref={svgElement} style={{width: '100%'}} />
      {width && (
        <ContentLoader
          speed={1.5}
          width={width}
          height={325}
          viewBox={`0 0 ${width} 325`}
          position="absolute"
          className="fadeInUp"
        >
          <rect
            x={width / 2 - 60}
            y="10"
            rx="5"
            ry="5"
            width="120"
            height="32"
          />
          <rect
            x={width / 2 + 70}
            y="18"
            rx="100"
            ry="100"
            width="15"
            height="15"
          />
          <rect x="10" y="80" rx="5" ry="5" width="85" height="32" />
          <rect x="100" y="80" rx="5" ry="5" width="65" height="32" />
          <rect x="10" y="130" rx="5" ry="5" width={width - 20} height="172" />
        </ContentLoader>
      )}
    </React.Fragment>
  );
}

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
            <span>View Nearby Essentials</span>
            <Icon.Compass size={16} />
          </button>
          <div className="alert fadeInUp" style={{animationDelay: '0.7s'}}>
            <Icon.AlertOctagon size={16} />
            <div className="alert-right is-full">
              {`We do not collect any location data; they're all stored 
              inside your browser and are inaccessible to us.`}
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

      {currentLocation && !currentAddress && <EssentialsLoader />}

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
