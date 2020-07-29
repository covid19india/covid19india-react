import Footer from './Footer';

import '../styles/about.scss';
import React, {useState, useEffect} from 'react';
import {Helmet} from 'react-helmet';

const DATA_URL = 'https://api.covid19india.org/website_data.json';

function About() {
  const [faq, setFaq] = useState([]);

  useEffect(() => {
    getFAQs();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const getFAQs = () => {
    fetch(DATA_URL)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setFaq(data.faq);
      })
      .catch((error) => {
        console.log(error);
      });
  };

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
        {faq.map((faq, index) => {
          return (
            <div
              key={index}
              className="faq fadeInUp"
              style={{animationDelay: `${0.5 + index * 0.1}s`}}
            >
              <h5 className="question">{faq.question}</h5>
              <h5
                className="answer"
                dangerouslySetInnerHTML={{__html: faq.answer}}
              ></h5>
            </div>
          );
        })}
      </div>

      <Footer />
    </React.Fragment>
  );
}

export default About;
