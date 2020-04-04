import React, {useState, useEffect} from 'react';
import axios from 'axios';

function FAQ(props) {
  const [faq, setFaq] = useState([]);

  useEffect(() => {
    getFAQs();
  }, []);

  const getFAQs = () => {
    axios
      .get('https://api.covid19india.org/website_data.json')
      .then((response) => {
        setFaq(response.data['faq']);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="FAQ">
      {faq.map((faq, index) => {
        return (
          <div
            key={index}
            className="faq fadeInUp"
            style={{animationDelay: `${0.5 + index * 0.1}s`}}
          >
            <h2 className="question">{faq.question}</h2>
            <h3
              className="answer"
              dangerouslySetInnerHTML={{__html: faq.answer}}
            ></h3>
          </div>
        );
      })}
    </div>
  );
}

export default FAQ;
