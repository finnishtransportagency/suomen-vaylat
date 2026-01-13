const PROJECTIONS = [
  { code: 'EPSG:3067', name: 'ETRS-TM35FIN (EPSG:3067)' },
  { code: 'EPSG:4326', name: 'ETRS89 maantieteelliset (~WGS84)' },
  { code: 'EPSG:3395', name: 'WGS 84 / World Mercator (EPSG:3395)' },
  { code: 'EPSG:10690', name:'EUREF-FIN-GRS80 (EPSG:10690 )' },
  { code: 'EPSG:3046', name: 'ETRS-TM34 (EPSG:3046)' },
  { code: 'EPSG:3048', name: 'ETRS-TM36 (EPSG:3048)' },
  { code: 'EPSG:3873', name: 'ETRS-GK19 (EPSG:3873)' },
  { code: 'EPSG:3874', name: 'ETRS-GK20 (EPSG:3874)' },
  { code: 'EPSG:3875', name: 'ETRS-GK21 (EPSG:3875)' },
  { code: 'EPSG:3876', name: 'ETRS-GK22 (EPSG:3876)' },
  { code: 'EPSG:3877', name: 'ETRS-GK23 (EPSG:3877)' },
  { code: 'EPSG:3878', name: 'ETRS-GK24 (EPSG:3878)' },
  { code: 'EPSG:3879', name: 'ETRS-GK25 (EPSG:3879)' },
  { code: 'EPSG:3880', name: 'ETRS-GK26 (EPSG:3880)' },
  { code: 'EPSG:3881', name: 'ETRS-GK27 (EPSG:3881)' },
  { code: 'EPSG:3882', name: 'ETRS-GK28 (EPSG:3882)' },
  { code: 'EPSG:3883', name: 'ETRS-GK29 (EPSG:3883)' },
  { code: 'EPSG:3884', name: 'ETRS-GK30 (EPSG:3884)' },
  { code: 'EPSG:3885', name: 'ETRS-GK31 (EPSG:3885)' }
]

export const projectionOptions = PROJECTIONS.map((p) => ({
  value: p.code,
  label: p.name
}));

// helper for projected display rounding (metres) - show 3 decimals
export const formatProjectedShown = (val) => {
  if (val == null || val === '') return '';
  const n = Number(val);
  if (Number.isNaN(n)) return '';
  return (Math.round(n * 1000) / 1000).toFixed(3);
};

export const isProjectionDegrees = (projection) => {
  const degreeList = new Set(['EPSG:4258', 'EPSG:4326']);
  return degreeList.has(projection);
};

const coordChars = {
  CHAR_DEG: '\u00B0',
  CHAR_MIN: '\u0027',
  CHAR_SEC: '\u0022',
  CHAR_SEP: '\u0020'
};

const validCoordinates = function (point) {
  if (
    !point &&
    typeof point !== 'object' &&
    isNaN(point.length) &&
    point.length !== 2
  ) {
    return false;
  } else {
    return true;
  }
};

const coordinateDMSDecode = function (value) {
  if (typeof value === 'number') {
    value = '' + value;
  }
  value = value.replace(',', '.');
  // also convert comma to dot
  value = value.replace(',', '.');

  const patterns = {
    'DDMMSS.s':
      '(-?\\d+)[' +
      coordChars.CHAR_DEG +
      'd]\\s*' + // DD
      '(-?\\d+)' +
      coordChars.CHAR_MIN +
      '\\s*' + // MM
      '(-?\\d+(?:\\.\\d+)?)' +
      coordChars.CHAR_SEC, // SS.s
    'DDMM.mmm 1':
      '(-?\\d+)[' +
      coordChars.CHAR_DEG +
      'd]\\s*' + // DD
      '(-?\\d+(?:\\.\\d+)?)[' +
      coordChars.CHAR_MIN +
      ']\\s*', // MM.mmm
    'DDMM.mmm 2':
      '(-?\\d+)[' +
      coordChars.CHAR_DEG +
      'd]\\s*' + // DD
      '(-?\\d+(?:\\.\\d+)?)\\s*', // MM.mmm
    'DD.ddddd': '(\\d+(?:\\.\\d+)?)[' + coordChars.CHAR_DEG + 'd]\\s*' // DD.ddd
  };

  for (let key in patterns) {
    if (
      patterns.hasOwnProperty(key) &&
      value.match(new RegExp(patterns[key]))
    ) {
      return value.match(new RegExp(patterns[key]));
    }
  }

  return null;
};

