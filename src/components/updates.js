import axios from 'axios';
import {formatDistance, format} from 'date-fns';
import React, {useState} from 'react';
import {useEffectOnce} from 'react-use';

let currentDate = new Date();

function Updates(props) {
  const [updates, setUpdates] = useState([]);

  useEffectOnce(() => {
    axios
      .get('https://api.covid19india.org/updatelog/log.json')
      .then((response) => {
        setUpdates(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  return (
    <div className="updates">
      <div className="updates-header">
        <h2>{format(currentDate, 'd MMM')}</h2>
      </div>

      {updates
        .slice(-5)
        .reverse()
        .map(function (activity, index) {
          activity.update = activity.update.replace('\n', '<br/>');
          const activityDate = new Date(activity.timestamp * 1000);
          const addHeader = () => {
            currentDate = activityDate;

            return (
              <React.Fragment>
                {index === 0 ? (
                  <div className="update">
                    <h4>No updates yet!</h4>
                  </div>
                ) : (
                  ''
                )}
                <div className="updates-header">
                  <h2>{format(activityDate, 'd MMM')}</h2>
                </div>
              </React.Fragment>
            );
          };

          return (
            <React.Fragment key={index}>
              {activityDate.getDate() !== currentDate.getDate()
                ? addHeader()
                : ' '}
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
            </React.Fragment>
          );
        })}
    </div>
  );
}

export default Updates;
