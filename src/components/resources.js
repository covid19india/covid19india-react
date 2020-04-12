import React, {useState, useEffect, useCallback} from 'react';
import ResourceTable from './resourcetable';
import axios from 'axios';
import FormControl from '@material-ui/core/FormControl';
import Popover from '@material-ui/core/Popover';
import Select from '@material-ui/core/Select';
import {makeStyles} from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import ErrorOutlineOutlinedIcon from '@material-ui/icons/ErrorOutlineOutlined';
import Fab from '@material-ui/core/Fab';
import NavigationOutlinedIcon from '@material-ui/icons/NavigationOutlined';

export const useFormControlStyles = makeStyles((isDesktop) => {
  if (isDesktop === true)
    return {
      root: {
        margin: '1rem',
        flexGrow: '1',
      },
    };
  else
    return {
      root: {
        margin: '0.4rem',
        flexGrow: '1',
        width: '100%',
      },
    };
});
export const useInputLabelStyles = makeStyles(() => ({
  root: {
    fontFamily: 'archia',
    fontSize: '11px !important',
    fontWeight: 600,
    textTransform: 'uppercase',
  },
}));

export const useMenuItemStyles = makeStyles(() => ({
  root: {
    fontFamily: 'archia',
    fontSize: '11px !important',
    fontWeight: 600,
    textTransform: 'uppercase',
  },
}));
export const usePopOverStyles = makeStyles(() => ({
  root: {
    backgroundColor: '#201aa220',
    zIndex: '1000',
  },
}));
export const useTextInputStyles = makeStyles(() => ({
  root: {
    height: '0.5rem',
  },
}));
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
  const classesFormControl = useFormControlStyles();
  const classesInputLabel = useInputLabelStyles();
  const classesMenuItem = useMenuItemStyles();
  const classesPopOver = usePopOverStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
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

  const handleDisclaimerClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDisclaimerClose = () => {
    setAnchorEl(null);
  };

  const isDisclaimerOpen = Boolean(anchorEl);
  const id = isDisclaimerOpen ? 'simple-popover' : undefined;
  function topFunction() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
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
          .map((x) => (
            <option
              key={x.id}
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
      .map((x) => (
        <option
          key={x.id}
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
        return array.map((x) => (
          <option
            key={x.id}
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
          return array.map((x) => (
            <option
              key={x.id}
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
            .map((x) => (
              <option
                key={x.id}
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
    // console.log('Search Button Pressed');
    // console.log(`Filters are: ${indianstate} ---> ${city} ----> ${category}`);
    let a = [];
    if (category === 'all') {
      // console.log("All category selected");
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
      // console.log(`Category chosen ${category}`);
      // a = resourcedict[indianstate][city][category];

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
    } catch (err) {
      // console.log('No PAN India row found');
    }
    setData(a);
    setPartData(a.slice(0, 30));
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
        .catch((error) => console.log(error));
    } else {
      openSharingLink(message);
    }
  };
  return (
    <div className="Resources">
      <div className="filtersection">
        <div className="filtertitle">
          <h3>Service Before Self</h3>
        </div>
        {!isDesktop && (
          <React.Fragment>
            <div
              className="disclaimercontainer"
              style={{
                display: 'flex',
                flexDirection: 'row-reverse',
                width: '100%',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div
                className="button is-purple mobile-disclaimer-button"
                style={{
                  margin: '0.2rem',
                  padding: '0.5rem',
                  alignItems: 'center',
                }}
                onClick={handleDisclaimerClick}
              >
                Disclaimer
                <ErrorOutlineOutlinedIcon
                  htmlColor="#6c757d"
                  fontSize="0.1rem"
                />
              </div>
              <Popover
                id={id}
                open={isDisclaimerOpen}
                classes={{root: classesPopOver.root}}
                anchorEl={anchorEl}
                onClose={handleDisclaimerClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <h6
                  style={{
                    paddingLeft: '0.5rem',
                    color: '#343a40',
                    margin: '0.3rem 0rem',
                  }}
                >
                  <p>
                    We are a community sourced listing platform and are not
                    associated with any of the organisations listed below.
                  </p>
                  <p>
                    Although we verify all our listings, we request you to
                    follow all the guidelines and take necessary precautions.
                  </p>
                  <p>
                    We encourage you to report any error or suspicious activity
                    so we can take immediate action.
                  </p>
                </h6>
              </Popover>
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSfquevp7_rdgdEoDgTdimWwTXO3B9TjFEAm3DbrMDXxCiuwuA/viewform"
                className="button add-entry is-purple"
                target="_blank"
                rel="noopener noreferrer"
                style={{margin: '0.2rem 0.2rem', padding: '0.5rem 0.5rem'}}
              >
                <span>Add</span>
              </a>
              <a
                href="https://forms.gle/AG5hmYxyhto3NjU46"
                className="button add-entry is-purple"
                target="_blank"
                rel="noopener noreferrer"
                style={{margin: '0.2rem 0.2rem', padding: '0.5rem 0.5rem'}}
              >
                <span>Feedback</span>
              </a>
            </div>
            <div className="resourcefilters">
              <FormControl
                variant="outlined"
                size="small"
                className="resourcefilterMobile"
                classes={{root: classesFormControl.root}}
              >
                <InputLabel
                  id="demo-simple-select-outlined-label"
                  classes={{root: classesInputLabel.root}}
                >
                  State/UT
                </InputLabel>
                <Select
                  native
                  labelId="demo-simple-select-outlined-label"
                  id="stateselect"
                  value={indianstate}
                  onChange={changeIndianState}
                  defaultValue="all"
                  label="State/UT"
                  classes={{root: classesMenuItem.root}}
                >
                  <option value="all" classes={{root: classesMenuItem.root}}>
                    All states
                  </option>
                  {getIndianStateOptions()}
                </Select>
              </FormControl>
              <FormControl
                variant="outlined"
                size="small"
                className="resourcefilterMobile"
                classes={{root: classesFormControl.root}}
              >
                <InputLabel
                  id="demo-simple-select-outlined-label"
                  classes={{root: classesInputLabel.root}}
                >
                  City
                </InputLabel>
                <Select
                  native
                  labelId="demo-simple-select-outlined-label"
                  id="cityselect1"
                  value={city}
                  onChange={changeCity}
                  defaultValue="all"
                  label="City"
                  classes={{root: classesMenuItem.root}}
                >
                  <option value="all" classes={{root: classesMenuItem.root}}>
                    All Cities
                  </option>
                  {getCityOptions()}
                </Select>
              </FormControl>
              <FormControl
                variant="outlined"
                size="small"
                className="resourcefilterMobile"
                classes={{root: classesFormControl.root}}
              >
                <InputLabel
                  id="demo-simple-select-outlined-label"
                  classes={{root: classesInputLabel.root}}
                >
                  Services
                </InputLabel>
                <Select
                  native
                  labelId="demo-simple-select-outlined-label"
                  id="categoryselect"
                  value={category}
                  onChange={changeCategory}
                  defaultValue="all"
                  label="Services"
                  classes={{root: classesMenuItem.root}}
                >
                  <option value="all" classes={{root: classesMenuItem.root}}>
                    All Categories
                  </option>
                  {getCategoryOptions()}
                </Select>
              </FormControl>

              <div
                className="search-share"
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: '100%',
                }}
              >
                <button
                  className="button is-purple"
                  disabled={!indianstate}
                  onClick={filterTable}
                  style={{
                    margin: '0.2rem 0.2rem',
                    padding: '0.5rem 0.5rem',
                    width: '50%',
                    justifyContent: 'center',
                  }}
                >
                  Search
                </button>
                <button
                  onClick={openSharingTray}
                  className="button add-entry is-purple"
                  style={{
                    margin: '0.2rem 0.2rem',
                    padding: '0.5rem 0.5rem',
                    width: '50%',
                    justifyContent: 'center',
                  }}
                >
                  <span>Share</span>
                </button>
              </div>
            </div>
          </React.Fragment>
        )}
        {isDesktop && (
          <React.Fragment>
            <div
              className="disclaimercontainer"
              style={{
                display: 'flex',
                flexDirection: 'row-reverse',
                width: '100%',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div
                className="button disclaimer-button"
                style={{
                  margin: '0rem',
                  padding: '0.3rem',
                  alignItems: 'center',
                  justifyContent: 'space-around',
                }}
                onClick={handleDisclaimerClick}
              >
                Disclaimer
                <ErrorOutlineOutlinedIcon
                  htmlColor="#6c757d"
                  fontSize="small"
                />
              </div>
              <Popover
                id={id}
                open={isDisclaimerOpen}
                classes={{root: classesPopOver.root}}
                anchorEl={anchorEl}
                onClose={handleDisclaimerClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <h6
                  style={{
                    paddingLeft: '0.5rem',
                    color: '#343a40',
                    margin: '0.3rem 0rem',
                  }}
                >
                  <p>
                    We are a community sourced listing platform and are not
                    associated with any of the organisations listed below.
                  </p>
                  <p>
                    Although we verify all our listings, we request you to
                    follow all the guidelines and take necessary precautions.
                  </p>
                  <p>
                    We encourage you to report any error or suspicious activity
                    so we can take immediate action.
                  </p>
                </h6>
              </Popover>
            </div>
            <div className="resourcefilters">
              <FormControl
                variant="outlined"
                size="small"
                className="resourcefilterMobile"
                classes={{root: classesFormControl.root}}
              >
                <InputLabel
                  id="demo-simple-select-outlined-label"
                  classes={{root: classesInputLabel.root}}
                >
                  State/UT
                </InputLabel>
                <Select
                  native
                  labelId="demo-simple-select-outlined-label"
                  id="stateselect"
                  value={indianstate}
                  onChange={changeIndianState}
                  defaultValue="all"
                  label="State/UT"
                  classes={{root: classesMenuItem.root}}
                >
                  <option value="all" classes={{root: classesMenuItem.root}}>
                    All states
                  </option>
                  {getIndianStateOptions()}
                </Select>
              </FormControl>
              <FormControl
                variant="outlined"
                size="small"
                className="resourcefilterMobile"
                classes={{root: classesFormControl.root}}
              >
                <InputLabel
                  id="demo-simple-select-outlined-label"
                  classes={{root: classesInputLabel.root}}
                >
                  City
                </InputLabel>
                <Select
                  native
                  labelId="demo-simple-select-outlined-label"
                  id="cityselect1"
                  value={city}
                  onChange={changeCity}
                  defaultValue="all"
                  label="City"
                  classes={{root: classesMenuItem.root}}
                >
                  <option value="all" classes={{root: classesMenuItem.root}}>
                    All cities
                  </option>
                  {getCityOptions()}
                </Select>
              </FormControl>
              <FormControl
                variant="outlined"
                size="small"
                className="resourcefilterMobile"
                classes={{root: classesFormControl.root}}
              >
                <InputLabel
                  id="demo-simple-select-outlined-label"
                  classes={{root: classesInputLabel.root}}
                >
                  Services
                </InputLabel>
                <Select
                  native
                  labelId="demo-simple-select-outlined-label"
                  id="categoryselect"
                  value={category}
                  onChange={changeCategory}
                  defaultValue="all"
                  label="Services"
                  classes={{root: classesMenuItem.root}}
                >
                  <option value="all" classes={{root: classesMenuItem.root}}>
                    All categories
                  </option>
                  {getCategoryOptions()}
                </Select>
              </FormControl>
              <button
                className="button is-purple"
                disabled={!indianstate}
                onClick={filterTable}
                style={!indianstate ? {pointerEvents: 'none'} : null}
              >
                Search
              </button>
            </div>
            <div
              className="misclinkscontainer"
              style={{
                display: 'flex',
                flexDirection: 'row',
                width: '100%',
                justifyContent: 'center',
                marginTop: '0.2rem',
                marginBottom: '0.6rem',
              }}
            >
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSfquevp7_rdgdEoDgTdimWwTXO3B9TjFEAm3DbrMDXxCiuwuA/viewform"
                className="button add-entry is-purple"
                target="_blank"
                rel="noopener noreferrer"
                style={{margin: '0rem 0.2rem', padding: '0.1rem 0.5rem'}}
              >
                <span>Add Entry</span>
              </a>
              <a
                href="https://forms.gle/AG5hmYxyhto3NjU46"
                className="button add-entry is-purple"
                target="_blank"
                rel="noopener noreferrer"
                style={{margin: '0rem 0.2rem', padding: '0.1rem 0.5rem'}}
              >
                <span>Feedback</span>
              </a>
              <button
                onClick={openSharingTray}
                className="button add-entry is-purple"
                style={{margin: '0rem 0.2rem', padding: '0.4rem'}}
              >
                <span>Share</span>
              </button>
            </div>
          </React.Fragment>
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
            <Fab
              color="inherit"
              aria-label="gototop"
              id="gototopbtn"
              onClick={topFunction}
              size="small"
              style={{
                position: 'fixed',
                bottom: '1rem',
                right: '1rem',
                zIndex: '1000',
              }}
            >
              <NavigationOutlinedIcon htmlColor="#201aa299" />
            </Fab>
          </div>
        </React.Fragment>
      )}
    </div>
  );
}

export default Resources;
