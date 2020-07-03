import Level from '../../components/Level';

import {render} from '@testing-library/react';
import React from 'react';

const data = {
  delta: {
    confirmed: 153,
    deceased: 1,
    recovered: 2,
    tested: 2544,
  },
  meta: {
    tested: {
      last_updated: '2020-03-27',
      source: 'ICMR_website_update_27March_9AM_IST.pdf',
    },
  },
  total: {
    confirmed: 883,
    deceased: 3,
    migrated: 3,
    recovered: 5,
    tested: 27688,
  },
};

test('Level renders total state data', () => {
  const {container} = render(<Level {...{data}} />);

  expect(container).toHaveTextContent(
    'Confirmed+153883Active 872Recovered+25Deceased+13'
  );
});
