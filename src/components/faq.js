import axios from 'axios';
import React, {useState, useEffect} from 'react';
import {Helmet} from 'react-helmet';

function FAQ(props) {
  const [faq, setFaq] = useState([]);

  useEffect(() => {
    // isComponentSubscribedToPromise flag used to setState only if component is still mounted
    // will not setState on unmounted component to prevent memory leak
    let isComponentSubscribedToPromise = true;
    const getFAQs = () => {
      axios
        .get('https://api.covid19india.org/website_data.json')
        .then((response) => {
          if (isComponentSubscribedToPromise) {
            setFaq(response.data['faq']);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getFAQs();
    return () => {
      isComponentSubscribedToPromise = false;
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
