import React, {useState, useEffect, useRef} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {useTable} from 'react-table';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import InfiniteScroll from 'react-infinite-scroll-component';
import Autosuggest from 'react-autosuggest';
import TextField from '@material-ui/core/TextField';
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import InputAdornment from '@material-ui/core/InputAdornment';

const usePanelSummaryStyles = makeStyles((theme) => ({
  content: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  root: {
    backgroundColor: '#201aa220',
    height: '4rem',
  },
}));
const usePanelDetailsStyles = makeStyles((theme) => ({
  root: {
    padding: '0px 5px 0px 24px',
  },
}));
const useListStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
}));

const usePanelStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    marginBottom: '0.2rem',
  },
}));
const useItemTextStyles = makeStyles((theme) => ({
  primary: {
    fontFamily: 'Archia',
    fontWeight: 500,
    fontStyle: 'normal',
    fontSize: '13px',
    fontTransform: 'uppercase',
  },
  secondary: {
    fontFamily: 'Archia',
    fontWeight: 400,
    fontStyle: 'normal',
    fontSize: '12px',
    width: '100%',
    wordWrap: 'break-word',
    // fontTransform: 'uppercase'
  },
}));

const getNumbersLink = (initialValue) => {
  // const phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  const numbf = initialValue.split(',');
  // console.log('numbers are', '' + numbf.length);

  const numbg = /^\d{5,12}$/g;
  const numberList = numbf.map((iv, i) => {
    iv = iv.trim();
    // console.log('numbr ', '' + iv);
    return iv.replace(numbg, '<a href="tel:$&">$&</a>');
  });
  // console.log('numberList ', '' + numberList);
  return {numberList};
};
const getFormattedLinkForAccordion = (initialValue) => {
  const reurl1 = /\s*(https?:\/\/.+)\s*/g;
  // let reurl2 = /\s*.(www\..+)\s/g
  const reinsta = /\s*Instagram: @(.+)\s*/g;
  const refb = /\s*Facebook: @(.+)\s*/g;
  const noLetters = /^[\d,\s]+$/;
  let s3 = '';
  if (initialValue.match(noLetters) != null) {
    const formatedLink = getNumbersLink(initialValue);
    const links = JSON.parse(JSON.stringify(formatedLink));
    // console.log('success val', ' --' + JSON.stringify(links.numberList));
    s3 = String(links.numberList).replace(/,/g, '<br>');
  } else {
    const s1 = initialValue.replace(
      reurl1,
      '<a href="$1" target="_blank">Link</a>'
    );
    const s2 = s1.replace(
      reinsta,
      '<a href="https://www.instagram.com/$1" target="_blank">Instagram: @$1</a>'
    );
    s3 = s2.replace(
      refb,
      '<a href="https://www.facebook.com/$1" target="_blank">Facebook: @$1</a>'
    );
  }
  return (
    <div
      className="tablecelldata"
      dangerouslySetInnerHTML={{
        __html: s3,
      }}
    ></div>
  );
};

