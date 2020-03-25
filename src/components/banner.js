import React, {useState, useEffect} from 'react';
import Ticker, {NewsTicker} from 'nice-react-ticker';
import axios from 'axios';

function Banner(props) {
  const [snippets, setSnippets] = useState([]);

  useEffect(()=>{
    getSnippets();
  }, [1]);

  const getSnippets = () => {
    axios.get('https://api.covid19india.org/website_data.json')
        .then((response)=>{
          setSnippets(response.data.factoids);
        })
        .catch((err)=>{
          console.log(err);
        });
  };

  return (
    <div className="Banner fadeInUp" style={{animationDelay: '0.5s'}}>
      <Ticker isNewsTicker={true}>
        {snippets.map((snippet, index)=>{
          return (
            <NewsTicker key={index} id={index} title={snippet.banner} />
          );
        })}
      </Ticker>
    </div>
  );
}

export default Banner;
