const getPropertyOperator = (operator) => {
  switch (operator) {
    case "equals":
      return "===";
    case "notEquals":
      return "!==";
    case "smallerThan":
      return "<";
    case "biggerThan":
      return ">";
    case "includes":
      return "includes";
    case "doesntInclude":
      return "doesntInclude";
    default:
      return "===";
  }
};

const getParameterCaseInsensitive = (object, key) => {
  const asLowercase = key.toLowerCase();
  return object[
    Object.keys(object).filter(function (k) {
      return k.toLowerCase() === asLowercase;
    })[0]
  ];
};

export const filterFeature = (feature, location, filters) => {
  if (filters.length === 0) {
    return true;
  }

  var comparisonOperatorsHash = {
    "<": function (a, b) {
      return a < b.value;
    },
    ">": function (a, b) {
      return a > b.value;
    },
    ">=": function (a, b) {
      return a >= b.value;
    },
    "<=": function (a, b) {
      return a <= b.value;
    },
    "==": function (a, b) {
      return a === b.value;
    },
    "!==": function (a, b) {
      return b.type === "string"
        ? a.toString().trim().toLowerCase() !==
            b.value.toString().trim().toLowerCase()
        : a !== b;
    },
    "===": function (a, b) {
      return b.type === "string"
        ? a.toString().trim().toLowerCase() ===
            b.value.toString().trim().toLowerCase()
        : a === b;
    },
    includes: function (a, b) {
      return (
        b.type === "string" &&
        a
          .toString()
          .trim()
          .toLowerCase()
          .includes(b.value.toString().trim().toLowerCase())
      );
    },
    doesntInclude: function (a, b) {
      return (
        b.type === "string" &&
        !a
          .toString()
          .trim()
          .toLowerCase()
          .includes(b.value.toString().trim().toLowerCase())
      );
    },
  };

  const properties = feature.keyValueProperties;
  const filterMatch = filters.every((filter) => {
    if (location.layerId === filter.layer && filter.type !== "date") {
      const operator = getPropertyOperator(filter.operator);
      var comparisonOperator = comparisonOperatorsHash[operator];
      const value = getParameterCaseInsensitive(properties, filter.property);
      if (value === undefined) return false;
      const doFilter = comparisonOperator(value, filter);
      return doFilter;
    } else if (filter.type === "date") {
      const value = new Date(
        getParameterCaseInsensitive(properties, filter.property)
      );
      const startDate = filter.value.start;
      const endDate = filter.value.end;

      var isAfterStart;
      var isBeforeEnd;

      if (startDate) {
        isAfterStart = value >= startDate;
      }
      if (endDate) {
        isBeforeEnd = value <= endDate;
      }
      return startDate && endDate
        ? isAfterStart && isBeforeEnd
        : isAfterStart || isBeforeEnd;
    } else {
      return true;
    }
  });

  return filterMatch;
};
