import React from 'react';
import * as Icon from 'react-feather';
import ReactTooltip from 'react-tooltip';

function TestedToolTip(props) {
  try {
    if (typeof props.id === 'undefined') {
      throw new Error('id not defined for TestedToolTip component');
    }
  } catch (e) {
    console.error(e);
  }
  return (
    <React.Fragment>
      <span className="tooltip-tested" onClick={(e) => e.stopPropagation()}>
        <Icon.Info
          data-for={props.id}
          data-tip="Reporting total samples tested from ICMR data"
          data-event="touchstart mouseover"
          data-event-off="mouseleave"
        />
        <ReactTooltip
          id={props.id}
          place="top"
          type="dark"
          effect="solid"
          multiline={true}
          scrollHide={true}
          globalEventOff="click"
        />
      </span>
    </React.Fragment>
  );
}

export default React.memo(TestedToolTip);
