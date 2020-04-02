import React from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';

const ExpansionPanelItem = (props) => {
  const rows = [];
  const links = [];
  props.props.content !== undefined &&
    Object.entries(props.props.content).forEach(([key, value]) => {
      rows.push({key, value});
    });
  props.props.links !== undefined &&
    Object.entries(props.props.links).forEach(([key, value]) => {
      links.push({key, value});
    });
  return (
    <div>
      <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography>{props.props.heading}</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <TableContainer>
            <Table aria-label="simple table" size="small">
              <TableBody>
                {rows.length > 0 &&
                  rows.map((row) => (
                    <TableRow key={row.key}>
                      <TableCell align="left">{row.key}</TableCell>
                      <TableCell align="left">{row.value}</TableCell>
                    </TableRow>
                  ))}
                {links.length > 0 &&
                  links.map((row) => (
                    <TableRow key={row.key}>
                      <TableCell align="left">{row.key}</TableCell>
                      <TableCell align="left">
                        <a
                          href={row.value}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Click Here
                        </a>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  );
};
export default ExpansionPanelItem;
