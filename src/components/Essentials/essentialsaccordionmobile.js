import {
  getFormattedLinkForAccordion,
  parseText,
  getHighlightedText,
} from './essentialsutls';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import {makeStyles} from '@material-ui/core/styles';
import React from 'react';

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

function TableAccordion({rows, searchValue}) {
  const classesPannelSummary = usePanelSummaryStyles();
  const classesPanel = usePanelStyles();
  const classesListItemText = useItemTextStyles();
  const classesPanelDetails = usePanelDetailsStyles();
  const classesList = useListStyles();
  const [expanded, setExpanded] = React.useState(false);
  const handleExpansionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  return (
    <React.Fragment>
      {rows.map((row, i) => {
        return (
          <ExpansionPanel
            key={i}
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
              <div
                className="orgname"
                style={{
                  maxWidth: '10rem',
                  textAlign: 'start',
                  color: '#201aa2dd',
                }}
              >
                <h6>{parseText(row.values['nameoftheorganisation'], 50)}</h6>
              </div>
              <div
                className="orgcategory"
                style={{maxWidth: '10.9rem', textAlign: 'end'}}
              >
                <h6>{row.values['category']}</h6>
              </div>
              {/* </div> */}
            </ExpansionPanelSummary>
            <ExpansionPanelDetails classes={{root: classesPanelDetails.root}}>
              <List
                disablePadding={true}
                dense={true}
                classes={{root: classesList.root}}
              >
                <ListItem alignItems="flex-start" dense={true} divider={true}>
                  <ListItemText
                    primary="Organisation Name"
                    secondary={getHighlightedText(
                      row.values['nameoftheorganisation'],
                      searchValue,
                      'mobile'
                    )}
                    classes={{
                      primary: classesListItemText.primary,
                      secondary: classesListItemText.secondary,
                    }}
                    secondaryTypographyProps={{
                      component: 'a',
                      href: row.values.contact,
                      target: '_blank',
                      rel: 'noopener noreferrer',
                      color: 'blue',
                    }}
                  />
                </ListItem>
                <ListItem alignItems="flex-start" dense={true} divider={true}>
                  <ListItemText
                    primary="Location"
                    secondary={getHighlightedText(
                      row.values['city'],
                      searchValue,
                      'mobile'
                    )}
                    classes={{
                      primary: classesListItemText.primary,
                      secondary: classesListItemText.secondary,
                    }}
                  />
                </ListItem>
                <ListItem alignItems="flex-start" dense={true} divider={true}>
                  <ListItemText
                    primary="Description"
                    secondary={getHighlightedText(
                      row.values['descriptionandorserviceprovided'],
                      searchValue,
                      'mobile'
                    )}
                    classes={{
                      primary: classesListItemText.primary,
                      secondary: classesListItemText.secondary,
                    }}
                  />
                </ListItem>
                <ListItem alignItems="flex-start" dense={true} divider={true}>
                  <ListItemText
                    primary="Service"
                    secondary={getHighlightedText(
                      row.values['category'],
                      searchValue,
                      'mobile'
                    )}
                    classes={{
                      primary: classesListItemText.primary,
                      secondary: classesListItemText.secondary,
                    }}
                  />
                </ListItem>
                <ListItem alignItems="flex-start" dense={true} divider={true}>
                  <ListItemText
                    primary="Phonenumber"
                    secondary={getFormattedLinkForAccordion(
                      row.values['phonenumber']
                    )}
                    classes={{
                      primary: classesListItemText.primary,
                      secondary: classesListItemText.secondary,
                    }}
                    secondaryTypographyProps={{component: 'span'}}
                  />
                </ListItem>
              </List>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        );
      })}
    </React.Fragment>
  );
}

export default TableAccordion;
