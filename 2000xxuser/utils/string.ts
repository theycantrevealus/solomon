export const padding_right = function (str, pad = 1, char_pad = ' ') {
  let padd = '';
  for (let a = 1; a <= pad; a++) {
    padd += char_pad;
  }
  return `\x1b[36m ${str}${padd.substring(0, pad - str.length)} \x1b[m`;
};

export const padding_left = function (str, pad = 1, char_pad = ' ') {
  let padd = '';
  for (let a = 1; a <= pad; a++) {
    padd += char_pad;
  }
  return `\x1b[36m ${padd.substring(0, pad - str.length) + str} \x1b[m`;
};
