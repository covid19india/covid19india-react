import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Popover from '@material-ui/core/Popover';
import Select from '@material-ui/core/Select';
import {makeStyles} from '@material-ui/core/styles';
import React from 'react';
import * as Icon from 'react-feather';

const useFormControlStyles = makeStyles((isDesktop) => {
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
const useInputLabelStyles = makeStyles(() => ({
  root: {
    fontFamily: 'archia',
    fontSize: '11px !important',
    fontWeight: 600,
    textTransform: 'uppercase',
  },
}));

const useMenuItemStyles = makeStyles(() => ({
  root: {
    fontFamily: 'archia',
    fontSize: '11px !important',
    fontWeight: 600,
    textTransform: 'uppercase',
  },
}));
const usePopOverStyles = makeStyles(() => ({
  root: {
    backgroundColor: '#201aa220',
    zIndex: '1000',
  },
}));
function FiltersDesktop(props) {
  const classesFormControl = useFormControlStyles();
  const classesInputLabel = useInputLabelStyles();
  const classesMenuItem = useMenuItemStyles();
  const classesPopOver = usePopOverStyles();
  return (
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
          className="button desktop-disclaimer-button"
          style={{
            margin: '0rem',
            padding: '0.3rem',
            alignItems: 'center',
            justifyContent: 'space-around',
          }}
          onClick={props.handleDisclaimerClick}
        >
          Disclaimer
          <Icon.AlertCircle htmlColor="#6c757d" fontSize="0.2rem" />
        </div>
        <Popover
          id={props.disclaimerid}
          open={props.isDisclaimerOpen}
          classes={{root: classesPopOver.root}}
          anchorEl={props.anchorEl}
          onClose={props.handleDisclaimerClose}
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
              We are a community sourced listing platform and are not associated
              with any of the organisations listed below.
            </p>
            <p>
              Although we verify all our listings, we request you to follow all
              the guidelines and take necessary precautions.
            </p>
            <p>
              We encourage you to report any error or suspicious activity so we
              can take immediate action.
            </p>
          </h6>
        </Popover>
      </div>
      <div className="resourcefilters">
        <FormControl
          variant="outlined"
          size="small"
          className="resourcefilterDesktop"
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
            value={props.indianstate}
            onChange={props.changeIndianState}
            label="State/UT"
            classes={{root: classesMenuItem.root}}
          >
            <option value="all" classes={{root: classesMenuItem.root}}>
              All states
            </option>
            {props.stateoptions}
          </Select>
        </FormControl>
        <FormControl
          variant="outlined"
          size="small"
          className="resourcefilterDesktop"
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
            value={props.city}
            onChange={props.changeCity}
            label="City"
            classes={{root: classesMenuItem.root}}
          >
            <option value="all" classes={{root: classesMenuItem.root}}>
              All cities
            </option>
            {props.cityoptions}
          </Select>
        </FormControl>
        <FormControl
          variant="outlined"
          size="small"
          className="resourcefilteDesktop"
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
            value={props.category}
            onChange={props.changeCategory}
            label="Services"
            classes={{root: classesMenuItem.root}}
          >
            <option value="all" classes={{root: classesMenuItem.root}}>
              All categories
            </option>
            {props.servicesoptions}
          </Select>
        </FormControl>
        <button
          className="button is-purple search-button-mobile"
          onClick={props.filterTable}
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
          onClick={props.openSharingTray}
          className="button add-entry is-purple"
          style={{margin: '0rem 0.2rem', padding: '0.4rem'}}
        >
          <span>Share</span>
        </button>
      </div>
    </React.Fragment>
  );
}

export default FiltersDesktop;