export const coordinateMetricToDegrees = (point, decimals) => {
  let roundToDecimals = decimals || 0;
  if (roundToDecimals > 20) {
    roundToDecimals = 20;
  }
  if (validCoordinates(point)) {
    // first coordinate
    var dms1 = NaN;
    if (!coordinateDMSDecode(point[0])) {
      var p1 = parseFloat(point[0]);
      var d1 = p1 | 0;
      var m1 = ((p1 - d1) * 60) | 0;
      var s1 = (p1 - d1 - m1 / 60) * 3600;
      s1 = parseFloat(s1).toFixed(roundToDecimals);
      s1 = '' + s1;
      s1 = s1.replace('.', ',');
      dms1 =
        d1 +
        coordChars.CHAR_DEG +
        coordChars.CHAR_SEP +
        m1 +
        coordChars.CHAR_MIN +
        coordChars.CHAR_SEP +
        s1 +
        coordChars.CHAR_SEC;
    } else {
      dms1 = point[0];
    }

    // second coordinate
    var dms2 = NaN;
    if (!coordinateDMSDecode(point[1])) {
      var p2 = parseFloat(point[1]);
      var d2 = p2 | 0;
      var m2 = ((p2 - d2) * 60) | 0;
      var s2 = (p2 - d2 - m2 / 60) * 3600;
      s2 = parseFloat(s2).toFixed(roundToDecimals);
      s2 = '' + s2;
      s2 = s2.replace('.', ',');
      dms2 =
        d2 +
        coordChars.CHAR_DEG +
        coordChars.CHAR_SEP +
        m2 +
        coordChars.CHAR_MIN +
        coordChars.CHAR_SEP +
        s2 +
        coordChars.CHAR_SEC;
    } else {
      dms2 = point[1];
    }

    return [dms1, dms2];
  } else {
    return [NaN, NaN];
  }
};

export const coordinateDegreesToMetric = (point, decimals) => {
  let roundToDecimals = decimals || 0;
  if (roundToDecimals > 20) {
    roundToDecimals = 20;
  }
  if (validCoordinates(point)) {
    // first coordinate
    var dd1 = NaN;
    var matches1 = coordinateDMSDecode(point[0]);

    if (matches1) {
      var d1 = parseFloat(matches1[1]);
      var m1 = parseFloat(matches1[2]);
      var s1 = parseFloat(matches1[3]);

      if (!(isNaN(d1) || isNaN(m1) || isNaN(s1))) {
        dd1 = parseFloat(d1 + m1 / 60.0 + s1 / 3600).toFixed(roundToDecimals);
      } else if (!(isNaN(d1) || isNaN(m1))) {
        dd1 = parseFloat(d1 + m1 / 60.0).toFixed(roundToDecimals);
      } else if (!isNaN(d1)) {
        dd1 = parseFloat(d1).toFixed(roundToDecimals);
      }
    }

    // second coordinate
    var dd2 = NaN;
    var matches2 = coordinateDMSDecode(point[1]);

    if (matches2) {
      var d2 = parseFloat(matches2[1]);
      var m2 = parseFloat(matches2[2]);
      var s2 = parseFloat(matches2[3]);

      if (!(isNaN(d2) || isNaN(m2) || isNaN(s2))) {
        dd2 = parseFloat(d2 + m2 / 60.0 + s2 / 3600).toFixed(roundToDecimals);
      } else if (!(isNaN(d2) || isNaN(m2))) {
        dd2 = parseFloat(d2 + m2 / 60.0).toFixed(roundToDecimals);
      } else if (!isNaN(d2)) {
        dd2 = parseFloat(d2).toFixed(roundToDecimals);
      }
    }

    return [dd1, dd2];
  } else {
    return [NaN, NaN];
  }
};

export const coordinateIsDegrees = (point) => {
  const matches1 = coordinateDMSDecode(point[0]);
  const matches2 = coordinateDMSDecode(point[1]);
  return (
    matches1 != null &&
    matches1.length > 0 &&
    matches2 != null &&
    matches2.length > 0
  );
};
