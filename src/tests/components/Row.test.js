import Row from '../../components/Row';
import {STATE_NAMES} from '../../constants';

import {mount} from 'enzyme';
import React from 'react';
import {MemoryRouter} from 'react-router-dom';

const stateCode = 'AN';
const data = {
  districts: {
    'North and Middle Andaman': {
      total: {
        confirmed: 1,
        recovered: 1,
      },
    },
    'South Andaman': {
      total: {
        confirmed: 32,
        recovered: 32,
      },
    },
  },
  meta: {
    last_updated: '2020-05-22',
    tested: {
      last_updated: '2020-05-22',
      source: 'https://t.me/Covid19india_Auxiliary_Test_Data/117?single',
    },
  },
  total: {
    confirmed: 33,
    recovered: 33,
    tested: 7263,
  },
};

describe('Row component', () => {
  const RealDate = Date;

  const wrapper = mount(
    <MemoryRouter>
      <Row {...{stateCode, data}} />
    </MemoryRouter>
  );

  beforeAll(() => {
    const mockedDate = new Date('2020-05-24');
    global.Date = class extends Date {
      constructor(date) {
        if (date) return new RealDate(date); // because Row component is using new Date()
        return mockedDate;
      }
    };
  });

  afterAll(() => {
    global.Date = RealDate;
  });

  test('State/UT details', () => {
    const stateSelector = wrapper.find('.row').hostNodes();
    const cells = stateSelector.find('.cell');

    const stateName = cells.at(0).text();
    const confirmed = cells.at(1).text();
    const active = cells.at(2).text();
    const recovered = cells.at(3).text();
    const deaths = cells.at(4).text();

    expect(stateSelector).toHaveLength(1);
    expect(cells).toHaveLength(6);
    expect(stateName).toContain(STATE_NAMES[stateCode]);
    expect(confirmed).toEqual('33');
    expect(active).toEqual('0');
    expect(recovered).toEqual('33');
    expect(deaths).toEqual('0');
  });

  test('Districts and the confirmed cases', () => {
    const stateRow = wrapper.find('.row').hostNodes();
    expect(stateRow).toHaveLength(1);

    stateRow.simulate('click');

    const stateLastUpdate = wrapper.find('.last-updated');
    expect(stateLastUpdate.text()).toMatch(/2 days ago/i);

    const districtsSelector = wrapper.find('.district');
    expect(districtsSelector).toHaveLength(2);

    districtsSelector.forEach((e, index) => {
      const cells = e.find('.cell');
      const district = cells.at(0).childAt(0).text();
      const confirmedNumber = cells.at(1).text();

      expect(data.districts[district].total).not.toBeUndefined();
      expect(data.districts[district].total['confirmed']).toEqual(
        parseInt(confirmedNumber)
      );
    });
  });
});
