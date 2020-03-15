import React, {useState, useEffect} from 'react';
import axios from 'axios';

import './App.css';

import Table from './components/table';
import Level from './components/level';

function App() {
  const [states, setStates] = useState([]);
  const [fetched, setFetched] = useState(false);

  useEffect(()=> {
    if (fetched===false) {
      getStates();
    }
  }, [fetched]);

  const getStates = () => {
    axios.get('http://localhost:3000/states')
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
            <h1 className="title">
              COVID-19 🇮🇳
            </h1>
            <h2 className="subtitle">
              Coronavirus cases in India
            </h2>
          </div>
        </div>
      </section>

      <div className="level-parent">
        <Level data={states}/>
        <div></div>
      </div>

      <div className="table-parent">
        <Table states={states}/>

        <div className="table-right">
        </div>

      </div>

    </div>
  );
}

export default App;
