import React, {useState, useEffect} from 'react';
import {Helmet} from 'react-helmet';

// TODO(slightlyoff): factor out common JSON parsing & caching of this file
const DATA_URL = 'https://api.covid19india.org/website_data.json';

function FAQ(props) {
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
    <div className="FAQ">
      <Helmet>
        <title>FAQ - covid19india.org</title>
        <meta
          name="title"
          content="Coronavirus Outbreak in India: Latest Map and Case Count"
        />
      </Helmet>
      {faq.map((faq, index) => {
        return (
          <div
            key={index}
            className="faq fadeInUp"
            style={{animationDelay: `${0.5 + index * 0.1}s`}}
          >
            <h2 className="question">{faq.question}</h2>
            <h2
              className="answer"
              dangerouslySetInnerHTML={{__html: faq.answer}}
            ></h2>
          </div>
        );
      })}
    </div>
  );
}

export default FAQ;