const getFormattedLink = (initialValue) => {
  const reurl1 = /\s*(https?:\/\/.+)\s*/g;
  // let reurl2 = /\s*.(www\..+)\s/g
  const reinsta = /\s*Instagram: @(.+)\s*/g;
  const refb = /\s*Facebook: @(.+)\s*/g;
  const noLetters = /^[\d,\s]+$/;
  let s3 = '';
  if (initialValue.match(noLetters) != null) {
    const formatedLink = getNumbersLink(initialValue);
    const links = JSON.parse(JSON.stringify(formatedLink));
    // console.log('success val', ' --' + JSON.stringify(links.numberList));
    s3 = String(links.numberList).replace(/,/g, '<br>');
  } else {
    const s1 = initialValue.replace(
      reurl1,
      '<a href="$1" target="_blank">Link</a>'
    );
    const s2 = s1.replace(
      reinsta,
      '<a href="https://www.instagram.com/$1" target="_blank">Instagram: @$1</a>'
    );
    s3 = s2.replace(
      refb,
      '<a href="https://www.facebook.com/$1" target="_blank">Facebook: @$1</a>'
    );
  }
  return s3;
};
const rendercell = (celli) => {
  const value = celli.cell.value;
  console.log(celli);
  let renderedvalue = '';
  const link = celli.row.allCells[5].value.split(',')[0];

  if (celli.column.id === 'contact') renderedvalue = getFormattedLink(value);
  else if (celli.column.id === 'phonenumber') {
    // renderedvalue = String(JSON.parse(JSON.stringify(getNumbersLink(value))).numberList).replace(/,/g, '<br>');
    renderedvalue = getFormattedLink(value);
  } else if (celli.column.id === 'nameoftheorganisation') {
    if (link !== '')
      renderedvalue = `<a href=${link} target="_blank">${value}</a>`;
    else renderedvalue = value;
  } else renderedvalue = value;

  return (
    <div
      className="tablecelldata"
      dangerouslySetInnerHTML={{
        __html: renderedvalue,
      }}
    ></div>
  );
};
const FormattedCell = ({value: initialValue, editable}) => {
  // We need to keep and update the state of the cell normally
  const [value, setValue] = React.useState(initialValue);
  const reurl1 = /\s*(https?:\/\/.+)\s*/g;
  // let reurl2 = /\s*.(www\..+)\s/g
  const reinsta = /\s*Instagram: @(.+)\s*/g;
  const refb = /\s*Facebook: @(.+)\s*/g;

  // If the initialValue is changed externall, sync it up with our state
  React.useEffect(() => {
    const noLetters = /^[\d,\s]+$/;
    if (initialValue.match(noLetters) != null) {
      const formatedLink = getNumbersLink(initialValue);
      const links = JSON.parse(JSON.stringify(formatedLink));
      setValue(String(links.numberList).replace(/,/g, '<br>'));
    } else {
      const s1 = initialValue.replace(
        reurl1,
        '<a href="$1" target="_blank">Link</a>'
      );
      const s2 = s1.replace(
        reinsta,
        '<a href="https://www.instagram.com/$1" target="_blank">Instagram: @$1</a>'
      );
      const s3 = s2.replace(
        refb,
        '<a href="https://www.facebook.com/$1" target="_blank">Facebook: @$1</a>'
      );
      setValue(s3);
    }
  }, [initialValue, reurl1, refb, reinsta]);

  return (
    <div
      className="tablecelldata"
      dangerouslySetInnerHTML={{
        __html: value,
      }}
    ></div>
  );
};

// searchbar stuff

const getSuggestions = (value, resources) => {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;
  // console.log(resources);
  return inputLength === 0
    ? resources
    : resources.filter(
        (resource) =>
          resource.category.toLowerCase().includes(inputValue.toLowerCase()) ||
          resource.descriptionandorserviceprovided
            .toLowerCase()
            .includes(inputValue.toLowerCase()) ||
          resource.nameoftheorganisation
            .toLowerCase()
            .includes(inputValue.toLowerCase())
      );
};

const getSuggestionValue = (suggestion) => suggestion.nameoftheorganisation;

const renderSuggestion = (suggestion) => (
  <div>{suggestion.nameoftheorganisation}</div>
);

