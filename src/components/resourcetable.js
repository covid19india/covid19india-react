import TableAccordion from './Essentials/essentialsaccordionmobile';
import {
  // renderCell,
  getHighlightedText,
  getFormattedLink,
  getSuggestions,
  getSuggestionValue,
  renderSuggestion,
} from './Essentials/essentialsutls';

import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import React, {useState, useEffect, useRef} from 'react';
import Autosuggest from 'react-autosuggest';
import * as Icon from 'react-feather';
import InfiniteScroll from 'react-infinite-scroll-component';
import {useTable} from 'react-table';

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
  const [searchValue, setSearchValue] = useState('');
  const [suggestions, setSuggestions] = useState(data);
  const prevIndianState = useRef('');
  const prevCity = useRef('');
  const prevCategory = useRef('');

  const renderCell = (celli) => {
    const value = celli.cell.value;
    let renderedvalue = '';
    const link = celli.row.allCells[5].value.split(',')[0];

    if (celli.column.id === 'contact')
      renderedvalue = getFormattedLink(
        getHighlightedText(value, searchValue, 'desktop')
      );
    else if (celli.column.id === 'phonenumber') {
      // renderedvalue = String(JSON.parse(JSON.stringify(getNumbersLink(value))).numberList).replace(/,/g, '<br>');
      renderedvalue = getFormattedLink(
        getHighlightedText(value, searchValue, 'desktop')
      );
    } else if (celli.column.id === 'nameoftheorganisation') {
      if (link !== '')
        renderedvalue = `<a href=${link} target="_blank">${getHighlightedText(
          value,
          searchValue,
          'desktop'
        )}</a>`;
      else renderedvalue = getHighlightedText(value, searchValue, 'desktop');
    } else renderedvalue = getHighlightedText(value, searchValue, 'desktop');

    return (
      <div
        className="tablecelldata"
        dangerouslySetInnerHTML={{
          __html: renderedvalue,
        }}
      ></div>
    );
  };

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

  useEffect(() => {
    if (suggestions.length === 0 && suggestions.length < totalCount) {
      onScrollUpdate();
    }
  }, [suggestions, totalCount, onScrollUpdate]);

  const onChange = (event, {newValue}) => {
    setSearchValue(newValue);
  };

  // const onSuggestionsFetchRequested = ({value}) => {
  //   setSuggestions(getSuggestions(value, data));
  // };

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
            <Icon.Search size="0.9em" />
          </InputAdornment>
        ),
      }}
      {...inputProps}
    />
  );

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
    initialState: {hiddenColumns: 'contact'},
  });
  return (
    <React.Fragment>
      <div className="searchbar">
        <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={() => {}}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={renderSuggestion}
          inputProps={inputProps}
          alwaysRenderSuggestions={true}
          renderInputComponent={renderInputComponent}
        />
      </div>
      <InfiniteScroll
        dataLength={suggestions.length}
        hasMore={suggestions.length < totalCount}
        next={onScrollUpdate}
        loader={
          <h3 style={{textAlign: 'center'}}>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/d/dd/Loading-gif-builder-comwrap.gif"
              alt="Loading data"
            />
          </h3>
        }
        style={
          isDesktop
            ? {width: '100%', overflow: 'none'}
            : {width: '100%', overflow: 'none', maxWidth: '300px'}
        }
      >
        <div className="tableandaccordions">
          {isDesktop && (
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
                            {cell.render(renderCell)}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
          {!isDesktop && (
            <TableAccordion rows={rows} searchValue={searchValue} />
          )}
        </div>
      </InfiniteScroll>
    </React.Fragment>
  );
}

export default ResourceTable;
