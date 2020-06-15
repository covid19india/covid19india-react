import produce from 'immer';

export const getDistricts = (data) => {
  let districts = {};

  Object.keys(data).map((stateCode) => {
    Object.keys(data[stateCode]?.districts || {}).map((districtName) => {
      districts = produce(districts || {}, (draftDistricts) => {
        draftDistricts[districtName] = data[stateCode].districts[districtName];
      });
      return null;
    });
    return null;
  });

  postMessage(districts);
};
