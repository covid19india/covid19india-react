import Footer from './Footer';

import '../styles/about.scss';
import {fetcher} from '../utils/commonFunctions';

import React, {useEffect} from 'react';
import {Helmet} from 'react-helmet';
import useSWR from 'swr';

function About() {
  const {data} = useSWR(
    'https://api.covid19india.org/website_data.json',
    fetcher,
    {suspense: true}
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <React.Fragment>
      <Helmet>
        <title>About - covid19india.org</title>
        <meta
          name="title"
          content="Coronavirus Outbreak in India: Latest Map and Case Count"
        />
      </Helmet>

      <div className="about">
        {data.faq.map((faq, index) => (
          <div key={index} className="faq">
            <h5 className="question">{faq.question}</h5>
            <h5
              className="answer"
              dangerouslySetInnerHTML={{__html: faq.answer}}
            ></h5>
          </div>
        ))}
      </div>

      <Footer />
    </React.Fragment>
  );
}

export default About;
