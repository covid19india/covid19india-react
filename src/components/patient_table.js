import React, {useState} from "react";
import { Link } from "react-router-dom";

import {
  useTable,
  useFilters,
  useSortBy,
  usePagination
} from 'react-table';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faChevronRight,
    faAngleDoubleRight,
    faChevronLeft,
    faAngleDoubleLeft,
    faSort,
    faSortAmountDown,
    faSortAmountDownAlt,
    faCaretRight,
    faCaretDown,
} from '@fortawesome/free-solid-svg-icons'
import ExtraDetails from './extradetails';


function Table({columns, data}) {
  const {
    getTableProps,
    getTableBodyProps,
    headers,
    prepareRow,
    pageOptions,
    page,
    state: { pageIndex, pageSize },
    gotoPage,
    previousPage,
    nextPage,
    canPreviousPage,
    canNextPage,
    pageCount,
    setPageSize,
  } = useTable({
      columns, data, initialState: {
        sortBy: [{ id: 'diagnosed_date', desc: true }],
        pageSize: 20
      }
    },
    useSortBy,
    usePagination);

  const [openCard, setOpenCard] = useState(null);
  
  function toggleCard(id) {
    if (openCard === id){
      setOpenCard(null);
      return;
    }
    setOpenCard(id);
  }

  return (
    <div className="table-responsive">
      <table {...getTableProps()} className="table">
        <thead>
        <tr>
          <th></th>
          {headers.map(column => (
            <th {...column.getHeaderProps(column.getSortByToggleProps())}>
              <span className="mr-2">
                {column.render('Header')}
              </span>
              <i className="d-inline">
              {
                column.isSorted ?
                  (column.isSortedDesc ?
                    <FontAwesomeIcon icon={faSortAmountDown} className="text-orange" />:
                    <FontAwesomeIcon icon={faSortAmountDownAlt} className="text-orange" />
                ) : <FontAwesomeIcon icon={faSort} className="text-gray"/>
              }
              </i>
            </th>
          ))}
        </tr>
        </thead>
        <tbody {...getTableBodyProps()}>
        {page.map((row, i) => {
          prepareRow(row);
          return (
            <React.Fragment>
            <tr {...row.getRowProps()}>
              <td className="expand" onClick={() => toggleCard(row.values.patientnumber)}>
                {
                  openCard === row.values.patientnumber ? 
                  <FontAwesomeIcon icon={faCaretDown} /> :
                  <FontAwesomeIcon icon={faCaretRight} />
                }
              </td>
              {row.cells.map(cell => {
                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
              })}
            </tr>
            {
              openCard === row.values.patientnumber ?
                <tr className="detail-row">
                  <td colSpan={9}>
                    <ExtraDetails patient={data.find(p => p.patientnumber == row.values.patientnumber)} />
                  </td>
                </tr>: null
            }
            </React.Fragment>
          )
        })}
        </tbody>
      </table>

      <div className="row align-items-baseline border-top p-2 justify-content-center">

        <div className="col-12 col-md-4 text-center text-md-left">
          Go to page{' '}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page)
            }}
            style={{ width: '4rem' }}
            className="form-control form-control-sm d-inline ml-2"
            min={1}
            max={pageOptions.length}
          />
          <span className="ml-2">
              of {pageOptions.length}
          </span>
        </div>

        <div className="col-12 col-md-4 my-3 my-sm-auto">
          <ul className="pagination justify-content-center mt-0 p-0">
            <li className="page-item">
              <button className="page-link" onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                <FontAwesomeIcon icon={faAngleDoubleLeft} />
              </button>
            </li>
            <li className="page-item">
              <button className="page-link"  onClick={() => previousPage()} disabled={!canPreviousPage}>
                <FontAwesomeIcon icon={faChevronLeft} />
              </button>
            </li>
            <li className="page-item">
              <button className="page-link" onClick={() => nextPage()} disabled={!canNextPage}>
                <FontAwesomeIcon icon={faChevronRight} />
              </button>
            </li>
            <li className="page-item">
              <button className="page-link" onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                <FontAwesomeIcon icon={faAngleDoubleRight} />
              </button>
            </li>
          </ul>
        </div>

        <div className="col-12 col-md-4 text-center text-md-right">
          <span className="mr-2">Show</span>
          <select
            value={pageSize}
            onChange={e => {
              setPageSize(Number(e.target.value))
            }}
            className="form-control form-control-sm d-inline"
            style={{ width: '5rem' }}
          >
            {[10, 20, 30, 40, 50].map(pageSize => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
          <span className="mx-2">per page</span>
        </div>

      </div>
    </div>
  );
}

function PatientTable({ patients }) {
  const columns = React.useMemo(()=> [
      {
        Header: 'ID',
        accessor: 'patientnumber',
      }, {
        Header: 'Announced on',
        accessor: 'dateannounced',
      }, {
        Header: 'Age',
        accessor: 'agebracket',
        sortType: 'basic'
      }, {
        Header: 'Gender',
        accessor: 'gender'
      }, {
        Header: 'City',
        accessor: 'detectedcity'
      }, {
        Header: 'District',
        accessor: 'detecteddistrict'
      }, {
        Header: 'State',
        accessor: 'detectedstate'
      }, {
        Header: 'Status',
        accessor: 'currentstatus'
      }],
    []
  );
  const data = React.useMemo(() => (patients), [patients]);

  return <Table columns={columns} data={data} />;
}

export default PatientTable