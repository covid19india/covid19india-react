import React, {useState, useEffect} from 'react';
import axios from 'axios';

function FAQ(props) {
  const [faq, setFaq] = useState([]);

  useEffect(()=>{
    getFAQs();
  }, [1]);

  const getFAQs = () => {
    axios.get('https://api.covid19india.org/faq.json')
        .then((response) => {
          setFaq(response.data.faq);
        })
        .catch((error) => {
          console.log(error);
        });
  };

  return (
    <div className="FAQ">

      {faq.map((faq, index) => {
        return (
          <div key={index} className="faq fadeInUp" style={{animationDelay: `${0.5+(index*0.1)}s`}}>
            <h2 className="question">{faq.question}</h2>
            <h2 className="answer">{faq.answer}</h2>
          </div>
        );
      })}

    </div>
  );
}

export default FAQ;
