import React, {useState, useEffect} from 'react';
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
      <marquee>
        {snippets.map((snippet, index)=>{
          return (
            <span>{snippet.banner}</span>
          );
        })}
      </marquee>
    </div>
  );
}

export default Banner;
