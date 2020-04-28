// const url = `https://newsapi.org/v1/articles?source=${sr}&apiKey=YOUR_NEWSAPI_HERE`;
import axios from 'axios';
import React, {useState, useEffect} from 'react';

function NewsHome() {
  const [newsArticles, setStateNewsArticles] = useState([]);

  useEffect(() => {
    axios
      .get(
        'http://newsapi.org/v2/everything?q=covid-19&from=2020-04-01&sortBy=publishedAt&apiKey=7d3bcb6873214872a7fc6045dc4afc71'
      )
      .then((response) => {
        console.log('news', response);
        if (!newsArticles.length) {
          setStateNewsArticles(response.data.articles);
        }
        // console.log('newsArticles', newsArticles);
      });
  });

  return (
    <div className="Resources" id="top-elem">
      <div className="filtersection">
        <div className="filtertitle">
          <h3>All News Come Here</h3>
        </div>
      </div>
    </div>
  );
}

export default React.memo(NewsHome);
