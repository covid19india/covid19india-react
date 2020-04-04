import {
  getStatesAndDistrictsFromAPI,
  getStatesAndDistrictsFromMaps,
} from '../testUtils/index';

import staticStatesAndDistrictsFromAPI from '../testUtils/data/statesAndDistrictsFromAPI.json';
import staticStatesAndDistrictsFromMaps from '../testUtils/data/statesAndDistrictsFromMaps.json';

describe('Compare the map and the API', () => {
  describe('with dynamic data', () => {
    test('for any discrepancies', async () => {
      const statesAndDistrictsFromAPI = await getStatesAndDistrictsFromAPI();
      const statesAndDistrictsFromMaps = await getStatesAndDistrictsFromMaps();

      const statesFromAPI = Object.keys(statesAndDistrictsFromAPI);
      const statesFromMaps = Object.keys(statesAndDistrictsFromMaps);

      expect(statesFromAPI).toContain(...statesFromMaps);

      statesFromAPI.forEach((state) => {
        const expectedDistricts = statesAndDistrictsFromMaps[state]?.sort();
        const receivedDistricts = statesAndDistrictsFromAPI[state]?.sort();

        if (expectedDistricts !== undefined)
          expect(expectedDistricts).toContain(...receivedDistricts);
      });
    });
  });

  describe('from stored response for any discrepancies', () => {
    const statesFromAPI = Object.keys(staticStatesAndDistrictsFromAPI);
    const statesFromMaps = Object.keys(staticStatesAndDistrictsFromMaps);
    statesFromAPI.forEach((state) => {
      test(`${state}`, async () => {
        const expectedState = staticStatesAndDistrictsFromMaps[state]?.sort();
        const receivedState = staticStatesAndDistrictsFromAPI[state]?.sort();

        expect(
          statesFromMaps
            .map((e) => e.toLowerCase())
            .indexOf(state.toLowerCase())
        ).not.toEqual(-1);

        const expected = expectedState.filter((e) => e !== 'Unknown').sort();
        const received = receivedState.filter((e) => e !== 'Unknown').sort();

        expect(expected).toContain(...received);
      });
    });
  });
});
