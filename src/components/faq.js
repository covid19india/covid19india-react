import React, {useState, useEffect} from 'react';
import axios from 'axios';

function FAQ(props) {
  const [faq, setFaq] = useState([{open: false}]);

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

  const toggleFAQ = (index) => {
    setFaq(
      faq.map((faq, i) => {
        if (i === index) {
          faq.open = !faq.open;
        } else {
          faq.open = false;
        }

        return faq;
      })
    );
  };

  return (
    <div className="FAQ">
      <div className="faqs">
        {faq.map((faq, i) => (
          <div
            className={'faq ' + (faq.open ? 'open' : '')}
            key={i}
            onClick={() => toggleFAQ(i)}
          >
            <div className="question">{faq.question}</div>
            <div className="answer">{faq.answer}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FAQ;
