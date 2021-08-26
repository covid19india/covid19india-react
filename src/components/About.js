import Footer from './Footer';

import {API_DOMAIN} from '../constants';
import {fetcher} from '../utils/commonFunctions';

import {useEffect} from 'react';
import {Helmet} from 'react-helmet';
import useSWR from 'swr';

function About() {
  const {data} = useSWR(`${API_DOMAIN}/website_data.json`, fetcher, {
    suspense: true,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>About - covid19india.org</title>
        <meta
          name="title"
          content="Coronavirus Outbreak in India: Latest Map and Case Count"
        />
      </Helmet>

      <div className="About">
        {data.faq.map((faq, index) => {
          return (
            <div
              key={index}
              className="faq fadeInUp"
              style={{animationDelay: `${0.5 + index * 0.1}s`}}
            >
              <h2 className="question">{faq.question.trim()}</h2>
              <h2
                className="answer"
                dangerouslySetInnerHTML={{__html: faq.answer.trim()}}
              ></h2>
            </div>
          );
        })}
      </div>

      <Footer />
    </>
  );
}

export default About;
