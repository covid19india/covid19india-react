import TableAccordion from './Essentials/essentialsaccordionmobile';
import {
  // renderCell,
  getHighlightedText,
  getFormattedLink,
} from './Essentials/essentialsutls';

import React from 'react';
// import Autosuggest from 'react-autosuggest';
import InfiniteScroll from 'react-infinite-scroll-component';
import {useTable} from 'react-table';

function ResourceTable({
  columns,
  data,
  isDesktop,
  totalCount,
  onScrollUpdate,
  searchValue,
}) {
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

  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows,
  } = useTable({
    columns,
    data,
    initialState: {hiddenColumns: 'contact'},
  });
  return (
    <React.Fragment>
      <InfiniteScroll
        dataLength={data.length}
        hasMore={data.length < totalCount}
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
        endMessage={
          <div>
            {!data.length && (
              <h3 style={{textAlign: 'center'}}>No Results Found</h3>
            )}
          </div>
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
