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

// string arvot
export const getCQLStringPropertyOperator = (property, operator, value) => {
  switch (operator) {
    case "equals":
      return "strToLowerCase(" + property + ")" + " = " + "'" + value.toString().trim().toLowerCase() + "'" ;
    case "notEquals":
      return "strToLowerCase(" + property + ")" + " <> " + "'" + value.toString().trim().toLowerCase() + "'" ;
    case "includes":
      return "strToLowerCase(" + property + ")" + " LIKE " + "'%" + value.toString().trim().toLowerCase() + "%'" ;
    case "doesntInclude":
      return "strToLowerCase(" + property + ")" + " NOT LIKE " + "'%" + value.toString().trim().toLowerCase() + "%'" ;
    default:
      return property + " = " + "'" + value.toString().trim().toLowerCase() + "'" ;
  }
};

// string arvot
export const getCQLDatePropertyOperator = (property, value) => {
  var options = { year: 'numeric', month: 'long', day: 'numeric' };
  if (value.start && value.end) {
    return "strToLowerCase(" + property + ")" + " > " + "dateParse('MMM d, yyyy','" + value.start.toLocaleDateString("en-EN", options) + "')" + " AND " + "strToLowerCase(" + property + ")" + " < " + "dateParse('MMM d, yyyy','" + value.end.toLocaleDateString("en-EN", options) + "')"
  } else if (value.start && !value.end) {
    return "strToLowerCase(" + property + ")" + " > " + "dateParse('MMM d, yyyy','" + value.start.toLocaleDateString("en-EN", options) + "')" ;
  } else if (!value.start && value.end) {
    return "strToLowerCase(" + property + ")" + " < " + "dateParse('MMM d, yyyy','" + value.end.toLocaleDateString("en-EN", options) + "')" ;
  }
};

// number arvot
export const getCQLNumberPropertyOperator = (property, operator, value) => {
  switch (operator) {
    case "equals":
      return property + " = " + value
    case "notEquals":
      return property + " <> " + value;
    case "smallerThan":
      return property + " < " + value;
    case "biggerThan":
      return property + " > " + value;
    default:
      return property + " = " + value;
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

export const getPropertyOperatorCQL = (filter) => {
  switch (filter.type) {
    case "string":
      return getCQLStringPropertyOperator(filter.property, filter.operator, filter.value)
    case "number":
      return getCQLNumberPropertyOperator(filter.property, filter.operator, filter.value);
    case "date":
      return getCQLDatePropertyOperator(filter.property, filter.value);
};
}

export const updateFiltersOnMap = (updatedFilters, filterInfo, channel) => {
  let filters = "";
  updatedFilters && updatedFilters.filter(f => f.layer === filterInfo?.layer?.id).forEach((filter, index) => {
      var cqlFilter = getPropertyOperatorCQL(filter);
      index === 0 ? filters += cqlFilter : filters += " AND " + cqlFilter;
  })

  if (filters.length > 0) {
      channel && channel.postRequest(
      'MapModulePlugin.MapLayerUpdateRequest',
      [filterInfo.layer.id, true, { 'CQL_FILTER': filters }]
      );
  } else {
      filterInfo.layer && channel && channel.postRequest(
          'MapModulePlugin.MapLayerUpdateRequest',
          [filterInfo.layer.id, true, { 'CQL_FILTER': null }]
          );
  }
};

export const filterFeature = (feature, location, filters, channel) => {
  if (filters.length === 0 && filters === 0) {
    channel && channel.postRequest(
      'MapModulePlugin.MapLayerUpdateRequest',
      [location.layerId, true, { 'CQL_FILTER': null }]
    );
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
      return b.type === "string" && typeof(a) === "string"
        ? a.toString().trim().toLowerCase() !==
            b.value.toString().trim().toLowerCase()
        : a != b.value;
    },
    "===": function (a, b) {
      return b.type === "string" && typeof(a) === "string"
        ? a.toString().trim().toLowerCase() ===
            b.value.toString().trim().toLowerCase()
        : a == b.value;
    },
    includes: function (a, b) {
      return (
        a
          .toString()
          .trim()
          .toLowerCase()
          .includes(b.value.toString().trim().toLowerCase())
      );
    },
    doesntInclude: function (a, b) {
      return (
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
      if (value === undefined || value === null) return false;
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
