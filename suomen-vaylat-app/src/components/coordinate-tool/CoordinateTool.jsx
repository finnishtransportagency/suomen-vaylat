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
import { faSave, faTrash } from '@fortawesome/free-solid-svg-icons';
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

const StyledCoordinateToolContainer = styled.div`
  width: 100%;
  height: 100%;
  margin: 0 auto;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background-color: #f9f9f9;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const StyledMapCenterButton = styled.button`
  display: flex;
  align-items: center;
  height: 2.5em;
  width: 100%;
  justify-content: center;
  color: ${(props) =>
    props.disabled
      ? props.theme.colors.disabledColor
      : props.theme.colors.mainWhite};
  background-color: ${(props) =>
    props.disabled
      ? props.theme.colors.disabledBg
      : props.theme.colors.mainColor1};
  border-radius: 20px;
  box-shadow: 0px 1px 3px #0000001f;
  border: none;
  margin: 0.5em 0 0.5em 0;
  padding: 12px;
  &:hover {
    background-color: ${(props) =>
      props.disabled
        ? props.theme.colors.disabledBg
        : props.theme.colors.mainColor1Selected};
  }
`;

const StyledMarkerAdditionButton = styled.button`
  display: flex;
  align-items: center;
  height: 2.5em;
  width: 100%;
  justify-content: center;
  color: ${(props) =>
    props.disabled
      ? props.theme.colors.disabledColor
      : props.theme.colors.mainWhite};
  background-color: ${(props) =>
    props.disabled
      ? props.theme.colors.disabledBg
      : props.theme.colors.mainColor1};
  border-radius: 20px;
  box-shadow: 0px 1px 3px #0000001f;
  border: none;
  margin: 0.5em 0 0.5em 0;
  padding: 12px;
  &:hover {
    background-color: ${(props) =>
      props.disabled
        ? props.theme.colors.disabledBg
        : props.theme.colors.mainColor1Selected};
  }
`;

const StyledButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
`;

const StyledInstructionText = styled.p`
  margin-bottom: 0px;
`;

const StyledCoordinateInput = styled.input`
  width: 100%;
  padding-left: 12px;
  font-size: 16px;
  padding-top: 10px;
  border-radius: 4px;
  border: 2px solid hsl(0, 0%, 80%);
  padding: 5px 10px;
`;

const StyledActionBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const StyledMarkerDeleteButton = styled.button`
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

const StyledInputSection = styled.div`
  display: flex;
  flex-direction: row;
  align-items: baseline;
  gap: 1em;
`;

const StyledInputField = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const StyledButtonLabel = styled.span`
  margin: 0px;
`;

const StyledWarningMessage = styled.p`
  font-size: 12px;
  color: red;
  margin: 0;
`;

const StyledCoordinateSystemSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
  justify-content: space-between;
`;

