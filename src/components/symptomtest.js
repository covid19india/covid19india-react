import React, {useState, useEffect} from 'react';

function SymptomTest(props) {

    const symptomTestLinks = [
        {
            title: 'Apple\'s COVID-19 Screening Tool',
            link: 'https://www.apple.com/covid19/'
        },
        {
            title: 'Reliance Foundation\'s Symptom checker',
            link: 'https://covid.bhaarat.ai/'
        },
    ]
  const [symptomTest, setSymptomTests] = useState(symptomTestLinks);

  return (
    <div className="Links">
      {symptomTest.map((symptomTest, index) => {
        return (
            <div className="link fadeInUp" style={{animationDelay: '0.5s'}}>
                <h3>{symptomTest.title}</h3>
                <a href={symptomTest.link}>{symptomTest.link}</a>
            </div>
        );
      })}

    </div>
  );
}

export default SymptomTest;
