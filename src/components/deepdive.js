import React, {useState, useEffect} from 'react';
import axios from 'axios';
import GenderChart from './Charts/genderchart';
import AgeChart from './Charts/agechart';
import NationalityChart from './Charts/nationalitychart';
import AllStatesChart from './Charts/allstates';
import TotalConfirmedChart from './Charts/totalconfirmedchart';
import DailyConfirmedChart from './Charts/dailyconfirmedchart';
import $ from 'jquery';
// import ionRangeSlider from 'ion-rangeslider';

const ionRangeSlider = require('ion-rangeslider');
console.log(ionRangeSlider);
window.$ = $;

function DeepDive(props) {
  const [fetched, setFetched] = useState(false);
  const [timeseries, setTimeseries] = useState([]);
  const [rawData, setRawData] = useState([]);
  const [statesTimeSeries, setStatesTimeSeries] = useState([]);

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
      ] = await Promise.all([
        axios.get('https://api.covid19india.org/data.json'),
        axios.get('https://api.covid19india.org/raw_data.json'),
        axios.get('https://api.covid19india.org/states_daily.json'),
      ]);

      const lang = 'en-US';

      function dateToTS(date) {
        return date.valueOf();
      }

      function tsToDate(ts) {
        const d = new Date(ts);

        return d.toLocaleDateString(lang, {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
      }

      const dateList = response.data.cases_time_series.map(function (el) {
        return new Date(el.date + '2020');
      });

      const startDate = new Date(Math.min.apply(null, dateList));
      const endDate = new Date(Math.max.apply(null, dateList));

      function filterData(dt, from, to, addYear, formatReq) {
        if (!formatReq) {
          if (addYear) {
            dt = dateToTS(new Date(dt + '2020'));
          } else {
            dt = dateToTS(new Date(dt));
          }
        } else {
          const parts = dt.split('/');
          console.log('parts:', parts);
          dt = new Date(
            parts[1] + '-' + parts[0] + '-' + parts[2].split(' ')[0]
          );
        }

        if (dt >= from && dt <= to) {
          return true;
        }
      }

      const tsData = response.data.cases_time_series;
      const stateData = stateDailyResponse.data.states_daily;
      const rawData = rawDataResponse.data.raw_data;

      const saveResult = function (datetime) {
        const from = datetime['from'];
        const to = datetime['to'];
        const tsDataSliced = tsData.filter(function (d) {
          return filterData(d.date, from, to, true, false);
        });

        const stateDataSliced = stateData.filter(function (d) {
          return filterData(d.date, from, to, false, false);
        });

        const rawDataSliced = rawData.filter(function (d) {
          if (d.dateannounced) {
            return filterData(d.dateannounced, from, to, false, true);
          }
        });

        setTimeseries(tsDataSliced);
        setStatesTimeSeries(stateDataSliced);
        setRawData(rawDataSliced);
        setFetched(true);
      };

      $('#ui').ionRangeSlider({
        skin: 'big',
        type: 'double',
        grid: true,
        min: dateToTS(startDate),
        max: dateToTS(endDate),
        from: dateToTS(new Date('1 march 2020')),
        to: dateToTS(endDate),
        prettify: tsToDate,
        onStart: function (datatime) {
          saveResult(datatime);
        },
        onChange: saveResult,
        onFinish: saveResult,
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="cards-container">
      <h2>Range</h2>
      <div id="ui"></div>
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

        <div className="card fadeInUp" style={{animationDelay: '0.7s'}}>
          <GenderChart title="Patient Gender" data={rawData} />
        </div>

        <div className="card fadeInUp" style={{animationDelay: '0.7s'}}>
          <AgeChart title="Patient Age" data={rawData} />
        </div>

        <div className="card fadeInUp" style={{animationDelay: '0.7s'}}>
          <NationalityChart title="Patient Nationality" data={rawData} />
        </div>
      </section>
    </div>
  );
}

export default DeepDive;
