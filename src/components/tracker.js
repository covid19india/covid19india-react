import React,{
  useState
  //, useEffect
  }  from 'react';
import MapChart from './mapchart'

let reset=false;


const Tracker = (props)=>{
const [input,setInputData] = useState('');
const [currentLocation,setCurrentLocation]=useState(null);
const [error,setError] =useState(false);
const [receiveData,setReceiveData]=useState(null);



const inputHandler=(event)=>{
    const val  = event.target.value;
    console.log(val);   
    setInputData(val)
}
const getLocationHandler = (event)=>{
  reset=false;
    event.preventDefault()
    navigator.geolocation.getCurrentPosition(position=>{
    setCurrentLocation([position.coords.latitude,position.coords.longitude])
    setError(false);
    },error=>{
        console.log(error);
        setError(true);

    })
}

const searchHandler = (data)=>{
  reset=false;
console.log('successful',data.lat,data.lng );
setCurrentLocation([data.lat,data.lng]);

}
  return (
  <div className="tracker">
  

    <div className="tracker_bar">
    <button className="button" 
     onClick={(event)=>getLocationHandler(event)}>
     GPS Location</button>
    </div>

    <div>
    <MapChart 
      searchMap={(data)=>searchHandler(data)} 
      currentLocation={currentLocation}  
      className="leaflet-container"
      pLocation={receiveData?[receiveData.lat,receiveData.lng]:null}
      radius={receiveData?+receiveData.minDist:null}
      cases={receiveData?receiveData.cases:null}
      />
    </div>

  </div>

    )
}
export default Tracker;
