import React from 'react';
import {render} from '@testing-library/react';
import Level from '../../components/level';

const state = {
  active: '75',
  confirmed: '83',
  recovered: '5',
  deaths: '3',
  deltaconfirmed: '10',
  deltadeaths: '3',
  deltarecovered: '5',
};

test('Level renders total state data', () => {
  const {container} = render(<Level data={state} />);

  expect(container).toHaveTextContent(
    'Confirmed[+10]83 Active 75Recovered[+5]5 Deceased[+3]3'
  );
});
