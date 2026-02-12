import React, {
  useState,
  useContext,
  useEffect,
  useRef,
  useCallback
} from 'react';
import styled from 'styled-components';
import strings from '../../translations';
import { useSelector } from 'react-redux';
import { ReactReduxContext } from 'react-redux';
import {
  addMarkerRequest,
  removeMarkerRequest,
  setCoordMarkerIndex
} from '../../state/slices/rpcSlice';
import {
  addToDrawToolMarkers,
  setIsSaveGeometriesOpen
} from '../../state/slices/uiSlice';
import { theme } from '../../theme/theme';
import { faSave, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Select from 'react-select';
import {
  coordinateDegreesToMetric,
  coordinateMetricToDegrees,
  projectionOptions,
  formatProjectedShown,
  isProjectionDegrees
} from './util';
import { Slide, toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { setIsCoordinateToolOpen } from '../../state/slices/uiSlice';
import { useAppSelector } from '../../state/hooks';
import { Switch } from '@mui/material';

const StyledInstructionText = styled.p`
  margin-bottom: 0px;
`;

const StyledCoordinateSystemSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
  justify-content: space-between;
`;

const StyledMobileCoordsContainer = styled(motion.div)`
  position: fixed;
  width: 100%;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;
  background: ${(props) => props.theme.colors.mainWhite};
  box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
  @media ${(props) => props.theme.device.mobileL} {
    font-size: 13px;
  }
`;

const StyledCoordToolsContainer = styled.div`
  width: 100%;
  height: 100%;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background-color: #f9f9f9;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const StyledCenterMapButton = styled.button`
  display: flex;
  align-items: center;
  height: 2.5em;
  width: 100%;
  justify-content: center;
  color: ${(props) => props.theme.colors.mainWhite};
  background-color: ${(props) =>
    props.disabled
      ? props.theme.colors.darkGrey
      : props.theme.colors.mainColor1};
  border-radius: 20px;
  box-shadow: 0px 1px 3px #0000001f;
  border: none;
  margin: 0.5em 0;
  padding: 12px;
  &:hover {
    background-color: ${(props) =>
      props.disabled
        ? props.theme.colors.darkGrey
        : props.theme.colors.mainColor1Selected};
  }
`;

const StyledAddMarkerButton = styled.button`
  display: flex;
  align-items: center;
  height: 2.5em;
  width: 100%;
  justify-content: center;
  color: ${(props) => props.theme.colors.mainWhite};
  background-color: ${(props) =>
    props.disabled
      ? props.theme.colors.darkGrey
      : props.theme.colors.mainColor1};
  border-radius: 20px;
  box-shadow: 0px 1px 3px #0000001f;
  border: none;
  margin: 0.5em 0;
  padding: 12px;
  &:hover {
    background-color: ${(props) =>
      props.disabled
        ? props.theme.colors.darkGrey
        : props.theme.colors.mainColor1Selected};
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
`;

const StyledInput = styled.input`
  width: 100%;
  padding-left: 12px;
  font-size: 16px;
  padding-top: 10px;
  border-radius: 4px;
  border: 2px solid hsl(0, 0%, 80%);
  padding: 5px 10px;
`;

const StyledButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const StyledTrashButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  cursor: pointer;
  height: 2.5em;
  background-color: ${(props) => props.theme.colors.secondaryColorDarkOrange};
  color: ${(props) => props.theme.colors.mainWhite};
  svg {
    font-size: 16px;
  }
  border-radius: 20px;
  box-shadow: 0px 1px 3px #0000001f;
  border: none;
  padding: 12px;
  &:hover {
    background-color: ${(props) =>
      props.theme.colors.secondaryColorDarkOrangeSelected};
  }
`;

const StyledMarkerSaveButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  cursor: pointer;
  height: 2.5em;
  background-color: ${(props) => props.theme.colors.secondaryColorGreen};
  color: ${(props) => props.theme.colors.mainWhite};
  svg {
    font-size: 16px;
  }
  border-radius: 20px;
  box-shadow: 0px 1px 3px #0000001f;
  border: none;
  padding: 12px;
  &:hover {
    background-color: ${(props) =>
      props.theme.colors.secondaryColorGreenSelected};
  }
`;

const StyledInputContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1em;
`;

const StyledInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const StyledButtonLabel = styled.span`
  margin: 0px;
`;

const ValidationMessage = styled.p`
  font-size: 12px;
  color: red;
  margin: 0;
`;

const StyledRoundedBox = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 45px;
  height: 35px;
  border-radius: 20%;
  background-color: ${(props) => props.theme.colors.mainColor3transparent30};
  color: black;
  font-weight: bold;
`;

const StyledHeaderContent = styled.div`
  height: 56px;
  z-index: 1;
  display: flex;
  border-radius: 4px 4px 0px 0px;
  align-items: center;
  justify-content: space-between;
  background-color: ${(props) => props.theme.colors.mainColor1};
  padding: 16px;
  box-shadow: 2px 2px 4px 0px rgba(0, 0, 0, 0.2);
  p {
    margin: 0px;
    font-size: 18px;
    font-weight: bold;
    color: ${(props) => props.theme.colors.mainWhite};
  }
  svg {
    color: ${(props) => props.theme.colors.mainWhite};
  }
`;

const StyledTitleContent = styled.div`
  display: flex;
  align-items: center;
  svg {
    font-size: 20px;
    margin-right: 8px;
  }
`;

const StyledCloseIcon = styled(FontAwesomeIcon)`
  cursor: pointer;
  font-size: 20px;
`;

const StyledSwitchRow = styled.div`
  display: flex;
  align-items: center;
`;

const StyledSwitchLabel = styled.div`
  font-size: 1rem;
  color: #292929;
  margin-left: 10px;
`;

const listVariants = {
  visible: {
    y: 0,
    opacity: 1,
    pointerEvents: 'auto',
    filter: 'blur(0px)',
    transition: {
      duration: 0.3,
      type: 'tween'
    }
  },
  hidden: {
    y: '100%',
    opacity: 0,
    pointerEvents: 'none',
    filter: 'blur(10px)'
  }
};

const CoordinateToolMobile = () => {
  const { channel, center, currentZoomLevel, coordMarkerIndex } = useSelector(
    (state) => state.rpc
  );
  const { isCoordinateToolOpen } = useAppSelector((state) => state.ui);

  const { store } = useContext(ReactReduxContext);

  // Round the value
  const [round, setRound] = useState(true);

  // native coords (EPSG:3067) numeric full precision
  const [mapCenter, setMapCenter] = useState({
    x: center.x,
    y: center.y
  });

  // displayedRaw keeps full numeric values (numbers) for the currently selected projection
  // displayedShown is string shown in inputs (DMS for degrees, 3-decimal strings for projected)
  const [displayedRaw, setDisplayedRaw] = useState({
    x: center.x,
    y: center.y
  });
  const [displayedShown, setDisplayedShown] = useState({
    x: round ? formatProjectedShown(center.x) : center.x,
    y: round ? formatProjectedShown(center.y) : center.y
  });

  // validation
  const [isValidX, setIsValidX] = useState(true);
  const [isValidY, setIsValidY] = useState(true);

  // projection selection and transform status
  const [selectedProjection, setSelectedProjection] = useState(
    projectionOptions[0]
  ); // default map SRS
  const [isTransformLoading, setIsTransformLoading] = useState(false);

  // for cancelling/guarding inflight responses
  const activeRequestRef = useRef(null);
  // track user edits so incoming map updates don't overwrite while typing
  const userEditedRef = useRef(false);

  const handleSetRound = (round) => {
    setRound(round);
    if (isProjectionDegrees(selectedProjection.value)) {
      // produce DMS strings using util - pass decimals high to preserve precision in DMS fractions
      // Use 9 decimals for the decimal->DMS conversion to preserve precision (mirror earlier behaviour)
      try {
        const dms = coordinateMetricToDegrees(
          [displayedRaw.x, displayedRaw.y],
          round
        ); // [dmsLon, dmsLat]
        setDisplayedShown({ x: String(dms[0]), y: String(dms[1]) });
      } catch (e) {
        // fallback to show numeric full precision if util fails
        setDisplayedShown({
          x: String(displayedRaw.x),
          y: String(displayedRaw.y)
        });
      }
    } else {
      // projected: show rounded to 3 decimals?
      setDisplayedShown({
        x: round ? formatProjectedShown(displayedRaw.x) : displayedRaw.x,
        y: round ? formatProjectedShown(displayedRaw.y) : displayedRaw.y
      });
    }
    localStorage.setItem('roundCoordinates', round.toString());
  };

  useEffect(() => {
    let round = localStorage.getItem('roundCoordinates');
    if (round) {
      setRound(round === 'true');
      setDisplayedShown({
        x: round ? formatProjectedShown(center.x) : center.x,
        y: round ? formatProjectedShown(center.y) : center.y
      });
    }
  }, []);

  const handleDeleteMarkers = () => {
    for (let i = 0; i < coordMarkerIndex; i++) {
      const markerId = `coordinate_tool_marker_${i}`;
      store.dispatch(removeMarkerRequest({ markerId }));
      store.dispatch(setCoordMarkerIndex(0));
    }
  };

  // helper that calls RPC transform (callback-style) — adapts to your channel API
  const callTransformRPC = useCallback(
    async (lon, lat, targetSRS, sourceSRS /* optional */) => {
      if (!channel || !channel.getTransformedCoordinates) {
        throw new Error('Transformation service not available');
      }

      const lonlatObj = { lon, lat };
      if (sourceSRS) lonlatObj.srs = sourceSRS;

      // Wrap callback API into Promise for easier use.
      return await new Promise((resolve, reject) => {
        channel.getTransformedCoordinates(
          [lonlatObj, sourceSRS, targetSRS],
          (res) => resolve(res),
          (err) => reject(err)
        );
      });
    },
    [channel]
  );

  // transform native (EPSG:3067) -> selectedProjection and set displayedRaw & displayedShown
  const transformNativeToDisplayed = useCallback(
    async (nativeX, nativeY, targetSRS) => {
      // If target is native or not provided -> simply mirror native values
      if (!targetSRS || targetSRS === 'EPSG:3067') {
        setDisplayedRaw({ x: nativeX, y: nativeY });
        setDisplayedShown({
          x: round ? formatProjectedShown(nativeX) : nativeX,
          y: round ? formatProjectedShown(nativeY) : nativeY
        });
        return;
      }

      if (!channel) {
        console.error('Transformation service not available');
        toast.error('Transformation service not available', {
          position: 'top-center',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
          transition: Slide
        });
        return;
      }

      setIsTransformLoading(true);
      const reqId = Symbol('toDisplayed');
      activeRequestRef.current = reqId;

      try {
        const res = await callTransformRPC(nativeX, nativeY, targetSRS);
        if (activeRequestRef.current !== reqId) return; // superseded

        // res expected shape: { srs, lon, lat } (lon/lat are numeric or string)
        const rawX = Number(res.lon);
        const rawY = Number(res.lat);
        setDisplayedRaw({ x: rawX, y: rawY });

        if (isProjectionDegrees(targetSRS)) {
          // produce DMS strings using util - pass decimals high to preserve precision in DMS fractions
          // Use 9 decimals for the decimal->DMS conversion to preserve precision (mirror earlier behaviour)
          try {
            const dms = coordinateMetricToDegrees([rawX, rawY], round); // [dmsLon, dmsLat]
            setDisplayedShown({ x: String(dms[0]), y: String(dms[1]) });
          } catch (e) {
            // fallback to show numeric full precision if util fails
            setDisplayedShown({ x: String(rawX), y: String(rawY) });
          }
        } else {
          // projected: show rounded to 3 decimals?
          setDisplayedShown({
            x: round ? formatProjectedShown(rawX) : rawX,
            y: round ? formatProjectedShown(rawY) : rawY
          });
        }
      } catch (err) {
        if (activeRequestRef.current === reqId) {
          let errorMsg =
            strings.coordinateTool.errors.transformCoordinatesError;
          if (err?.responseJSON?.error) {
            errorMsg = errorMsg + ' : ' + err?.responseJSON?.error;
          }
          console.error(errorMsg);
          toast.error(errorMsg, {
            position: 'top-center',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored',
            transition: Slide
          });
        }
      } finally {
        if (activeRequestRef.current === reqId) activeRequestRef.current = null;
        setIsTransformLoading(false);
      }
    },
    [channel, round, callTransformRPC]
  );

  // transform displayed raw coords in selectedProjection back to native EPSG:3067 (numbers)
  const transformDisplayedToNative = useCallback(
    async (rawX, rawY, fromSRS) => {
      if (!fromSRS || fromSRS === 'EPSG:3067') {
        return { lon: Number(rawX), lat: Number(rawY) };
      }

      if (!channel) {
        throw new Error('Transformation service not available');
      }

      setIsTransformLoading(true);
      const reqId = Symbol('toNative');
      activeRequestRef.current = reqId;

      try {
        const res = await callTransformRPC(
          Number(rawX),
          Number(rawY),
          'EPSG:3067',
          fromSRS
        );
        if (activeRequestRef.current !== reqId) throw new Error('superseded');
        return { lon: Number(res.lon), lat: Number(res.lat) };
      } catch (err) {
        if (activeRequestRef.current === reqId) {
          let errorMsg =
            strings.coordinateTool.errors.transformCoordinatesError;
          if (err?.responseJSON?.error) {
            errorMsg = errorMsg + ' : ' + err?.responseJSON?.error;
          }
          console.error(errorMsg);
          toast.error(errorMsg, {
            position: 'top-center',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored',
            transition: Slide
          });
        }
        throw err;
      } finally {
        if (activeRequestRef.current === reqId) activeRequestRef.current = null;
        setIsTransformLoading(false);
      }
    },
    [channel, callTransformRPC]
  );

  // When redux center changes, update local mapCenter and refresh displayed values if user hasn't edited them
  useEffect(() => {
    if (!hasCoordsChanged(center, mapCenter)) return;

    setIsValidX(true);
    setIsValidY(true);

    setMapCenter({ x: center.x, y: center.y });

    if (!userEditedRef.current) {
      if (selectedProjection.value === 'EPSG:3067') {
        setDisplayedRaw({ x: center.x, y: center.y });
        setDisplayedShown({
          x: round ? formatProjectedShown(center.x) : center.x,
          y: round ? formatProjectedShown(center.y) : center.y
        });
      } else {
        transformNativeToDisplayed(
          center.x,
          center.y,
          selectedProjection.value
        ).catch(() => {});
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [center]);

  // Re-run transform when selected projection changes (if the user hasn't edited displayed inputs)
  useEffect(() => {
    if (!channel) return;
    if (selectedProjection.value === 'EPSG:3067') {
      setDisplayedRaw({ x: mapCenter.x, y: mapCenter.y });
      setDisplayedShown({
        x: round ? formatProjectedShown(mapCenter.x) : mapCenter.x,
        y: round ? formatProjectedShown(mapCenter.y) : mapCenter.y
      });
    } else {
      if (!userEditedRef.current) {
        transformNativeToDisplayed(
          mapCenter.x,
          mapCenter.y,
          selectedProjection.value
        ).catch(() => {});
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProjection.value, channel]);

  const handleInputChange = (key, value) => {
    // Accept free text (we allow DMS strings for degree projections)
    // We'll do a light numeric validation for projected inputs (only digits, dot, minus)
    const isProjected = !isProjectionDegrees(selectedProjection.value);

    let isNumeric = true;
    if (isProjected) {
      isNumeric = /^-?\d*[.,]?\d*$/.test(value);
      if (key === 'x') setIsValidX(isNumeric);
      else setIsValidY(isNumeric);
    } else {
      // For degrees we accept any value (users will input DMS strings)
      if (key === 'x') setIsValidX(true);
      else setIsValidY(true);
    }

    // update shown string
    setDisplayedShown((prev) => ({ ...prev, [key]: value }));

    // update raw numeric if we can parse a number (for projected) or keep raw as-is for degrees until blur
    if (isProjected) {
      if (
        isNumeric &&
        value !== '' &&
        value !== '.' &&
        value !== ',' &&
        value !== '-' &&
        value !== '-.' &&
        value !== '-,'
      ) {
        // sanitize comma to dot for numeric conversion
        const sanitized = String(value).replace(',', '.');
        setDisplayedRaw((prev) => ({ ...prev, [key]: Number(sanitized) }));
      } else {
        // don't overwrite raw if the input is incomplete
      }
    } else {
      // For degree inputs we don't change displayedRaw yet; we will parse on blur using coordinateDegreesToMetric
    }

    userEditedRef.current = true;
  };

  const handleSaveMarkers = () => {
    store.dispatch(setIsSaveGeometriesOpen(true));
  };

  // Center the map: transform displayed values (raw or parsed from DMS) back to native and call channel
  const handleCenterMap = async () => {
    try {
      let native;
      if (isProjectionDegrees(selectedProjection.value)) {
        // Parse DMS -> decimal degrees using coordinateDegreesToMetric
        try {
          const lonDms = displayedShown.x;
          const latDms = displayedShown.y;

          // If user entered plain numbers (without degree symbol), try to append degree symbol like other UI did:
          const maybeLon = String(lonDms).includes('°') ? lonDms : `${lonDms}°`;
          const maybeLat = String(latDms).includes('°') ? latDms : `${latDms}°`;

          // coordinateDegreesToMetric returns [ddLon, ddLat] as string numeric values with requested decimals
          const numeric = coordinateDegreesToMetric([maybeLon, maybeLat], 10);
          const rawLon = Number(numeric[0]);
          const rawLat = Number(numeric[1]);

          // store parsed raw
          setDisplayedRaw({ x: rawLon, y: rawLat });

          native = await transformDisplayedToNative(
            rawLon,
            rawLat,
            selectedProjection.value
          );
        } catch (err) {
          console.error('Failed to parse degree input:', err);

          toast.error(strings.coordinateTool.errors.degreeInputParseError, {
            position: 'top-center',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored',
            transition: Slide
          });
          return;
        }
      } else {
        // projected: use displayedRaw numeric directly
        const rawX = displayedRaw.x;
        const rawY = displayedRaw.y;
        native = await transformDisplayedToNative(
          rawX,
          rawY,
          selectedProjection.value
        );
      }

      // Update native map center locally
      setMapCenter({ x: native.lon, y: native.lat });
      userEditedRef.current = false;

      // After centering, refresh displayed (canonical) shown values for current projection
      if (selectedProjection.value === 'EPSG:3067') {
        setDisplayedRaw({ x: native.lon, y: native.lat });
        setDisplayedShown({
          x: round ? formatProjectedShown(native.lon) : native.lon,
          y: round ? formatProjectedShown(native.lat) : native.lat
        });
      } else {
        await transformNativeToDisplayed(
          native.lon,
          native.lat,
          selectedProjection.value
        );
      }

      // call the channel to move the map
      channel.postRequest('MapMoveRequest', [
        native.lon,
        native.lat,
        currentZoomLevel
      ]);
    } catch (err) {
      console.error('Failed to center map:', err);

      toast.error(strings.coordinateTool.errors.centerMapError, {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
        transition: Slide
      });
    }
  };

  // Add marker: parse displayed values (DMS -> decimal degrees if needed), transform to native, then add marker
  const handleAddMarker = async () => {
    try {
      let native;
      let msgLon, msgLat;
      if (isProjectionDegrees(selectedProjection.value)) {
        // parse DMS to decimal degrees for transforming
        const lonDms = displayedShown.x;
        const latDms = displayedShown.y;
        const maybeLon = String(lonDms).includes('°') ? lonDms : `${lonDms}°`;
        const maybeLat = String(latDms).includes('°') ? latDms : `${latDms}°`;
        const numeric = coordinateDegreesToMetric([maybeLon, maybeLat], 10);
        const rawLon = Number(numeric[0]);
        const rawLat = Number(numeric[1]);
        setDisplayedRaw({ x: rawLon, y: rawLat });
        native = await transformDisplayedToNative(
          rawLon,
          rawLat,
          selectedProjection.value
        );
        msgLon = displayedShown.x;
        msgLat = displayedShown.y;
      } else {
        // projected
        const rawX = displayedRaw.x;
        const rawY = displayedRaw.y;
        native = await transformDisplayedToNative(
          rawX,
          rawY,
          selectedProjection.value
        );
        msgLon = round ? formatProjectedShown(displayedRaw.x) : displayedRaw.x;
        msgLat = round ? formatProjectedShown(displayedRaw.y) : displayedRaw.y;
      }

      const newMarkerId = `coordinate_tool_marker_${coordMarkerIndex}`;
      const customMarker = {
        x: native.lon,
        y: native.lat,
        msg: `${msgLat}, ${msgLon}`,
        markerId: newMarkerId,
        color: theme.colors.secondaryColorOrange,
        size: 5
      };
      store.dispatch(addMarkerRequest(customMarker));
      store.dispatch(addToDrawToolMarkers(customMarker));
      store.dispatch(setCoordMarkerIndex(coordMarkerIndex + 1));

      userEditedRef.current = false;
      setMapCenter({ x: native.lon, y: native.lat });

      // update canonical shown values after adding
      if (selectedProjection.value === 'EPSG:3067') {
        setDisplayedRaw({ x: native.lon, y: native.lat });
        setDisplayedShown({
          x: round ? formatProjectedShown(native.lon) : native.lon,
          y: round ? formatProjectedShown(native.lat) : native.lat
        });
      } else {
        await transformNativeToDisplayed(
          native.lon,
          native.lat,
          selectedProjection.value
        );
      }
    } catch (err) {
      console.error('Failed to add marker:', err);

      toast.error(strings.coordinateTool.errors.addMarkerError, {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
        transition: Slide
      });
    }
  };

  // When user blurs inputs we "commit" their typed value:
  // - For degrees: parse DMS into numeric decimal degrees (coordinateDegreesToMetric), update raw, transform to native and update canonical shown
  // - For projected: parse numeric -> raw, update native and canonical shown
  const handleInputBlur = async () => {
    if (!isValidX || !isValidY) return;

    try {
      if (isProjectionDegrees(selectedProjection.value)) {
        // parse DMS strings
        const lonDms = displayedShown.x;
        const latDms = displayedShown.y;
        if (!lonDms || !latDms) return;

        const maybeLon = String(lonDms).includes('°') ? lonDms : `${lonDms}°`;
        const maybeLat = String(latDms).includes('°') ? latDms : `${latDms}°`;

        // convert DMS -> decimal degrees (strings)
        const numeric = coordinateDegreesToMetric([maybeLon, maybeLat], 10);
        const rawLon = Number(numeric[0]);
        const rawLat = Number(numeric[1]);

        setDisplayedRaw({ x: rawLon, y: rawLat });

        // transform to native and update mapCenter + canonical shown
        const native = await transformDisplayedToNative(
          rawLon,
          rawLat,
          selectedProjection.value
        );
        setMapCenter({ x: native.lon, y: native.lat });
        // re-run native->displayed to get canonical representation (DMS) and ensure any server normalization is reflected
        await transformNativeToDisplayed(
          native.lon,
          native.lat,
          selectedProjection.value
        );
      } else {
        // projected: parse numeric inputs, store raw, set native then reformat shown (3 decimals)
        const sanitizedX = String(displayedShown.x).replace(',', '.');
        const sanitizedY = String(displayedShown.y).replace(',', '.');

        const rawX = Number(sanitizedX);
        const rawY = Number(sanitizedY);

        if (Number.isNaN(rawX) || Number.isNaN(rawY)) return;
        setDisplayedRaw({ x: rawX, y: rawY });

        const native = await transformDisplayedToNative(
          rawX,
          rawY,
          selectedProjection.value
        );
        setMapCenter({ x: native.lon, y: native.lat });

        // update shown to canonical formatted (3 decimals)
        if (selectedProjection.value === 'EPSG:3067') {
          setDisplayedShown({
            x: round ? formatProjectedShown(native.lon) : native.lon,
            y: round ? formatProjectedShown(native.lat) : native.lat
          });
        } else {
          await transformNativeToDisplayed(
            native.lon,
            native.lat,
            selectedProjection.value
          );
        }
      }

      userEditedRef.current = false;
    } catch (err) {
      console.error('Failed to commit input on blur:', err);
    }
  };

  const hasCoordsChanged = (reduxCenter, localMapCenter) => {
    if (isTransformLoading) return false;
    return (
      reduxCenter.x !== Number(localMapCenter.x) ||
      reduxCenter.y !== Number(localMapCenter.y)
    );
  };

  return (
    <StyledMobileCoordsContainer
      id="coordinate-tool-mobile-container"
      key="coordinate-tool-mobile-container"
      initial="hidden"
      animate={isCoordinateToolOpen ? 'visible' : 'hidden'}
      variants={listVariants}
      drag="y"
      dragConstraints={{ top: 0, bottom: 240 }}
      dragElastic={0.2}
      aria-labelledby="coordinate-tool-mobile-title"
    >
      <StyledHeaderContent>
        <StyledTitleContent>
          <p id="coordinate-tool-mobile-title">
            {strings.coordinateTool.title}
          </p>
        </StyledTitleContent>
        <StyledCloseIcon
          aria-label={strings.coordinateTool.closeCoordinateTool}
          icon={faTimes}
          onClick={() => store.dispatch(setIsCoordinateToolOpen(false))}
        />
      </StyledHeaderContent>
      <StyledCoordToolsContainer>
        <StyledCoordinateSystemSection id="coordinate-tool-coordinate-system-section">
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <StyledInstructionText id="coordinate-tool-coordinate-system-title">
              {strings.coordinateTool.coordinateSystemTitle}
            </StyledInstructionText>
          </div>

          <div style={{ width: '100%' }}>
            <Select
              inputId="projection-select"
              aria-label={strings.coordinateTool.projectionSelect}
              value={{
                value: selectedProjection.value,
                label: selectedProjection.label
              }}
              onChange={(opt) => {
                setSelectedProjection(opt);
              }}
              options={projectionOptions}
              isSearchable
              placeholder="Select projection..."
            />
          </div>

          <StyledSwitchRow>
            <Switch
              checked={round}
              onChange={(e) => handleSetRound(e.target.checked)}
              color="primary"
              inputProps={{
                id: 'view-form-default-switch',
                'aria-label': strings.coordinateTool?.roundCoordinates
              }}
            />
            <StyledSwitchLabel id="view-form-default-label">
              {strings.coordinateTool?.roundCoordinates}
            </StyledSwitchLabel>
          </StyledSwitchRow>
        </StyledCoordinateSystemSection>

        {/** Do not add this option yet
         <div>
            <Typography>Valitse koordinaatisto</Typography>
            <StyledSelect
            value={{ label: formData.coordinateSystem, value: formData.coordinateSystem }}
            onChange={(option) => handleChange('coordinateSystem', option.value)}
            options={[
                { value: 'ETRS-TM35FIN', label: 'ETRS-TM35FIN' },
            ]}
            />
        </div>
       */}

        <StyledInputContainer>
          <StyledRoundedBox id="coordinate-tool-lat-label">
            {isProjectionDegrees(selectedProjection.value)
              ? strings.coordinateTool.lat
              : strings.coordinateTool.n}
          </StyledRoundedBox>
          <StyledInputWrapper>
            <StyledInput
              id="coordinate-tool-coordinate-input-y"
              type="text"
              aria-labelledby="coordinate-tool-coordinate-indicator-n"
              aria-describedby="coordinate-tool-warning-message-y"
              value={displayedShown.y}
              onChange={(e) => handleInputChange('y', e.target.value)}
              onBlur={handleInputBlur}
              placeholder={strings.gfifiltering.placeholders.chooseValue}
            />
            {!isValidY && (
              <ValidationMessage id="coordinate-tool-lat-validation">
                {strings.coordinateTool.onlyNumbers}
              </ValidationMessage>
            )}
          </StyledInputWrapper>
        </StyledInputContainer>

        <StyledInputContainer>
          <StyledRoundedBox id="coordinate-tool-lon-label">
            {isProjectionDegrees(selectedProjection.value)
              ? strings.coordinateTool.lon
              : strings.coordinateTool.e}
          </StyledRoundedBox>
          <StyledInputWrapper>
            <StyledInput
              id="coordinate-tool-coordinate-input-x"
              type="text"
              aria-labelledby="coordinate-tool-coordinate-indicator-e"
              aria-describedby="coordinate-tool-warning-message-x"
              value={displayedShown.x}
              onChange={(e) => handleInputChange('x', e.target.value)}
              onBlur={handleInputBlur}
              placeholder={strings.gfifiltering.placeholders.chooseValue}
            />
            {!isValidX && (
              <ValidationMessage id="coordinate-tool-lon-validation">
                {strings.coordinateTool.onlyNumbers}
              </ValidationMessage>
            )}
          </StyledInputWrapper>
        </StyledInputContainer>

        <StyledButtonsContainer>
          <ButtonContainer>
            <StyledCenterMapButton
              id="coordinate-tool-center-map-button"
              disabled={
                !isValidX ||
                !isValidY ||
                (!userEditedRef.current && !hasCoordsChanged(center, mapCenter))
              }
              onClick={handleCenterMap}
              aria-label={strings.coordinateTool.centerMap}
            >
              <StyledButtonLabel>
                {strings.coordinateTool.centerMap}
              </StyledButtonLabel>
            </StyledCenterMapButton>
            <StyledAddMarkerButton
              id="coordinate-tool-add-marker-button"
              onClick={handleAddMarker}
              disabled={!isValidX || !isValidY}
              aria-label={strings.coordinateTool.addMarker}
            >
              <StyledButtonLabel>
                {strings.coordinateTool.addMarker}
              </StyledButtonLabel>
            </StyledAddMarkerButton>
          </ButtonContainer>
          {coordMarkerIndex > 0 && (
            <>
              <StyledMarkerSaveButton
                id="coordinate-tool-marker-save-button"
                onClick={() => handleSaveMarkers()}
                aria-label={strings.coordinateTool.saveMarkers}
              >
                <FontAwesomeIcon icon={faSave} style={{ marginRight: '1em' }} />
                <StyledButtonLabel>
                  {strings.coordinateTool.saveMarkers}
                </StyledButtonLabel>
              </StyledMarkerSaveButton>
              <StyledTrashButton
                id="coordinate-tool-marker-delete-button"
                onClick={() => handleDeleteMarkers()}
                aria-label={strings.coordinateTool.deleteMarkers}
              >
                <FontAwesomeIcon
                  icon={faTrash}
                  style={{ marginRight: '1em' }}
                />
                <StyledButtonLabel>
                  {strings.coordinateTool.deleteMarkers}
                </StyledButtonLabel>
              </StyledTrashButton>
            </>
          )}
        </StyledButtonsContainer>
      </StyledCoordToolsContainer>
    </StyledMobileCoordsContainer>
  );
};

export default CoordinateToolMobile;
