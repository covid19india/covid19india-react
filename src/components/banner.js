import React, {useState, useEffect} from 'react';
import differenceInMilliseconds from 'date-fns/differenceInMilliseconds';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

function Banner(props) {
  const [snippets, setSnippets] = useState([]);
  const [snippet, setSnippet] = useState();
  const [start, setStart] = useState(props.start ? new Date(props.date) : localStorage.getItem('start')==='null' ? new Date() : new Date(localStorage.getItem('start')));
  const [difference, setDifference] = useState(new Date(differenceInMilliseconds(new Date(), start)).toISOString().slice(11, 19));
  const {i18n} = useTranslation()

  useEffect(()=>{
    getSnippets();
  }, [i18n.language]);

  useEffect(()=>{
    if (snippets.length>1) {
      setSnippet(snippets[0]);
    }
  }, [snippets]);

  useEffect(()=>{
    const interval = setInterval(() => {
      setDifference(new Date(differenceInMilliseconds(new Date(), start)).toISOString().slice(11, 19));
    }, 10000);
    snippetChooser(0, snippets.length-1);
    return () => clearInterval(interval);
  }, [difference]);

  const snippetChooser = (min, max) => {
    const index = Math.random() * (max - min) + min;
    setSnippet(snippets[Math.floor(index)]);
  };

  const getSnippets = () => {
    axios.get(`https://api.covid19india.org/website_data.json?lang=${i18n.language}`)
        .then((response)=>{
          setSnippets(response.data.factoids);
        })
        .catch((err)=>{
          console.log(err);
        });
  };

  return (
    <div className="Banner fadeInUp" style={{animationDelay: '0.2s'}}>
      <div className="snippet">
        {snippet ? snippet.banner : ''} &nbsp;
      </div>
    </div>
  );
}

export default Banner;
