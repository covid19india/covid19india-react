import MapChart from './mapchart';
import axios from 'axios';
import React, {
  useState 
  //,useEffect
  } from 'react';
// import ContentLoader from 'react-content-loader';
import * as Icon from 'react-feather';
// import {useMeasure} from 'react-use';


const Tracker = (props) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [currentAddress, setCurrentAddress] = useState(null);
  const [currentState, setCurrentState] = useState(null);
  // let reset = false;

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      setCurrentLocation([position.coords.latitude, position.coords.longitude]);
      getCurrentAddress(position.coords.latitude, position.coords.longitude);
    });
  };

  const searchHandler = (data)=>{
    // reset=false;
  setCurrentLocation([data.lat,data.lng])
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
    <div className="Tracker">
       <div className="tracker_bar">
  
          <div
              className="button"
              style={{animationDelay: '0.9s'}}
              onClick={() => getLocation()}
            >
              {currentAddress?(<><h3>{currentAddress + ', ' + currentState}</h3></> ): 
              (<><Icon.MapPin />
              <h3>View nearby hospitals treating Covid-19</h3></>)}
          </div>

      <div>
        
          <MapChart 
          searchMap={(data)=>searchHandler(data)} 
          currentLocation={currentLocation} 
          userState={currentState}
            
          className="leaflet-container"
          />        
      </div>


      
      </div>
    </div>
  );
};
export default Tracker;
