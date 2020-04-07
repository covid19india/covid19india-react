const months = {
  '01': 'Jan',
  '02': 'Feb',
  '03': 'Mar',
  '04': 'Apr',
  '05': 'May',
  '06': 'Jun',
  '07': 'Jul',
  '08': 'Aug',
  '09': 'Sep',
  '10': 'Oct',
  '11': 'Nov',
  '12': 'Dec',
};

export const formatDate = (unformattedDate) => {
  const day = unformattedDate.slice(0, 2);
  const month = unformattedDate.slice(3, 5);
  const year = unformattedDate.slice(6, 10);
  const time = unformattedDate.slice(11);
  return `${year}-${month}-${day}T${time}+05:30`;
};

export const formatDateAbsolute = (unformattedDate) => {
  const day = unformattedDate.slice(0, 2);
  const month = unformattedDate.slice(3, 5);
  const time = unformattedDate.slice(11);
  return `${day} ${months[month]}, ${time.slice(0, 5)} IST`;
};

export const validateCTS = (data = []) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dataTypes = [
    'dailyconfirmed',
    'dailydeceased',
    'dailyrecovered',
    'totalconfirmed',
    'totaldeceased',
    'totalrecovered',
  ];
  return data
    .filter((d) => dataTypes.every((dt) => d[dt]) && d.date)
    .filter((d) => dataTypes.every((dt) => Number(d[dt]) >= 0))
    .filter((d) => {
      const year = today.getFullYear();
      return new Date(d.date + year) < today;
    });
};

export const parseCountryTimeSeries = (t) => {
  return t.reduce(
    (a, c) => {
      const date = new Date(c.date + '2020');
      a.cumulative.c.push({date, count: +c.totalconfirmed});
      a.cumulative.r.push({date, count: +c.totalrecovered});
      a.cumulative.d.push({date, count: +c.totaldeceased});
      a.daily.c.push({date, count: +c.dailyconfirmed});
      a.daily.r.push({date, count: +c.dailyrecovered});
      a.daily.d.push({date, count: +c.dailydeceased});
      return a;
    },
    {cumulative: {c: [], r: [], d: []}, daily: {c: [], r: [], d: []}}
  );
};

export const parseStateTimeSeries = (stateWise) => {
  const states = Object.keys(stateWise[0]).reduce((a, c) => {
    if (c === 'date' || c === 'status') return a;
    a[c] = {
      daily: {c: [], r: [], d: []},
      cumulative: {c: [], r: [], d: []},
    };
    return a;
  }, {});

  stateWise.forEach((i) => {
    const date = new Date(i.date + '20');
    Object.keys(states).forEach((s) => {
      if (i.status === 'Confirmed') {
        states[s].daily.c.push({count: +i[s], date});
        states[s].cumulative.c.push({date});
      }
      if (i.status === 'Recovered') {
        states[s].daily.r.push({count: +i[s], date});
        states[s].cumulative.r.push({date});
      }
      if (i.status === 'Deceased') {
        states[s].daily.d.push({count: +i[s], date});
        states[s].cumulative.d.push({date});
      }
    });
  });
  Object.values(states).forEach((s) => {
    const {c, r, d} = s.cumulative;
    const {c: c1, r: r1, d: d1} = s.daily;
    c[0].count = c1[0].count;
    r[0].count = r1[0].count;
    d[0].count = d1[0].count;
    for (let i = 1, j = 0; i < c1.length; i++, j++) {
      c[i].count = c[j].count + c1[i].count;
      r[i].count = r[j].count + r1[i].count;
      d[i].count = d[j].count + d1[i].count;
    }
  });
  return states;
};
