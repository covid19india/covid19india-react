import React, {useState, useEffect} from 'react';
import websitedata from '../data/websitedata';

function FAQ(props) {
  const [faq, setFaq] = useState([]);

  useEffect(() => {
    getFAQs();
  }, []);

  const getFAQs = () => {
      setFaq(websitedata['faq']);
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
