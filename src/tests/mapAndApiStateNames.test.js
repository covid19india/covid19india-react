import {
  getStatesAndDistrictsFromAPI,
  getStatesAndDistrictsFromMaps,
} from './utils/index';

describe('Compare the map and the API states and districts', () => {
  test('for any discrepancies', async () => {
    const statesAndDistrictsFromAPI = await getStatesAndDistrictsFromAPI();
    const statesAndDistrictsFromMaps = await getStatesAndDistrictsFromMaps();

    const statesFromAPI = Object.keys(statesAndDistrictsFromAPI);
    const statesFromMaps = Object.keys(statesAndDistrictsFromMaps);

    expect(statesFromAPI).toContain(...statesFromMaps);

    statesFromAPI.forEach((state) => {
      const expectedDistricts = statesAndDistrictsFromMaps[state]?.sort();
      const receivedDistricts = statesAndDistrictsFromAPI[state]?.sort();

      if (expectedDistricts !== undefined && receivedDistricts.length !== 0) {
        expect(expectedDistricts).toContain(...receivedDistricts);
      }
    });
  });
});
