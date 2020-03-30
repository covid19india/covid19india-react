import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Helmet from 'react-helmet';

function FAQ(props) {
  const [faq, setFaq] = useState([]);

  useEffect(() => {
    getFAQs();
  }, []);

  const getFAQs = () => {
    axios
      .get('https://api.covid19india.org/faq.json')
      .then((response) => {
        setFaq(response.data.faq);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <Helmet>
        <title>FAQs | covid19india</title>
        <meta name="title" content="FAQs | covid19india" />
        <meta name="description" content="Volunteer-driven crowdsourced initiative to track the spread of Coronavirus (COVID-19) in India" />
        <meta name="keywords" content="coronavirus,corona,covid,covid19,covid-19,covidindia,india,virus" />
      </Helmet>
      <div className="FAQ">
        {faq.map((faq, index) => {
          return (
            <div
              key={index}
              className="faq fadeInUp"
              style={{ animationDelay: `${0.5 + index * 0.1}s` }}
            >
              <h2 className="question">{faq.question}</h2>
              <h2 className="answer">{faq.answer}</h2>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default FAQ;
