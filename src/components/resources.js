import FiltersDesktop from './Essentials/essentialsfiltersdesktop';
import FiltersMobile from './Essentials/essentialsfiltersmobile';
import ResourceTable from './resourcetable';

import {Fab, Fade} from '@material-ui/core';
import axios from 'axios';
import React, {useState, useEffect, useCallback} from 'react';
import * as Icon from 'react-feather';

function Resources(props) {
  const [data, setData] = useState([]);
  const [partData, setPartData] = useState([]);
  const [fetched, setFetched] = useState(false);
  const [city, setCity] = useState('all');
  const [category, setCategory] = useState('all');
  const [indianstate, setIndianState] = useState('all');
  const [resourcedict, setResourceDict] = useState({});
  const [showTable, setShowTable] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  useEffect(() => {
    if (fetched === false) {
      getResources();
    }
  }, [fetched, data, resourcedict]);

  const checkForResizeEvent = useCallback((event) => {
    if (window.innerWidth > 639) setIsDesktop(true);
    else setIsDesktop(false);
  }, []);

  useEffect(() => {
    if (window.innerWidth > 639) setIsDesktop(true);
    else setIsDesktop(false);
    window.addEventListener('resize', checkForResizeEvent);
    return () => {
      window.removeEventListener('resize', checkForResizeEvent);
    };
  }, [isDesktop, checkForResizeEvent]);

  const checkScrollEvent = useCallback((event) => {
    window.pageYOffset > 100 ? setHasScrolled(true) : setHasScrolled(false);
  }, []);

  useEffect(() => {
    window.pageYOffset > 100 ? setHasScrolled(true) : setHasScrolled(false);
    window.addEventListener('scroll', checkScrollEvent);
    return () => {
      window.removeEventListener('scroll', checkScrollEvent);
    };
  }, [hasScrolled, checkScrollEvent]);

  const getResources = async () => {
    try {
      const [response] = await Promise.all([
        axios.get('https://api.covid19india.org/resources/resources.json'),
      ]);
      // setData(response.data.resources);
      const hashmap = {};
      response.data.resources.forEach((x) => {
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
    } catch (err) {}
  };

  const handleDisclaimerClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDisclaimerClose = () => {
    setAnchorEl(null);
  };

  const isDisclaimerOpen = Boolean(anchorEl);
  const id = isDisclaimerOpen ? 'simple-popover' : undefined;

  function animateScroll() {
    document.body.scrollTo({top: 0, behavior: 'smooth'}); // For Safari
    document.documentElement.scrollTo({top: 0, behavior: 'smooth'}); // For Chrome, Firefox, IE and Opera
  }

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
        Header: 'Source',
        accessor: 'contact',
        isVisible: false,
      },
    ],
    []
  );
  // const memodata = React.useMemo(() => data, [data])

  const getCityOptions = function () {
    if (indianstate) {
      if (indianstate === 'all') return [];
      else {
        return Object.keys(resourcedict[indianstate])
          .sort()
          .map((x, i) => (
            <option
              key={i}
              value={x}
              style={{
                fontFamily: 'archia',
                fontSize: '11px !important',
                fontWeight: 600,
                textTransform: 'uppercase',
              }}
            >
              {x}
            </option>
          ));
      }
    } else return [];
    // return getCityList().map((x) => <option value={x}>{x}</option>)
  };
  const getIndianStateOptions = function () {
    // let defaultOption = ['Please select']
    return Object.keys(resourcedict)
      .sort()
      .map((x, i) => (
        <option
          key={i}
          value={x}
          style={{
            fontFamily: 'archia',
            fontSize: '11px !important',
            fontWeight: 600,
            textTransform: 'uppercase',
          }}
        >
          {x}
        </option>
      ));
  };
  const getCategoryOptions = function () {
    if (indianstate && city) {
      if (indianstate === 'all') {
        const array = [];
        Object.values(resourcedict).forEach((state) => {
          Object.values(state).forEach((citydata) => {
            Object.keys(citydata).forEach((x) => {
              if (array.indexOf(x) === -1) array.push(x);
            });
          });
        });
        return array.sort().map((x, i) => (
          <option
            key={i}
            value={x}
            style={{
              fontFamily: 'archia',
              fontSize: '11px !important',
              fontWeight: 600,
              textTransform: 'uppercase',
            }}
          >
            {x}
          </option>
        ));
      } else {
        if (city === 'all') {
          const array = [];
          Object.values(resourcedict[indianstate]).forEach((citydata) => {
            Object.keys(citydata).forEach((x) => {
              if (array.indexOf(x) === -1) array.push(x);
            });
          });
          return array.sort().map((x, i) => (
            <option
              key={i}
              value={x}
              style={{
                fontFamily: 'archia',
                fontSize: '11px !important',
                fontWeight: 600,
                textTransform: 'uppercase',
              }}
            >
              {x}
            </option>
          ));
        } else {
          return Object.keys(resourcedict[indianstate][city])
            .sort()
            .map((x, i) => (
              <option
                key={i}
                value={x}
                style={{
                  fontFamily: 'archia',
                  fontSize: '11px !important',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                }}
              >
                {x}
              </option>
            ));
        }
      }
    } else return [];
  };

  const filterTable = function () {
    let a = [];
    if (category === 'all') {
      if (city === 'all') {
        if (indianstate === 'all') {
          Object.values(resourcedict).forEach((state) => {
            Object.values(state).forEach((citydata) => {
              Object.values(citydata).forEach((category) => {
                category.forEach((x) => a.push(x));
              });
            });
          });
        } else {
          Object.values(resourcedict[indianstate]).forEach((citydata) => {
            Object.values(citydata).forEach((category) => {
              category.forEach((x) => a.push(x));
            });
          });
        }
      } else {
        Object.values(resourcedict[indianstate][city]).forEach((x) => {
          x.forEach((y) => a.push(y));
        });
      }
    } else {
      if (indianstate === 'all' && city === 'all') {
        Object.values(resourcedict).forEach((state) => {
          Object.values(state).forEach((citydata) => {
            Object.values(citydata).forEach((categorydata) => {
              categorydata.forEach((x) => {
                if (x.category === category) a.push(x);
              });
            });
          });
        });
      } else if (indianstate !== 'all' && city === 'all') {
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
    } catch (err) {}
    setData(a);
    setPartData(a.slice(0, 30));
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
  };
  const appendData = function () {
    const tempArr = partData.concat(
      data.slice(partData.length, partData.length + 30)
    );
    setPartData(tempArr);
  };

  const openSharingLink = function (message) {
    const shareUri = `https://www.addtoany.com/share#url=${encodeURI(
      'https://www.covid19india.org/essentials'
    )}&title=${encodeURI(message)}`;

    const h = 500;
    const w = 500;
    const left = window.screen.width / 2 - w / 2;
    const top = window.screen.height / 2 - h / 2;
    return window.open(
      shareUri,

      document.title,
      'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' +
        w +
        ', height=' +
        h +
        ', top=' +
        top +
        ', left=' +
        left
    );
  };

  const openSharingTray = function () {
    const message =
      'Discover nearest coronavirus support and essential service providers such as testing lab centres, accommodation shelters and vegetable vendors at ';
    if (navigator.share !== undefined) {
      navigator
        .share({
          title: document.title,
          text: message,
          url: 'https://www.covid19india.org/essentials',
        })
        .then()
        .catch((error) => {});
    } else {
      openSharingLink(message);
    }
  };
  return (
    <div className="Resources" id="top-elem">
      <div className="filtersection">
        <div className="filtertitle">
          <h3>Service Before Self</h3>
        </div>
        {!isDesktop && (
          <FiltersMobile
            handleDisclaimerClick={handleDisclaimerClick}
            popoverid={id}
            isDisclaimerOpen={isDisclaimerOpen}
            anchorEl={anchorEl}
            handleDisclaimerClose={handleDisclaimerClose}
            indianstate={indianstate}
            changeIndianState={changeIndianState}
            stateoptions={getIndianStateOptions()}
            city={city}
            changeCity={changeCity}
            cityoptions={getCityOptions()}
            category={category}
            changeCategory={changeCategory}
            servicesoptions={getCategoryOptions()}
            filterTable={filterTable}
            openSharingTray={openSharingTray}
          />
        )}
        {isDesktop && (
          <FiltersDesktop
            handleDisclaimerClick={handleDisclaimerClick}
            popoverid={id}
            isDisclaimerOpen={isDisclaimerOpen}
            anchorEl={anchorEl}
            handleDisclaimerClose={handleDisclaimerClose}
            indianstate={indianstate}
            changeIndianState={changeIndianState}
            stateoptions={getIndianStateOptions()}
            city={city}
            changeCity={changeCity}
            cityoptions={getCityOptions()}
            category={category}
            changeCategory={changeCategory}
            servicesoptions={getCategoryOptions()}
            filterTable={filterTable}
            openSharingTray={openSharingTray}
          />
        )}
      </div>
      {showTable && (
        <React.Fragment>
          <ResourceTable
            columns={memocols}
            data={partData}
            totalCount={data.length}
            isDesktop={isDesktop}
            onScrollUpdate={appendData}
            city={city}
            category={category}
            indianstate={indianstate}
          />
          <div>
            <Fade in={hasScrolled}>
              <Fab
                color="inherit"
                aria-label="gototop"
                id="gototopbtn"
                onClick={animateScroll}
                size="small"
                style={{
                  position: 'fixed',
                  bottom: '1rem',
                  right: '1rem',
                  zIndex: '1000',
                }}
              >
                <Icon.Navigation2 strokeWidth="2.5" color="#4c75f2" />
              </Fab>
            </Fade>
          </div>
        </React.Fragment>
      )}
    </div>
  );
}

export default Resources;
