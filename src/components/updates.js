import React, {useState, useEffect} from 'react';
import {formatDistance, format} from 'date-fns';
import axios from 'axios';

function Updates(props) {
  const [updates, setUpdates] = useState([]);
  const [fetched, setFetched] = useState(false);
  let headeradded = false;
  let currentDate = new Date();

  useEffect(() => {
    if (fetched === false) {
      axios
        .get('https://api.covid19india.org/updatelog/log.json')
        .then((response) => {
          setUpdates(response.data);
          setFetched(true);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [fetched]);

  return (
    <React.Fragment>
      <div className="updates-header">
        <h2>{format(currentDate, 'd MMM')}</h2>
      </div>
      <div className="updates">
        {updates
          .slice(-5)
          .reverse()
          .map(function (activity, index) {
            activity.update = activity.update.replace('\n', '<br/>');
            const activityDate = new Date(activity.timestamp * 1000);
            const addHeader = () => {
              headeradded = !headeradded;
              currentDate = activityDate;
              return (
                <div className="updates-header">
                  <h2>{format(activityDate, 'd MMM')}</h2>
                </div>
              );
            };
            return (
              <>
                {activityDate.getDate() !== currentDate.getDate() &&
                !headeradded
                  ? addHeader()
                  : (headeradded = !headeradded)}
                <div key={index} className="update">
                  <h5>
                    {formatDistance(
                      new Date(activity.timestamp * 1000),
                      new Date()
                    ) + ' ago'}
                  </h5>
                  <h4
                    dangerouslySetInnerHTML={{
                      __html: activity.update,
                    }}
                  ></h4>
                </div>
              </>
            );
          })}
      </div>
    </React.Fragment>
  );
}

export default Updates;