function ResourceTable({
  columns,
  data,
  isDesktop,
  totalCount,
  onScrollUpdate,
  city,
  category,
  indianstate,
}) {
  const classesPannelSummary = usePanelSummaryStyles();
  const classesPanel = usePanelStyles();
  const classesListItemText = useItemTextStyles();
  const classesPanelDetails = usePanelDetailsStyles();
  const classesList = useListStyles();
  const [expanded, setExpanded] = React.useState(false);
  const defaultColumn = React.useMemo(
    () => ({
      Cell: FormattedCell,
    }),
    []
  );
  const handleExpansionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const [searchValue, setSearchValue] = useState('');
  const [suggestions, setSuggestions] = useState(data);

  const prevIndianState = useRef('');
  const prevCity = useRef('');
  const prevCategory = useRef('');

  useEffect(() => {
    if (
      prevCategory.current === category &&
      prevIndianState.current === indianstate &&
      prevCity.current === city
    ) {
      setSuggestions(getSuggestions(searchValue, data));
    } else {
      setSuggestions(data);
      setSearchValue('');
      prevCategory.current = category;
      prevIndianState.current = indianstate;
      prevCity.current = city;
    }
  }, [searchValue, data, category, indianstate, city]);

  const onChange = (event, {newValue}) => {
    setSearchValue(newValue);
  };

  const onSuggestionsFetchRequested = ({value}) => {
    setSuggestions(getSuggestions(value, data));
  };

  const inputProps = {
    placeholder: '',
    value: searchValue,
    onChange: onChange,
  };

  const renderInputComponent = (inputProps) => (
    <TextField
      id="outlined-number"
      label="Search keyword"
      fullWidth={true}
      InputLabelProps={{
        shrink: true,
      }}
      style={{
        width: '100%',
      }}
      variant="outlined"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchOutlinedIcon style={{fontSize: '0.7rem'}} />
          </InputAdornment>
        ),
      }}
      {...inputProps}
    />
  );

  const parseText = function (text, limit) {
    if (text.length > limit) {
      for (let i = limit; i > 0; i--) {
        if (
          text.charAt(i) === ' ' &&
          (text.charAt(i - 1) !== ',' ||
            text.charAt(i - 1) !== '.' ||
            text.charAt(i - 1) !== ';')
        ) {
          return text.substring(0, i) + '...';
        }
      }
      return text.substring(0, limit) + '...';
    } else return text;
  };

  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows,
  } = useTable({
    columns,
    data: suggestions,
    defaultColumn,
    initialState: {hiddenColumns: 'contact'},
  });

  // Render the UI for your table
  if (isDesktop === true)
    return (
      <>
        <div className="searchbar">
          <Autosuggest
            suggestions={suggestions}
            onSuggestionsFetchRequested={onSuggestionsFetchRequested}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            inputProps={inputProps}
            alwaysRenderSuggestions={true}
            renderInputComponent={renderInputComponent}
          />
        </div>
        <div className="tableandcontrols">
          <InfiniteScroll
            dataLength={data.length}
            hasMore={data.length < totalCount}
            next={onScrollUpdate}
            loader={<h4>Fetching more information, please wait.</h4>}
          >
            <table {...getTableProps()}>
              <thead>
                {headerGroups.map((headerGroup) => (
                  <tr
                    key={headerGroup.id}
                    {...headerGroup.getHeaderGroupProps()}
                  >
                    {headerGroup.headers.map((column, i) => (
                      <th
                        key={column.id}
                        {...column.getHeaderProps()}
                        className={i === 3 ? 'descriptionCol sticky' : 'sticky'}
                      >
                        {column.render('Header')}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                {rows.map((row, i) => {
                  prepareRow(row);
                  return (
                    <tr key={row.id} {...row.getRowProps()}>
                      {row.cells.map((cell, cellindex) => {
                        return (
                          <td key={cellindex} {...cell.getCellProps()}>
                            {cell.render(rendercell)}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </InfiniteScroll>
        </div>
      </>
    );
  else
    return (
      <>
        <div className="searchbar">
          <Autosuggest
            suggestions={suggestions}
            onSuggestionsFetchRequested={onSuggestionsFetchRequested}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            inputProps={inputProps}
            alwaysRenderSuggestions={true}
            renderInputComponent={renderInputComponent}
          />
        </div>
        <div
          className="resourcesaccordion"
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            alignItems: 'center',
          }}
        >
          <InfiniteScroll
            dataLength={data.length}
            hasMore={data.length < totalCount}
            next={onScrollUpdate}
            loader={<h4>Fetching more information, please wait.</h4>}
            style={{width: '100%', maxWidth: '335px', overflow: 'hidden'}} // for large texts
          >
            {rows.map((row, i) => {
              prepareRow(row);
              return (
                <ExpansionPanel
                  key={row.id}
                  classes={{root: classesPanel.root}}
                  expanded={expanded === `panel-${i}`}
                  onChange={handleExpansionChange(`panel-${i}`)}
                >
                  <ExpansionPanelSummary
                    classes={{
                      content: classesPannelSummary.content,
                      root: classesPannelSummary.root,
                    }}
                  >
                    {/* <div className="expanelheading"
                                 style={{display: 'flex',
                                         flexDirection: 'row',
                                         justifyContent: 'space-between',
                                         backgroundColor: 'blue'}}> */}
                    <div
                      className="orgname"
                      style={{
                        maxWidth: '10rem',
                        textAlign: 'start',
                        color: '#201aa2dd',
                      }}
                    >
                      <h6>
                        {parseText(row.values['nameoftheorganisation'], 50)}
                      </h6>
                    </div>
                    <div
                      className="orgcategory"
                      style={{maxWidth: '10.9rem', textAlign: 'end'}}
                    >
                      <h6>{row.values['category']}</h6>
                    </div>
                    {/* </div> */}
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails
                    classes={{root: classesPanelDetails.root}}
                  >
                    <List
                      disablePadding={true}
                      dense={true}
                      classes={{root: classesList.root}}
                    >
                      <ListItem
                        alignItems="flex-start"
                        dense={true}
                        divider={true}
                      >
                        <ListItemText
                          primary="Organisation Name"
                          secondary={row.values['nameoftheorganisation']}
                          classes={{
                            primary: classesListItemText.primary,
                            secondary: classesListItemText.secondary,
                          }}
                        />
                      </ListItem>
                      <ListItem
                        alignItems="flex-start"
                        dense={true}
                        divider={true}
                      >
                        <ListItemText
                          primary="Location"
                          secondary={row.values['city']}
                          classes={{
                            primary: classesListItemText.primary,
                            secondary: classesListItemText.secondary,
                          }}
                        />
                      </ListItem>
                      <ListItem
                        alignItems="flex-start"
                        dense={true}
                        divider={true}
                      >
                        <ListItemText
                          primary="Description"
                          secondary={
                            row.values['descriptionandorserviceprovided']
                          }
                          classes={{
                            primary: classesListItemText.primary,
                            secondary: classesListItemText.secondary,
                          }}
                        />
                      </ListItem>
                      <ListItem
                        alignItems="flex-start"
                        dense={true}
                        divider={true}
                      >
                        <ListItemText
                          primary="Service"
                          secondary={row.values['category']}
                          classes={{
                            primary: classesListItemText.primary,
                            secondary: classesListItemText.secondary,
                          }}
                        />
                      </ListItem>
                      <ListItem
                        alignItems="flex-start"
                        dense={true}
                        divider={true}
                      >
                        <ListItemText
                          primary="Phonenumber"
                          secondary={getFormattedLinkForAccordion(
                            row.values['phonenumber']
                          )}
                          classes={{
                            primary: classesListItemText.primary,
                            secondary: classesListItemText.secondary,
                          }}
                        />
                      </ListItem>
                      <ListItem
                        alignItems="flex-start"
                        dense={true}
                        divider={true}
                      >
                        <ListItemText
                          primary="Website"
                          secondary={getFormattedLinkForAccordion(
                            row.values['contact']
                          )}
                          classes={{
                            primary: classesListItemText.primary,
                            secondary: classesListItemText.secondary,
                          }}
                        />
                      </ListItem>
                    </List>
                  </ExpansionPanelDetails>
                </ExpansionPanel>
              );
            })}
          </InfiniteScroll>
        </div>
      </>
    );
}

export default ResourceTable;
