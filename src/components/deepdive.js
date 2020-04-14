import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Tabs, Tab, Typography, Box} from '@material-ui/core';
import GenderChart from './Charts/genderchart';
import AgeChart from './Charts/agechart';
import NationalityChart from './Charts/nationalitychart';
import AllStatesChart from './Charts/allstates';
import TotalConfirmedChart from './Charts/totalconfirmedchart';
import DailyConfirmedChart from './Charts/dailyconfirmedchart';
import MobilityChart from './Charts/mobilityChart';

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
    const {children, value, index, ...other} = props;

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
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        centered
        variant="fullWidth"
      >
        <Tab label="Number of cases" />
        <Tab label="Data on gender, age, nationality" />
        <Tab label="Mobility changes" />
      </Tabs>

      <TabPanel value={tabValue} index={0}>
        <section className="cards">
          <div className="card fadeInUp" style={{animationDelay: '0.7s'}}>
            <TotalConfirmedChart
              title="India - Total Cases"
              timeseries={timeseries}
            />
          </div>

          <div className="card fadeInUp" style={{animationDelay: '0.7s'}}>
            <DailyConfirmedChart
              title="India - Daily Cases"
              timeseries={timeseries}
            />
          </div>

          <div className="card fadeInUp" style={{animationDelay: '0.7s'}}>
            <AllStatesChart
              title="States - Total Cases"
              data={statesTimeSeries}
            />
          </div>
        </section>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <section className="cards">
          <div className="card fadeInUp" style={{animationDelay: '0.2s'}}>
            <GenderChart title="Patient Gender" data={rawData} />
          </div>

          <div className="card fadeInUp" style={{animationDelay: '0.5s'}}>
            <AgeChart title="Patient Age" data={rawData} />
          </div>

          <div className="card fadeInUp" style={{animationDelay: '0.7s'}}>
            <NationalityChart title="Patient Nationality" data={rawData} />
          </div>
        </section>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <section className="cards">
          <div className="card fadeInUp" style={{animationDelay: '0.2s'}}>
            <MobilityChart
              title="Grocery and Pharmacy"
              data={
                mobilityData.data
                  ? mobilityData.data.country.groceryAndPharmacy.points
                  : null
              }
            />
          </div>
          <div className="card fadeInUp" style={{animationDelay: '0.2s'}}>
            <MobilityChart
              title="Parks"
              data={
                mobilityData.data
                  ? mobilityData.data.country.parks.points
                  : null
              }
            />
          </div>
          <div className="card fadeInUp" style={{animationDelay: '0.3s'}}>
            <MobilityChart
              title="Residential"
              data={
                mobilityData.data
                  ? mobilityData.data.country.residential.points
                  : null
              }
            />
          </div>
          <div className="card fadeInUp" style={{animationDelay: '0.4s'}}>
            <MobilityChart
              title="Retail and Recreation"
              data={
                mobilityData.data
                  ? mobilityData.data.country.parks.points
                  : null
              }
            />
          </div>
          <div className="card fadeInUp" style={{animationDelay: '0.5s'}}>
            <MobilityChart
              title="Transit stations"
              data={
                mobilityData.data
                  ? mobilityData.data.country.transitStations.points
                  : null
              }
            />
          </div>
          <div className="card fadeInUp" style={{animationDelay: '0.6s'}}>
            <MobilityChart
              title="Workplaces"
              data={
                mobilityData.data
                  ? mobilityData.data.country.workplaces.points
                  : null
              }
            />
          </div>
        </section>
        <div style={{textAlign: 'center'}}>
          <a href="https://www.google.com/covid19/mobility/">
            Based on Google&apos;s Mobility data
          </a>
        </div>
      </TabPanel>
    </div>
  );
}

export default DeepDive;
