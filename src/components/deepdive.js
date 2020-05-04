import AgeChart from './Charts/agechart';
import AllStatesChart from './Charts/allstates';
import DailyConfirmedChart from './Charts/dailyconfirmedchart';
import GenderChart from './Charts/genderchart';
import GrowthTrendChart from './Charts/growthtrendchart';
import NationalityChart from './Charts/nationalitychart';
import TotalConfirmedChart from './Charts/totalconfirmedchart';

import axios from 'axios';
import React, {useState, useEffect} from 'react';
import {Helmet} from 'react-helmet';

function DeepDive() {
  const [fetched, setFetched] = useState(false);
  const [timeseries, setTimeseries] = useState([]);
  const [rawData, setRawData] = useState([]);
  const [statesTimeSeries, setStatesTimeSeries] = useState([]);

  useEffect(() => {
    // isComponentSubscribedToPromise flag used to setState only if component is still mounted
    // will not setState on unmounted component to prevent memory leak
    let isComponentSubscribedToPromise = true;

    if (fetched === false) {
      const getStates = async () => {
        try {
          const [
            response,
            rawDataResponse,
            stateDailyResponse,
          ] = await Promise.all([
            axios.get('https://api.covid19india.org/data.json'),
            axios.get('https://api.covid19india.org/raw_data.json'),
            axios.get('https://api.covid19india.org/states_daily.json'),
          ]);
          if (isComponentSubscribedToPromise) {
            setTimeseries(response.data.cases_time_series);
            setStatesTimeSeries(stateDailyResponse.data.states_daily);
            setRawData(rawDataResponse.data.raw_data);
            setFetched(true);
          }
        } catch (err) {
          console.log(err);
        }
      };
      getStates();
    }
    return () => {
      isComponentSubscribedToPromise = false;
    };
  }, [fetched]);

  return (
    <div className="cards-container">
      <Helmet>
        <title>Deep Dive - covid19india.org</title>
        <meta name="title" content="Deep Dive - covid19india.org" />
      </Helmet>

      <section className="cards">
        <div className="card fadeInUp" style={{animationDelay: '0.7s'}}>
          <TotalConfirmedChart title="Total Cases" timeseries={timeseries} />
        </div>

        <div className="card fadeInUp" style={{animationDelay: '0.7s'}}>
          <DailyConfirmedChart title="Daily Cases" timeseries={timeseries} />
        </div>

        <div
          className="card card-big fadeInUp"
          style={{animationDelay: '0.7s'}}
        >
          <AllStatesChart
            title="Total Cases by State"
            data={statesTimeSeries}
          />
        </div>

        <div className="card fadeInUp" style={{animationDelay: '0.7s'}}>
          <GrowthTrendChart
            title="States - Growth Trend"
            data={statesTimeSeries}
          />
        </div>

        <div className="card fadeInUp" style={{animationDelay: '0.7s'}}>
          <GenderChart title="Patient Gender" data={rawData} />
        </div>

        <div className="card fadeInUp" style={{animationDelay: '0.7s'}}>
          <AgeChart title="Patients by Age" data={rawData} />
        </div>

        <div className="card fadeInUp" style={{animationDelay: '0.7s'}}>
          <NationalityChart title="Patients by  Nationality" data={rawData} />
        </div>
      </section>
    </div>
  );
}

export default DeepDive;
