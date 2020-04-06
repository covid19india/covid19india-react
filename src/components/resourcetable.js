import React, { useState, useEffect } from 'react';

import {
    useTable,
    usePagination
} from 'react-table';

const FormattedCell = ({
    value: initialValue,
    editable
}) => {
    // We need to keep and update the state of the cell normally
    const [value, setValue] = React.useState(initialValue);
    let reurl1 = /\s*(https?:\/\/.+)\s*/g;
    // let reurl2 = /\s*.*(www\..+)\s*/g
    let reinsta = /\s*Instagram: @(.+)\s*/g;
    let refb = /\s*Facebook: @(.+)\s*/g;

    // If the initialValue is changed externall, sync it up with our state
    React.useEffect(() => {
        let s1 = initialValue.replace(reurl1, '<a href="$1">Link</a>');
        let s2 = s1.replace(reinsta, '<a href="https://www.instagram.com/$1">Instagram: @$1</a>');
        let s3 = s2.replace(refb, '<a href="https://www.facebook.com/$1">Facebook: @$1</a>');
        // let s4 = s3.replace(reurl2, '<a href="http://$1">Link</a>');
        setValue(s3);
    }, [initialValue, reurl1, refb, reinsta])

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
        initialState: { pageIndex: 0, pageSize: 10 },
        
    },usePagination)

    // Render the UI for your table
    return (
        <div className="tableandcontrols">
            <table {...getTableProps()}>
                <thead>
                    {headerGroups.map(headerGroup => (
                        <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
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
                            <tr key={row.id} {...row.getRowProps()}>
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
                    {[5, 10, 20, 30, 40, 50].map(pageSize => (
                        <option key={pageSize} value={pageSize}>
                            Show {pageSize}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    )
}

export default ResourceTable;