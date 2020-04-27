import React from 'react';
import * as Icon from 'react-feather';
import ReactTooltip from 'react-tooltip';

export const testedToolTip = (
  <span className="tooltip-tested" onClick={(e) => e.stopPropagation()}>
    <Icon.Info
      data-for="tested"
      data-tip="Reporting total samples tested from ICMR data"
      data-event="touchstart mouseover"
      data-event-off="mouseleave"
    />
    <ReactTooltip
      id="tested"
      place="top"
      type="dark"
      effect="solid"
      multiline={true}
      scrollHide={true}
      globalEventOff="click"
    />
  </span>
);
