const getDirtyValues = (dirty, values) =>
  Object.keys(dirty).reduce((acc, key) => {
    if (dirty[key] === true) {
      acc[key] = values[key];
    } else if (typeof dirty[key] === 'object' && values[key] !== undefined) {
      const nested = getDirtyValues(dirty[key], values[key]);
      if (Object.keys(nested).length > 0) {
        acc[key] = nested;
      }
    }
    return acc;
  }, {});

export default getDirtyValues;
