import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import * as Icon from 'react-feather';

function SocialMedia(props) {
  const [data, setData] = useState(props.data);
  const [summaryString, setSummaryData] = useState('');

  useEffect(()=>{
    setData(props.data);
    parseSummaryData();
  });

  const parseSummaryData = () => {
    if (Object.keys(data).length > 0) {
      const summaryData = data.statewise[0];
      const dateTimeString = data.key_values[0].lastupdatedtime.slice(0, -2) +
      data.key_values[0].lastupdatedtime.slice(-2).toUpperCase();

      const twitterString = `COVID-19 India : 📊 as of ${dateTimeString} IST
    Total Confirmed : ${summaryData.confirmed}
    Total Recovered : ${summaryData.recovered}
    Total Deceased  : ${summaryData.deaths}

    Number of cases reported today: ${data.key_values[0].confirmeddelta}

    Follow @covid19indiaorg

    #COVID19India #SocialDistancing
    More @`;
      setSummaryData(twitterString);
    }
  };

  return (
    <div className="header-mid">
      <a
        className="button telegram"
        onClick={() => {
          document.location.href('https://t.me/covid19indiaops');
        }}
      >
        <Icon.MessageCircle />
        <span>Join Telegram to Collaborate!</span>
      </a>
      <a
        className="twitter-share-button"
        href="https://twitter.com/intent/tweet"
        data-size="large"
        data-url="https://www.covid19india.org/"
        data-text={summaryString}
      >
        <span>Tweet</span>
      </a>
      <div
        className="fb-share-button"
        data-href="https://www.covid19india.org/"
        data-layout="button"
        data-size="large"
      >
        <a
          // eslint-disable-next-line react/jsx-no-target-blank
          target="_blank"
          href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fplugins%2F&amp;src=sdkpreparse"
          className="fb-xfbml-parse-ignore"
        >
                Share
        </a>
      </div>
    </div>
  );
}
SocialMedia.propTypes = {
  data: PropTypes.object,
};
export default SocialMedia;