const StyledCoordinateIndicator = styled.span`
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

const CoordinateTool = () => {
  const { channel, center, currentZoomLevel, coordMarkerIndex } = useSelector(
    (state) => state.rpc
  );
  const { store } = useContext(ReactReduxContext);

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
    x: formatProjectedShown(center.x),
    y: formatProjectedShown(center.y)
  });

  // validation
  const [isValidX, setIsValidX] = useState(true);
  const [isValidY, setIsValidY] = useState(true);

  // projection selection and transform status
  const [selectedProjection, setSelectedProjection] = useState(projectionOptions[0]); // default map SRS
  const [isTransformLoading, setIsTransformLoading] = useState(false);

  // for cancelling/guarding inflight responses
  const activeRequestRef = useRef(null);
  // track user edits so incoming map updates don't overwrite while typing
  const userEditedRef = useRef(false);

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
          x: formatProjectedShown(nativeX),
          y: formatProjectedShown(nativeY)
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
            const dms = coordinateMetricToDegrees([rawX, rawY], 3); // [dmsLon, dmsLat]
            setDisplayedShown({ x: String(dms[0]), y: String(dms[1]) });
          } catch (e) {
            // fallback to show numeric full precision if util fails
            setDisplayedShown({ x: String(rawX), y: String(rawY) });
          }
        } else {
          // projected: show rounded to 3 decimals
          setDisplayedShown({
            x: formatProjectedShown(rawX),
            y: formatProjectedShown(rawY)
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
    [channel, callTransformRPC]
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
        if (activeRequestRef.current !== reqId) return null;
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
          x: formatProjectedShown(center.x),
          y: formatProjectedShown(center.y)
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
        x: formatProjectedShown(mapCenter.x),
        y: formatProjectedShown(mapCenter.y)
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
  }, [selectedProjection, channel]);

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
          x: formatProjectedShown(native.lon),
          y: formatProjectedShown(native.lat)
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
        msgLon = formatProjectedShown(displayedRaw.x);
        msgLat = formatProjectedShown(displayedRaw.y);
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
          x: formatProjectedShown(native.lon),
          y: formatProjectedShown(native.lat)
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
        const native = await transformDisplayedToNative(rawLon, rawLat, selectedProjection.value);
        if (native == null) {
          // transform was superseded by a newer request — nothing to commit
          return;
        }
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
            x: formatProjectedShown(native.lon),
            y: formatProjectedShown(native.lat)
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
    <StyledCoordinateToolContainer
      id="coordinate-tool-container"
      role="region"
      aria-labelledby="coordinate-tool-title"
    >
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
            value={{ value: selectedProjection.value, label: selectedProjection.label }}
            onChange={(opt) => {
              setSelectedProjection(opt);
            }}
            options={projectionOptions}
            isSearchable
            placeholder="Select projection..."
          />
        </div>
      </StyledCoordinateSystemSection>

      <StyledInputSection id="coordinate-tool-input-section-y">
        <StyledCoordinateIndicator id="coordinate-tool-coordinate-indicator-n">
          {isProjectionDegrees(selectedProjection.value)
            ? strings.coordinateTool.lat
            : strings.coordinateTool.n}
        </StyledCoordinateIndicator>
        <StyledInputField id="coordinate-tool-input-field-y">
          <StyledCoordinateInput
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
            <StyledWarningMessage id="coordinate-tool-warning-message-y">
              {strings.coordinateTool.onlyNumbers}
            </StyledWarningMessage>
          )}
        </StyledInputField>
      </StyledInputSection>

      <StyledInputSection id="coordinate-tool-input-section-x">
        <StyledCoordinateIndicator id="coordinate-tool-coordinate-indicator-e">
          {isProjectionDegrees(selectedProjection.value)
            ? strings.coordinateTool.lon
            : strings.coordinateTool.e}
        </StyledCoordinateIndicator>
        <StyledInputField id="coordinate-tool-input-field-x">
          <StyledCoordinateInput
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
            <StyledWarningMessage id="coordinate-tool-warning-message-x">
              {strings.coordinateTool.onlyNumbers}
            </StyledWarningMessage>
          )}
        </StyledInputField>
      </StyledInputSection>

      <StyledActionBox id="coordinate-tool-action-box">
        <StyledButtonGroup id="coordinate-tool-button-group">
          <StyledMapCenterButton
            id="coordinate-tool-map-center-button"
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
          </StyledMapCenterButton>
          <StyledMarkerAdditionButton
            id="coordinate-tool-marker-addition-button"
            onClick={handleAddMarker}
            disabled={!isValidX || !isValidY}
            aria-label={strings.coordinateTool.addMarker}
          >
            <StyledButtonLabel>
              {strings.coordinateTool.addMarker}
            </StyledButtonLabel>
          </StyledMarkerAdditionButton>
        </StyledButtonGroup>
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
            <StyledMarkerDeleteButton
              id="coordinate-tool-marker-delete-button"
              onClick={() => handleDeleteMarkers()}
              aria-label={strings.coordinateTool.deleteMarkers}
            >
              <FontAwesomeIcon icon={faTrash} style={{ marginRight: '1em' }} />
              <StyledButtonLabel>
                {strings.coordinateTool.deleteMarkers}
              </StyledButtonLabel>
            </StyledMarkerDeleteButton>
          </>
        )}
      </StyledActionBox>
    </StyledCoordinateToolContainer>
  );
};

export default CoordinateTool;
