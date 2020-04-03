import { Component } from "react";
import L from "leaflet";
import * as ELG from "esri-leaflet-geocoder";
import { withLeaflet } from "react-leaflet";
let search=null;
class Search extends Component {
  
  componentDidMount() {
    const map = this.props.leaflet.map;
    const searchControl = new ELG.Geosearch().addTo(map);
    const results = new L.LayerGroup().addTo(map);
    searchControl.on("results", function(data) {
      results.clearLayers();
      //   for (let i = data.results.length - 1; i >= 0; i--) {}
      search(data.results[0].latlng)
        results.addLayer(L.marker(data.results[0].latlng));
      
    });
  }

  render() {
   search= this.props.search;
    return null;
  }
}
//export default Search;
export default withLeaflet(Search);

