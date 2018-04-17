export const patterns = {
  password: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,8}$/,
  email: /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/,
};

export const hourlyDefaultFormat = '%H:%M';

export const xAxisCommon = {
  'tick': {
    'useTimeInterval': false,
    'timeInterval': 'timeMinute',
    'interval': 10,
    'padding': 10,
    'timeFormat': '%x',
  },
  'grid': {
    'style': 'solid',
    'color': '#f0f3f7',
    'strokeWidth': 1,
  },
  'lineStyle': {
    'color': '#f0f3f7',
    'strokeWidth': 1,
  },
  'textStyle': {
    'color': '#c2c9d5',
    'foneSize': 12,
  },
};
