import Level from '../../components/level';

import {render} from '@testing-library/react';
import React from 'react';

const state = {
  active: '80',
  confirmed: '86',
  recovered: '7',
  deaths: '4',
  deltaconfirmed: '10',
  deltadeaths: '3',
  deltarecovered: '5',
};

test('Level renders total state data', () => {
  const {container} = render(<Level data={state} />);

  expect(container).toHaveTextContent(
    'Confirmed[+10]86 Active 80Recovered[+5]7 Deceased[+3]4'
  );
});
