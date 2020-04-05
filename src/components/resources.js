import React, { useState, useEffect } from 'react';
import {
    useTable,
} from 'react-table'
import axios from 'axios';
function ResourceTable({ columns, data }) {
    // Use the state and functions returned from useTable to build your UI
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({
        columns,
        data,
    })

    // Render the UI for your table
    return (
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
                {rows.map((row, i) => {
                    prepareRow(row)
                    return (
                        <tr {...row.getRowProps()}>
                            {row.cells.map(cell => {
                                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                            })}
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
}


function Resources(props) {
    const [columns, setColumns] = useState(['City', 'Category', 'Organisation', 'Description', 'Phone Number', 'Contact']);
    const [data, setData] = useState([]);
    const [fetched, setFetched] = useState(false);
    useEffect(() => {
        if (fetched === false) {
            getResources();
        }
    }, [fetched]);


    const getResources = async () => {
        try {
            const [response] = await Promise.all([
                axios.get('https://api.covid19india.org/resources/resources.json')
            ]);
            console.log(response)
            console.log("Column names are")
            console.log(columns)
            setData(response.data.resources);
            setFetched(true);

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
                Header: 'Phone Number',
                accessor: 'phonenumber'
            },
            {
                Header: 'Contact',
                accessor: 'contact'
            }



        ],
        []
    )
    const memodata = React.useMemo(() => data, [data])
    return (
        <div><h3>here are some useful resource list</h3>
            <ResourceTable columns={memocols} data={memodata} />
        </div>
    )
}



export default Resources;