import React,{useEffect,useState}  from 'react';
import MapChart from './mapChart'
import axios from 'axios'
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import RoomTwoToneIcon from '@material-ui/icons/RoomTwoTone';
import { TextField } from '@material-ui/core';
import Display from './display.js'
import { AlignCenter } from 'react-feather';
const URL ='https://tracker-covid-19.herokuapp.com'
let pinLocation=null;
let reset=false;


const Tracker = (props)=>{
const [input,setInputData] = useState('');
const [currentLocation,setCurrentLocation]=useState(null);
const [error,setError] =useState(false);
const [invalidPin,setInvalidPin]=useState(false);
const [receiveData,setReceiveData]=useState(null);
const header={
  'Access-Control-Allow-Origin': '*'
}
 

useEffect(()=>{
  if(currentLocation){
    
  axios.get(URL+'/tracker',{
    params:{
      latitude:currentLocation[0],
      longitude:currentLocation[1]
    },
    headers:header
   
  }).then(response=>{
    reset=true;
    console.log(response.data);
        setReceiveData(response.data);
  })
  .catch(err=>{
    console.log(err);
    setError(true);
  })
}
},[currentLocation])


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

const clickListener=()=>{
  console.log('clicked');
  reset=false;
  axios.get(URL+'/tracker',{
    params:{pinCode:input},
    headers:header
  }).then(response=>{
    console.log(response.data);
    if(!response.data.PIN_validity){
      setInvalidPin(true);
    }
    else{
      pinLocation=[response.data.lat,response.data.lng]
      reset=true;
      setReceiveData(response.data);
      setCurrentLocation(null);
      setInvalidPin(false);
      
    }
  }).catch(err=>{
    console.log(err);
  })

}

const searchHandler = (data)=>{
  reset=false;
console.log('successful',data.lat,data.lng );
setCurrentLocation([data.lat,data.lng]);

}
  return (
  <div className="tracker">
    <div style={{color:'blue',textAlign:'center'}}>
  <RoomTwoToneIcon  style={{fontSize:'3rem'}} />
  <br/>
  <h1 >NearBy Cases</h1>
   </div>
  {error?<p style={{color:"red",textAlign:'center'}}>Error fetching location</p>:null}
  {reset&&<Display>{receiveData.cases} at distance of {receiveData.minDist} KM :{receiveData.district}</Display>}
  <div  style={{color:"red",textAlign:'center'}}>{isNaN(input)||invalidPin?'please enter valid pincode':null}</div>
  
    <div className="tracker_bar">
    <button className="button" 
     onClick={(event)=>getLocationHandler(event)}>
     GPS Location</button>
     <div >
     <label> <h4 className="h4">Enter Area pincode:</h4></label>
     <TextField className="input input_tracker" 
           type="text" placeholder="Enter your pincode"
           onChange={(event)=>inputHandler(event)}
           value={input}
            InputProps={{
            endAdornment: (
              <InputAdornment>
              <IconButton onClick={clickListener}>
              <SearchIcon />
              </IconButton>
              </InputAdornment> )}}
      />
      </div>
          
    </div>
    
    <div>
    <MapChart 
      searchMap={(data)=>searchHandler(data)} 
      currentLocation={currentLocation}  
      className="leaflet-container"
      pLocation={receiveData?[receiveData.lat,receiveData.lng]:null}
      radius={receiveData?+receiveData.minDist:null}
      cases={receiveData?receiveData.cases:null}
      pinLocation={pinLocation}
      />
      </div>
     
    </div>
    
    )
}
export default Tracker;