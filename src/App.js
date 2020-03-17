import React, {useState, useEffect} from 'react';
import axios from 'axios';

import './App.css';

import Table from './components/table';
import Level from './components/level';
import ChoroplethMap from './components/choropleth';

function App() {
  const [states, setStates] = useState([]);
  const [fetched, setFetched] = useState(false);

  useEffect(()=> {
    if (fetched===false) {
      getStates();
    }
  }, [fetched]);

  const getStates = () => {
    axios.get('https://api.steinhq.com/v1/storages/5e6fd8b1b88d3d04ae081598/statewise')
        .then((response)=>{
          setStates(response.data);
          setFetched(true);
        })
        .catch((err)=>{
          console.log(err);
        });
  };

  return (
    <div className="App">

      <section className="hero">
        <div className="hero-body">
          <div className="container">
            <h1 className="title fadeInUp" style={{animationDelay: '0.1s'}}>
              COVID-19 🇮🇳
            </h1>
            <h2 className="subtitle fadeInUp" style={{animationDelay: '0.2s'}}>
              Coronavirus cases in India
            </h2>
          </div>
        </div>
      </section>

      <div className="level-parent fadeInUp" style={{animationDelay: '0.3s'}}>
        <Level data={states}/>
        <div></div>
      </div>

      <div className="table-parent">
        <Table states={states}/>

        <div className="table-right">

          <ChoroplethMap states={states}/>

        </div>

      </div>

    </div>
  );
}

export default App;
