import React, { useState, useEffect } from 'react';
import {
    useTable,
    usePagination
} from 'react-table';
import axios from 'axios';

const FormattedCell = ({
    value: initialValue,
    editable
}) => {
    // We need to keep and update the state of the cell normally
    const [value, setValue] = React.useState(initialValue);
    let reurl = /\s*(https?:\/\/.+)\s*/g;
    let reinsta = /\s*Instagram: @(.+)\s*/g;
    let refb = /\s*Facebook: @(.+)\s*/g;

    // If the initialValue is changed externall, sync it up with our state
    React.useEffect(() => {
        let s1 = initialValue.replace(reurl, '<a href="$1">Link</a>');
        let s2 = s1.replace(reinsta, '<a href="https://www.instagram.com/$1">Instagram: @$1</a>');
        let s3 = s2.replace(refb, '<a href="https://www.facebook.com/$1">Facebook: @$1</a>')
        setValue(s3);
    }, [initialValue, reurl, refb, reinsta])

    return (
        <div className="tablecelldata" dangerouslySetInnerHTML={{
            __html:
                value
        }}></div>
    )
}

function ResourceTable({ columns, data }) {
    const defaultColumn = React.useMemo(
        () => ({
            // Let's set up our default Filter UI
            //   Filter: DefaultColumnFilter,
            // And also our default editable cell
            Cell: FormattedCell,
        }),
        []
    )

    // Use the state and functions returned from useTable to build your UI
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: { pageIndex, pageSize },
    } = useTable({
        columns,
        data,
        defaultColumn,
        initialState: { pageIndex: 0 },
        
    },usePagination)

    // Render the UI for your table
    return (
        <div className="tableandcontrols">
            <table {...getTableProps()}>
                <thead>
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {page.map((row, i) => {
                        prepareRow(row)
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map(cell => {
                                    return <td {...cell.getCellProps()}>{cell.render('Cell', { editable: false })}</td>
                                })}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            <div className="pagination">
                <div className="paginationbutton">
                    <button className="button is-purple" onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                        {'\u003c\u003c'}
                    </button>{' '}
                    <button className="button is-purple" onClick={() => previousPage()} disabled={!canPreviousPage}>
                        {'<'}
                    </button>{' '}
                    <button className="button is-purple" onClick={() => nextPage()} disabled={!canNextPage}>
                        {'>'}
                    </button>{' '}
                    <button className="button is-purple" onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                        {'>>'}
                    </button>{' '}
                </div>
                <h5 style={{color: '#201aa299'}}>
                    Page{' '}
                    <strong>
                        {pageIndex + 1} of {pageOptions.length}
                    </strong>{' '}
                </h5>
                {/* <h5 style={{marginLeft:'0.2rem'}}>
                     Go to page:{' '}
                </h5> */}
                    <input
                        type="number"
                        defaultValue={pageIndex + 1}
                        onChange={e => {
                            const page = e.target.value ? Number(e.target.value) - 1 : 0
                            gotoPage(page)
                        }}
                    />
                
                <select className="select"
                    value={pageSize}
                    onChange={e => {
                        setPageSize(Number(e.target.value))
                    }}
                >
                    {[10, 20, 30, 40, 50].map(pageSize => (
                        <option key={pageSize} value={pageSize}>
                            Show {pageSize}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    )
}

function Resources(props) {
    const [data, setData] = useState([]);
    const [fetched, setFetched] = useState(false);
    const [city, setCity] = useState('');
    const [category, setCategory] = useState(null);
    const [indianstate, setIndianState] = useState('');
    const [resourcedict, setResourceDict] = useState({});
    const [showTable, setShowTable] = useState(false);

    useEffect(() => {
        if (fetched === false) {
            getResources();
        }
    }, [fetched, data, resourcedict]);


    const getResources = async () => {
        try {
            const [response] = await Promise.all([
                axios.get('https://api.covid19india.org/resources/resources.json')
            ]);
            // console.log(response)
            // console.log("Column names are")
            // console.log(columns)
            // setData(response.data.resources);
            const hashmap = {};
            response.data.resources.forEach((x) => {
                // console.log(x)
                if (typeof hashmap[x['state']] === 'undefined') hashmap[x['state']] = {};
                if (typeof hashmap[x['state']][x['city']] === 'undefined') hashmap[x['state']][x['city']] = {};
                if (typeof hashmap[x['state']][x['city']][x['category']] === 'undefined') hashmap[x['state']][x['city']][x['category']] = [];
                if (Array.isArray(hashmap[x['state']][x['city']][x['category']])) hashmap[x['state']][x['city']][x['category']].push(x);

            })

            setResourceDict(hashmap);
            // setIndianState(Object.keys()[0]);
            setFetched(true);
            // console.log(resourcedict);
        } catch (err) {
            console.log(err);
        }
    };
    const memocols = React.useMemo(() =>
        [
            {
                Header: 'City',
                accessor: 'city'
            },
            {
                Header: 'Category',
                accessor: 'category'
            },
            {
                Header: 'Organisation',
                accessor: 'nameoftheorganisation'
            },
            {
                Header: 'Description',
                accessor: 'descriptionandorserviceprovided'
            },
            {
                Header: 'Phone',
                accessor: 'phonenumber'
            },
            {
                Header: 'Website',
                accessor: 'contact'
            }



        ],
        []
    )
    // const memodata = React.useMemo(() => data, [data])

    const getCityOptions = function () {
        if (indianstate) {
            return Object.keys(resourcedict[indianstate]).sort().map((x) => <option value={x}>{x}</option>)
        }
        else return [];
        // return getCityList().map((x) => <option value={x}>{x}</option>)
    }
    const getIndianStateOptions = function () {
        // let defaultOption = ['Please select']
        return Object.keys(resourcedict).sort().map((x) => <option value={x}>{x}</option>)
    }
    const getCategoryOptions = function () {
        if (indianstate && city) {
            return Object.keys(resourcedict[indianstate][city]).sort().map((x) => <option value={x}>{x}</option>)
        }
        else return [];
    }

    const filterTable = function () {
        console.log('Search Button Pressed');
        console.log(`Filters are: ${indianstate} ---> ${city} ----> ${category}`);
        let a = [];
        if (category === 'all') {
            console.log("All category selected");
            Object.values(resourcedict[indianstate][city]).forEach((x) => {
                x.forEach((y) => a.push(y));
            })
        }
        else {
            console.log(`Category chosen ${category}`);
            a = resourcedict[indianstate][city][category];
        }
        resourcedict['PAN India']['Multiple']['CoVID-19 Testing Lab'].forEach(element => {
            a.push(element);

        });
        setData(a);
        // console.log(resourcedict[indianstate][city][category]);
        // console.log(data);
        setShowTable(true);
    }

    const changeIndianState = function (changedstateevent) {
        setCity('');
        setCategory('');
        // console.log(changedstateevent.target.value);
        setIndianState(changedstateevent.target.value);
    }
    const changeCity = function (changedcityevent) {
        setCategory('');
        setCity(changedcityevent.target.value);
        // console.log(changedcityevent.target.value);
    }
    const changeCategory = function (changedcategoryevent) {
        setCategory(changedcategoryevent.target.value);
        // console.log(changedcategoryevent.target.value);
    }
    return (
        <div className="Resources">
            <div className='filtersection'>
                <div className='filtertitle'>
                    <h3>Please apply the filters to get corresponding resources</h3>

                </div>
                <div className='resourcefilters'>
                    <div className='resourcefilter'>
                        {/* <label for='stateselect1' className='filterlabel'>
                            State
                        </label> */}
                        <select id="stateselect1" onChange={changeIndianState}>
                            <option value="" selected>Choose State</option>
                            {getIndianStateOptions()}
                        </select>
                    </div>
                    <div className='resourcefilter'>
                        {/* <label for='cityselect1' className='filterlabel'>
                            City
                        </label> */}
                        <select id="cityselect1" onChange={changeCity}>
                            <option value="" selected disabled hidden>Choose City</option>

                            {getCityOptions()}
                        </select>
                    </div>
                    <div className='resourcefilter'>
                        {/* <label for='categoryselect' className='filterlabel'>
                            Category
                        </label> */}
                        <select id="categoryselect" onChange={changeCategory}>
                            <option value="" selected disabled hidden>Choose Category</option>
                            <option value="all">All Categories</option>
                            {getCategoryOptions()}
                        </select>
                    </div>
                    <div className='resourcefilter'>
                        <button className='button is-purple'
                            onClick={filterTable}>Search</button>
                    </div>
                </div>

            </div>
            <br></br>
            <div className='TableArea'>
                {showTable && <ResourceTable columns={memocols} data={data} />}
            </div>

        </div>
    )
}



export default Resources;