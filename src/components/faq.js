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
          setFaq = setFaq(response.data.faq);
        })
        .catch((error) => {
          console.log(error);
        });
  };

  return (
    <div className="FAQ">

      {faq.map((faq, index) => {
        return (
          <div className="faq">
            <h2 className="question">{faq.question}</h2>
            <h2 className="answer">{faq.answer}</h2>
          </div>
        );
      })}

    </div>
  );
}

export default FAQ;
