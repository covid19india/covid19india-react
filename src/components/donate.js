import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import {Container} from '@material-ui/core';
import ExpansionPanelItem from './expansion';

function Donate(props) {
  const [data, setData] = useState([]);

  useEffect(() => {
    getDonate();
  }, []);

  // const url = 'http://localhost:7777/donate';
  const url = 'https://api.covid19india.org/donate.json';
  const getDonate = () => {
    axios
      .get(url)
      .then((response) => {
        setData(response.data.donate);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="FAQ">
      <Container>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <h2>Provide your Helping hand to the Government</h2>
            <br></br>
            {data.gov !== undefined &&
              data.gov.map((item, index) => {
                return (
                  <div key={index}>
                    <ExpansionPanelItem
                      key={index}
                      props={item}
                    ></ExpansionPanelItem>
                    <br></br>
                  </div>
                );
              })}
          </Grid>
          <Grid item xs={12} sm={6}>
            <h2>Provide your Helping hand to the NGOs</h2>
            <br></br>
            {data.nonGov !== undefined &&
              data.nonGov.map((item, index) => {
                return (
                  <div key={index}>
                    <ExpansionPanelItem
                      key={index}
                      props={item}
                    ></ExpansionPanelItem>
                    <br></br>
                  </div>
                );
              })}
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}

export default Donate;
