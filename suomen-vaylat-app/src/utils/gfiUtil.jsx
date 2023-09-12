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
}

const getParameterCaseInsensitive = (object, key) => {
    const asLowercase = key.toLowerCase();
    return object[Object.keys(object).filter(function(k) {
      return k.toLowerCase() === asLowercase;
    })[0]];
  }

export const filterFeature = (feature, location, filters) => {
    if (filters.length === 0) {
        return true;
    }

    var comparisonOperatorsHash = {
        '<': function(a, b) { return a < b; },
        '>': function(a, b) { return a > b; },
        '>=': function(a, b) { return a >= b; },
        '<=': function(a, b) { return a <= b; },
        '==': function(a, b) { return a === b; },
        '!==': function(a, b) { return isNaN(a) && isNaN(b) ? a.toLowerCase() !== b.toLowerCase() : a !== b; },
        '===': function(a, b) { return isNaN(a) && isNaN(b) ? a.toLowerCase() === b.toLowerCase() : a === b; },
        'includes': function(a, b) { return isNaN(a) && isNaN(b) && a.toLowerCase().includes(b.toLowerCase()); },
        'doesntInclude': function(a, b) { return isNaN(a) && isNaN(b) && !a.toLowerCase().includes(b); },
    };

    const properties = feature.keyValueProperties;
    const filterMatch = filters.every(filter => {
        if (location.layerId === filter.layer) {
            const operator = getPropertyOperator(filter.operator);
            var comparisonOperator = comparisonOperatorsHash[operator];
            const value = getParameterCaseInsensitive(properties, filter.property);
            if (value === undefined)
            return false
            const doFilter = comparisonOperator(value, filter.value);
            return doFilter;
        } else {
            return true;
        }
    })

    return filterMatch;
}