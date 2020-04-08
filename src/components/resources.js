import React, {useState, useEffect, useCallback} from 'react';
import ResourceTable from './resourcetable';
import axios from 'axios';
function Resources(props) {
  const [data, setData] = useState([]);
  const [fetched, setFetched] = useState(false);
  const [city, setCity] = useState('');
  const [category, setCategory] = useState('');
  const [indianstate, setIndianState] = useState('');
  const [resourcedict, setResourceDict] = useState({});
  const [showTable, setShowTable] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    if (fetched === false) {
      getResources();
    }
  }, [fetched, data, resourcedict]);
  const checkForResizeEvent = useCallback((event) => {
    if (window.innerWidth > 639) setIsDesktop(true);
    else setIsDesktop(false);
    // console.log(isDesktop);
  }, []);

  useEffect(() => {
    if (window.innerWidth > 639) setIsDesktop(true);
    else setIsDesktop(false);
    window.addEventListener('resize', checkForResizeEvent);
    return () => {
      window.removeEventListener('resize', checkForResizeEvent);
    };
  }, [isDesktop, checkForResizeEvent]);

  const getResources = async () => {
    try {
      const [response] = await Promise.all([
        axios.get('https://api.covid19india.org/resources/resources.json'),
      ]);
      // console.log(response)
      // console.log("Column names are")
      // console.log(columns)
      // setData(response.data.resources);
      const hashmap = {};
      response.data.resources.forEach((x) => {
        // console.log(x)
        if (typeof hashmap[x['state']] === 'undefined')
          hashmap[x['state']] = {};
        if (typeof hashmap[x['state']][x['city']] === 'undefined')
          hashmap[x['state']][x['city']] = {};
        if (
          typeof hashmap[x['state']][x['city']][x['category']] === 'undefined'
        )
          hashmap[x['state']][x['city']][x['category']] = [];
        if (Array.isArray(hashmap[x['state']][x['city']][x['category']]))
          hashmap[x['state']][x['city']][x['category']].push(x);
      });

      setResourceDict(hashmap);
      // setIndianState(Object.keys()[0]);

      setFetched(true);
      // console.log(resourcedict);
    } catch (err) {
      // console.log(err);
    }
  };
  const memocols = React.useMemo(
    () => [
      {
        Header: 'City',
        accessor: 'city',
      },
      {
        Header: 'Category',
        accessor: 'category',
      },
      {
        Header: 'Organisation',
        accessor: 'nameoftheorganisation',
      },
      {
        Header: 'Description',
        accessor: 'descriptionandorserviceprovided',
      },
      {
        Header: 'Phone',
        accessor: 'phonenumber',
      },
      {
        Header: 'Website',
        accessor: 'contact',
      },
    ],
    []
  );
  // const memodata = React.useMemo(() => data, [data])

  const getCityOptions = function () {
    if (indianstate) {
      return Object.keys(resourcedict[indianstate])
        .sort()
        .map((x) => (
          <option key={x.id} value={x}>
            {x}
          </option>
        ));
    } else return [];
    // return getCityList().map((x) => <option value={x}>{x}</option>)
  };
  const getIndianStateOptions = function () {
    // let defaultOption = ['Please select']
    return Object.keys(resourcedict)
      .sort()
      .map((x) => (
        <option key={x.id} value={x}>
          {x}
        </option>
      ));
  };
  const getCategoryOptions = function () {
    if (indianstate && city) {
      if (city === 'all') return [];
      else {
        return Object.keys(resourcedict[indianstate][city])
          .sort()
          .map((x) => (
            <option key={x.id} value={x}>
              {x}
            </option>
          ));
      }
    } else return [];
  };

  const filterTable = function () {
    // console.log('Search Button Pressed');
    // console.log(`Filters are: ${indianstate} ---> ${city} ----> ${category}`);
    let a = [];
    if (category === 'all') {
      // console.log("All category selected");
      if (city === 'all') {
        Object.values(resourcedict[indianstate]).forEach((citydata) => {
          Object.values(citydata).forEach((category) => {
            category.forEach((x) => a.push(x));
          });
        });
      } else {
        Object.values(resourcedict[indianstate][city]).forEach((x) => {
          x.forEach((y) => a.push(y));
        });
      }
    } else {
      // console.log(`Category chosen ${category}`);
      // a = resourcedict[indianstate][city][category];
      if (city === 'all') {
        Object.values(resourcedict[indianstate]).forEach((citydata) => {
          if (category in citydata) {
            citydata[category].forEach((x) => {
              a.push(x);
            });
          }
        });
      } else {
        a = resourcedict[indianstate][city][category];
      }
    }
    try {
      if ('PAN India' in resourcedict) {
        resourcedict['PAN India']['Multiple']['CoVID-19 Testing Lab'].forEach(
          (element) => {
            a.push(element);
          }
        );
      }
    } catch (err) {
      // console.log('No PAN India row found');
    }
    setData(a);
    // console.log(resourcedict[indianstate][city][category]);
    // console.log(data);
    setShowTable(true);
  };

  const changeIndianState = function (changedstateevent) {
    setIndianState(changedstateevent.target.value);
    // setCity(
    //   Object.keys(resourcedict[changedstateevent.target.value]).sort()[0]
    // );
    if (changedstateevent.target.value === '') {
      setCity('');
      document.getElementById('cityselect1').selectedIndex = 0;
      setCategory('');
      document.getElementById('categoryselect').selectedIndex = 0;
    } else {
      setCity('all');
      document.getElementById('cityselect1').selectedIndex = 1;
      setCategory('all');
      document.getElementById('categoryselect').selectedIndex = 1;
    }
  };
  const changeCity = function (changedcityevent) {
    setCity(changedcityevent.target.value);
    setCategory('all');
    document.getElementById('categoryselect').selectedIndex = 1;
  };
  const changeCategory = function (changedcategoryevent) {
    setCategory(changedcategoryevent.target.value);
    // console.log(changedcategoryevent.target.value);
  };
  return (
    <div className="Resources">
      <div className="filtersection">
        <div className="filtertitle">
          <h3>Apply filters and hit search</h3>
        </div>
        <div className="resourcefilters">
          <div className="resourcefilter">
            {/* <label for='stateselect1' className='filterlabel'>
                            State
                        </label> */}
            <select
              id="stateselect1"
              onChange={changeIndianState}
              defaultValue=""
            >
              <option value="" disabled hidden>
                Choose State
              </option>
              {getIndianStateOptions()}
            </select>
          </div>
          <div className="resourcefilter">
            {/* <label for='cityselect1' className='filterlabel'>
                            City
                        </label> */}
            <select
              id="cityselect1"
              onChange={changeCity}
              disabled={indianstate === ''}
              defaultValue=""
            >
              <option value="" disabled hidden>
                Choose City
              </option>
              <option value="all">All Cities</option>
              {getCityOptions()}
            </select>
          </div>
          <div className="resourcefilter">
            {/* <label for='categoryselect' className='filterlabel'>
                            Category
                        </label> */}
            <select
              id="categoryselect"
              onChange={changeCategory}
              disabled={indianstate === ''}
              defaultValue=""
            >
              <option value="" disabled hidden>
                Choose Category
              </option>
              <option value="all">All Categories</option>
              {getCategoryOptions()}
            </select>
          </div>
          <div className="resourcefilter">
            <button
              className="button is-purple"
              disabled={!indianstate}
              onClick={filterTable}
            >
              Search
            </button>
          </div>
        </div>
      </div>
      <br></br>
      <div className="TableArea fadeInOut">
        {showTable && (
          <ResourceTable columns={memocols} data={data} isDesktop={isDesktop} />
        )}
      </div>
    </div>
  );
}

export default Resources;
