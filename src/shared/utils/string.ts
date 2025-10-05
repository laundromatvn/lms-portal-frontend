export const capitalize = (str: string) => {
  // PENDING_SETUP -> Pending Setup
  // BUSY -> Busy
  // STARTING -> Starting
  // OUT_OF_SERVICE -> Out of Service
  // ERROR -> Error
  // SUCCESS -> Success
  // INACTIVE -> Inactive
  // ACTIVE -> Active
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export const toCamelCase = (str: string) => {
  const value = str.replace(/_/g, ' ').toLowerCase();
  const tokens = value.split(' ');
  for (let i = 0; i < tokens.length; i++) {
    tokens[i] = tokens[i].charAt(0).toUpperCase() + tokens[i].slice(1);
  }
  return tokens.join(' ');
}
