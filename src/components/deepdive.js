import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Tabs, Tab, Typography, Box } from '@material-ui/core';
import GenderChart from './Charts/genderchart';
import AgeChart from './Charts/agechart';
import NationalityChart from './Charts/nationalitychart';
import AllStatesChart from './Charts/allstates';
import TotalConfirmedChart from './Charts/totalconfirmedchart';
import DailyConfirmedChart from './Charts/dailyconfirmedchart';

function DeepDive(props) {
  const [fetched, setFetched] = useState(false);
  const [timeseries, setTimeseries] = useState([]);
  const [rawData, setRawData] = useState([]);
  const [statesTimeSeries, setStatesTimeSeries] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [mobilityData, setMobilityData] = useState([]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    if (fetched === false) {
      getStates();
    }
  }, [fetched]);

  const getStates = async () => {
    try {
      const [
        response,
        rawDataResponse,
        stateDailyResponse,
        mobilityResponse,
      ] = await Promise.all([
        axios.get('https://api.covid19india.org/data.json'),
        axios.get('https://api.covid19india.org/raw_data.json'),
        axios.get('https://api.covid19india.org/states_daily.json'),
        axios.get(
          'https://pastelsky.github.io/covid-19-mobility-tracker/output/IN/mobility.json'
        ),
      ]);
      setTimeseries(response.data.cases_time_series);
      setStatesTimeSeries(stateDailyResponse.data.states_daily);
      setRawData(rawDataResponse.data.raw_data);
      setMobilityData(mobilityResponse);
      setFetched(true);
    } catch (err) {
      console.log(err);
    }
  };
  function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <Typography
        component="div"
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && <Box p={3}>{children}</Box>}
      </Typography>
    );
  }

  return (
    <div className="cards-container">
      <Tabs value={tabValue} onChange={handleTabChange} centered>
        <Tab label="Number of cases" />
        <Tab label="Data on gender, age, nationality" />
        <Tab label="Mobility changes" />
      </Tabs>

      <TabPanel value={tabValue} index={0}>
        <section className="cards">
          <div className="card fadeInUp" style={{ animationDelay: '0.7s' }}>
            <TotalConfirmedChart
              title="India - Total Cases"
              timeseries={timeseries}
            />
          </div>

          <div className="card fadeInUp" style={{ animationDelay: '0.7s' }}>
            <DailyConfirmedChart
              title="India - Daily Cases"
              timeseries={timeseries}
            />
          </div>

          <div className="card fadeInUp" style={{ animationDelay: '0.7s' }}>
            <AllStatesChart
              title="States - Total Cases"
              data={statesTimeSeries}
            />
          </div>
        </section>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <section className="cards">
          <div className="card fadeInUp" style={{ animationDelay: '0.2s' }}>
            <GenderChart title="Patient Gender" data={rawData} />
          </div>

          <div className="card fadeInUp" style={{ animationDelay: '0.5s' }}>
            <AgeChart title="Patient Age" data={rawData} />
          </div>

          <div className="card fadeInUp" style={{ animationDelay: '0.7s' }}>
            <NationalityChart title="Patient Nationality" data={rawData} />
          </div>
        </section>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <section className="cards">
          <div className="card fadeInUp" style={{ animationDelay: '0.2s' }}>
            <div />
          </div>
        </section>
      </TabPanel>
    </div>
  );
}

export default DeepDive;
