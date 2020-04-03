import React,{useState, useEffect} from 'react';
import { Map, Marker, Popup, TileLayer,Circle,CircleMarker} from "react-leaflet";
import L from 'leaflet';
import * as ELG from 'esri-leaflet-geocoder';
import Search from './search'
import './corona.svg'
import 'leaflet/dist/leaflet.css'
//import * as parkData from "./data/skateboard-parks.json";
const virus = new L.Icon({
iconUrl:require('./corona.svg'),
iconRetinaUrl: require('./icon.svg'),
iconAnchor: [5, 55],

iconSize:[40,40]

});
const rectangle = [
    [51.49, -0.08],
    [51.5, -0.06],
  ]

// const mapData ={
//      features:[ 
//          {
//              id:'1',
//              coordinates:[28.7041,77.1025]
//          },
//          {
//             id:'2',
//             coordinates:[29.7041,73.1025]
//         },
//      ]

// }

export default  function MapChart(props) {
const [activeModal,setActiveModal]= useState(null);

useEffect(()=>{console.log('patient',props.name)})
const handleZoomstart = (event) => {
 console.log(event.target._zoom)
};

  return (
    <Map  className="leaflet-container " 
       center={props.pLocation||props.currentLocation||props.pinLocation||[25.7041,77.1025]} zoom={props.radius?(props.radius>6?10:11):7} >
      <TileLayer
        detectRetina={true}
        maxNativeZoom="17"
        maxZoom={17}
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright"></a> '
      />
      {props.pLocation?( <Circle center={props.pLocation} fillColor="red" radius={props.cases>'50'?4000:3000}>
     <Popup autoPan><h5>{props.cases} cases present in this area.</h5></Popup>
          </Circle>):null}
       
        
          
      
      {(props.currentLocation||props.pinLocation)&&(
          <Marker  position={props.currentLocation||props.pinLocation}>
              <Popup>your current location</Popup>
          </Marker>
      )}
     <Search  search={props.searchMap}/>

    </Map> 
  );
}  