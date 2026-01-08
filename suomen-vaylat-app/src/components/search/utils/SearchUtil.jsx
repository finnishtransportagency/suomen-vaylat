import {
  setFeatureErrors,
  setTrackErrors
} from '../../../state/slices/rpcSlice';
import strings from '../../../translations';

export const vectorLayerId = 'SEARCH_VECTORLAYER';
export const markerId = 'SEARCH_MARKER';

export const validateFeatureSearch = (
  searchValue,
  store,
  requireAll = false,
  attributeSearch
) => {
  const newErrors = [];
  const regex = /[^A-Za-z0-9äöåÄÖÅ \-/.,()]/;
  const minLength = attributeSearch ? 1 : 3;
  if (requireAll && searchValue.length < minLength) {
    newErrors.push('length');
  }
  if (regex.test(searchValue)) {
    newErrors.push('regex');
  }
  store.dispatch(setFeatureErrors(newErrors));
  return newErrors.length === 0;
};

export const removeMarkersAndFeatures = (channel) => {
  if (!channel) {
    return;
  }
  channel.postRequest('MapModulePlugin.RemoveMarkersRequest', [
    'SEARCH_MARKER'
  ]);
  vectorLayerIds.forEach((vectorLayerId) => {
    channel.postRequest('MapModulePlugin.RemoveFeaturesFromMapRequest', [
      null,
      null,
      vectorLayerId
    ]);
  });

  // for feature search
  channel &&
    channel.postRequest('MapModulePlugin.RemoveFeaturesFromMapRequest', [
      null,
      null,
      'feature-search-results'
    ]);
};

export const validateSimpleSearch = (searchValue, requireAll = false) => {
  const value = (searchValue || '').trim();
  const allowed = /^[A-Za-z0-9äöåÄÖÅ ,.\-/]+$/;

  // translation helper (fallback to English)
  const t = (key, fallback) => {
    const path = strings?.search?.errors;
    if (path && typeof path[key] === 'string') return path[key];
    return fallback;
  };

  if (value === '') {
    if (requireAll) {
      return t('required', 'This field is required');
    }
    return '';
  }

  if (!allowed.test(value)) {
    return t(
      'invalidChars',
      'Invalid characters — only letters, numbers and spaces are allowed'
    );
  }

  return '';
};

export const validateTrackSearch = (searchValue, store, requireAll = false) => {
  // normalize input (trim whitespace)
  const value = (searchValue || '').trim();

  // patterns
  const alphaNum = /^[A-Za-z0-9äöåÄÖÅ ]+$/; // first part: letters, digits and space only
  const numOnly = /^[0-9]+$/; // second & third: digits only

  // split into parts; we accept less than 3 parts for live validation
  const parts = value === '' ? [] : value.split('/').map((p) => p.trim());

  // prepare error object
  const fields = [
    { invalid: false, message: '' }, // track id
    { invalid: false, message: '' }, // km
    { invalid: false, message: '' } // m
  ];

  // helper to fetch translation with fallbacks
  const t = (key, fallback) => {
    // try strings.search.errors.track
    const trackPath = strings?.search?.track?.errors;
    if (trackPath && typeof trackPath[key] === 'string') return trackPath[key];
    return fallback;
  };

  // Validate part 0 (track identifier) if present
  if (parts[0] && parts[0] !== '') {
    if (!alphaNum.test(parts[0])) {
      fields[0].invalid = true;
      // use the combined message as requested
      fields[0].message = t(
        'invalidTrackIdentifier',
        'Invalid track identifier — track id must contain only letters and numbers'
      );
    }
  } else if (requireAll) {
    fields[0].invalid = true;
    fields[0].message = t(
      'trackIdentifierRequired',
      'Track identifier is required'
    );
  }

  // Validate part 1 (kilometer) if present
  if (parts[1] && parts[1] !== '') {
    if (!numOnly.test(parts[1])) {
      fields[1].invalid = true;
      fields[1].message = t(
        'invalidKilometer',
        'Invalid kilometer — kilometer must contain only digits'
      );
    }
  } else if (requireAll) {
    fields[1].invalid = true;
    fields[1].message = t('kilometerRequired', 'Kilometer is required');
  }

  // Validate part 2 (meter) if present
  if (parts[2] && parts[2] !== '') {
    if (!numOnly.test(parts[2])) {
      fields[2].invalid = true;
      fields[2].message = t(
        'invalidMeter',
        'Invalid meter — meter must contain only digits'
      );
    }
  } else if (requireAll) {
    fields[2].invalid = true;
    fields[2].message = t('meterRequired', 'Meter is required');
  }

  store.dispatch(setTrackErrors(fields));

  return fields.every((f) => !f.invalid);
};

export const variants = {
  initial: {
    maxWidth: 0,
    opacity: 0,
    filter: 'blur(10px)'
  },
  animate: {
    maxWidth: '450px',
    opacity: 1,
    filter: 'blur(0px)'
  },
  exit: {
    maxWidth: 0,
    opacity: 0,
    filter: 'blur(10px)'
  },
  transition: {
    duration: 0.3,
    type: 'tween'
  }
};

export const dropdownVariants = {
  initial: {
    height: 0,
    opacity: 0
  },
  animate: {
    height: 'auto',
    opacity: 1
  },
  exit: {
    height: 0,
    opacity: 0
  },
  transition: {
    duration: 0.5,
    type: 'tween'
  }
};

export const texts = [
  {
    text: strings.search.tips.address,
    examples: strings.search.tips.addressExamples
  },
  {
    text: strings.search.tips.realEstateUnitIdentifier,
    examples: strings.search.tips.realEstateUnitIdentifierExamples
  },
  {
    text: strings.search.tips.vkmRoad,
    examples: strings.search.tips.vkmRoadExamples
  },
  {
    text: strings.search.tips.vkmTrack,
    examples: strings.search.tips.vkmTrackExamples
  }
];

export const searchDownloadTips = {
  tip: strings.search.tips.toastTip,
  guide: strings.search.tips.toastTipContent
};

export const vectorLayerIds = [
  vectorLayerId + '_vkm_tie',
  vectorLayerId + '_vkm_vali',
  vectorLayerId + '_vkm_osa',
  vectorLayerId + '_vkm_etaisyys',
  vectorLayerId + '_vkm_track',
  vectorLayerId + '_vkm'
];

export const mergeMatchedKeys = (oldMatchedKeys, newMatchedKeys) => {
  // Create a new object that will hold the merged keys
  const mergedMatchedKeys = { ...oldMatchedKeys };

  // Iterate through each key in the new matchedFeatures object
  Object.keys(newMatchedKeys).forEach((key) => {
    if (mergedMatchedKeys.hasOwnProperty(key)) {
      // If the key exists in the old object, concatenate the arrays
      mergedMatchedKeys[key] = mergedMatchedKeys[key].concat(
        newMatchedKeys[key]
      );
    } else {
      // If the key doesn't exist, add it to the merged object
      mergedMatchedKeys[key] = newMatchedKeys[key];
    }
  });

  // Return the merged object
  return mergedMatchedKeys;
};
