import React, { useState, useEffect } from 'react';

import styled from 'styled-components';
import { POINT_SHAPES } from './styleConstants';
import {
  FILL_ORDER,
  FILLS,
  LINE_STYLES,
  FillPatternSvgPreview
} from './styleConstants';
import strings from '../../../translations';
import ColorPicker from './ColorPicker';

const RadioTypeGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 22px;
  @media ${(props) => props.theme.device.mobileL} {
    flex-direction: column;
  }
`;

const TypeRadioButton = styled.label`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  font-size: 16px;
  font-weight: 600;
  background: ${({ selected }) => (selected ? '#fff' : '#f2f4f9')};
  color: ${(p) =>
    p.selected ? p.theme.colors.mainColor1 : p.theme.colors.darkGrey};
  border: 2px solid
    ${(p) => (p.selected ? p.theme.colors.mainColor1 : '#e0e3e7')};
  border-radius: 10px;
  cursor: pointer;
  padding: 13px 0 13px 0;
  box-shadow: ${({ selected }) => (selected ? '0 4px 12px #ffc68a24' : 'none')};
  transition: background 0.17s, color 0.17s, border-color 0.17s;

  input[type='radio'] {
    display: none;
  }

  &:hover,
  &:focus-within {
    background: #f9fbfc;
    border-color: ${(p) => !p.selected && p.theme.colors.mainColor1};
    outline: none;
  }
`;

const RadioDot = styled.span`
  width: 17px;
  height: 17px;
  border-radius: 50%;
  box-sizing: border-box;
  margin-right: 9px;
  border: 2.2px solid
    ${({ selected, theme }) =>
      selected ? theme.colors.mainColor1 : theme.colors.lightGrey};
  background: ${({ selected, theme }) =>
    selected ? theme.colors.transparentMain : theme.colors.white};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.14s, border-color 0.14s;
  &:after {
    content: '';
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: ${({ selected, theme }) =>
      selected ? theme.colors.mainColor1 : 'transparent'};
    display: block;
    transition: background 0.12s;
  }
`;

const Grouping = styled.fieldset`
  border: none;
  margin: 0 0 10px 0;
  padding: 0;
`;

const GroupTitle = styled.h6`
  font-weight: 600;
  color: ${(p) => p.theme.colors.mainColor1};
`;

const StyledJSONPreviewTitle = styled.p`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 1em;
`;

const Label = styled.label`
  display: block;
  color: #353a4a;
  margin-bottom: 5px;
  font-weight: 500;
  font-size: 13.7px;
`;

const SvgLabel = styled.div`
  color: #353a4a;
  font-size: 13.7px;
  font-weight: 500;
  margin-bottom: 5px;
`;

const InputRow = styled.div`
  display: flex;
  gap: 1em 2em;
  margin-bottom: 12px;
  align-items: center;
  flex-wrap: wrap;
`;

const InputCol = styled.div`
  min-width: 126px;
  margin-bottom: 3px;
`;

const SvgButtonGroup = styled.div`
  display: flex;
  gap: 7px;
`;

const SvgRadioButton = styled.button`
  width: 38px;
  height: 38px;
  background: ${(p) =>
    p.selected ? p.theme.colors.mainColor3transparent80 : '#f3f4f8'};
  border: 2px solid
    ${(p) => (p.selected ? p.theme.colors.mainColor1 : '#e0e3e7')};
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${(p) => (p.selected ? '0 0 8px #ffbe8b44' : 'none')};
  padding: 0;
  &:hover {
    border-color: ${(p) => !p.selected && p.theme.colors.darkGrey};
    background-color: ${(p) => !p.selected && p.theme.colors.lightGrey};
  }
`;

const NumberInput = styled.input`
  width: 54px;
  padding: 5px 7px;
  font-size: 14px;
  border: 1.5px solid #e3e7ec;
  border-radius: 6px;
  background: #fafbfd;
`;

const PreviewBox = styled.div`
  background: #f7f8fd;
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 12.2px;
  color: #485261;
  margin-top: 20px;
  overflow-x: auto;
  border: 1px solid #e4e8ed;
`;

function renderOskariSvg(data, size = 32) {
  return (
    <span
      style={{
        display: 'inline-block',
        width: size,
        height: size,
        verticalAlign: 'middle'
      }}
      dangerouslySetInnerHTML={{ __html: data }}
    />
  );
}

const fillPatternOptions = FILL_ORDER.map((name) => ({
  id: name,
  label: name[0] + name.slice(1).toLowerCase().replace('_', ' '),
  value: FILLS[name],
  preview: <FillPatternSvgPreview type={name} />
}));

export default function StyleEditor({ initialStyle = {}, onChange }) {
  const [type, setType] = useState('point');

  // Controls
  const [pointColor, setPointColor] = useState(
    initialStyle?.image?.fill?.color || '#F8931F'
  );
  const [pointShape, setPointShape] = useState(initialStyle?.image?.shape ?? 0);
  const [pointSize, setPointSize] = useState(initialStyle?.image?.size || 3);

  const [lineColor, setLineColor] = useState(
    initialStyle?.stroke?.color || '#000000'
  );
  const [lineDash, setLineDash] = useState(
    initialStyle?.stroke?.lineDash || 'solid'
  );
  const [lineCap, setLineCap] = useState(
    initialStyle?.stroke?.lineCap || 'round'
  );
  const [lineJoin, setLineJoin] = useState(
    initialStyle?.stroke?.lineJoin || 'round'
  );
  const [lineWidth, setLineWidth] = useState(initialStyle?.stroke?.width || 1);

  const [areaBorderColor, setAreaBorderColor] = useState(
    initialStyle?.stroke?.area?.color || '#000000'
  );
  const [areaBorderWidth, setAreaBorderWidth] = useState(
    initialStyle?.stroke?.area?.width || 1
  );
  const [areaDash, setAreaDash] = useState(
    initialStyle?.stroke?.area?.lineDash || 'solid'
  );
  const [areaJoin, setAreaJoin] = useState(
    initialStyle?.stroke?.area?.lineJoin || 'round'
  );
  const [fillColor, setFillColor] = useState(
    initialStyle?.fill?.color || '#FAEBD7'
  );
  const [fillPattern, setFillPattern] = useState(
    initialStyle?.fill?.area?.pattern ?? FILLS.SOLID
  );

  useEffect(() => {
    let style = {};
    if (type === 'point') {
      style = {
        image: {
          shape: pointShape,
          size: pointSize,
          fill: { color: pointColor }
        }
      };
    } else if (type === 'line') {
      style = {
        stroke: {
          color: lineColor,
          width: lineWidth,
          lineDash: lineDash,
          lineCap: lineCap,
          lineJoin: lineJoin
        }
      };
    } else if (type === 'area') {
      style = {
        fill: {
          color: fillColor,
          area: { pattern: fillPattern }
        },
        stroke: {
          area: {
            color: areaBorderColor,
            width: areaBorderWidth,
            lineDash: areaDash,
            lineJoin: areaJoin
          }
        }
      };
    }
    if (onChange) onChange(style);
    // eslint-disable-next-line
  }, [
    type,
    pointColor,
    pointShape,
    pointSize,
    lineColor,
    lineDash,
    lineCap,
    lineJoin,
    lineWidth,
    fillColor,
    fillPattern,
    areaBorderColor,
    areaBorderWidth,
    areaDash,
    areaJoin,
    onChange
  ]);

  const seStrings = strings?.datasetImport?.styleEditor || {};

  // ---- IDS for controls ----
  const ids = {
    styleTab: 'import-dataset-style-tablist',
    radioPoint: 'import-dataset-style-type-point',
    radioLine: 'import-dataset-style-type-line',
    radioArea: 'import-dataset-style-type-area',
    panelPoint: 'import-dataset-style-panel-point',
    panelLine: 'import-dataset-style-panel-line',
    panelArea: 'import-dataset-style-panel-area',

    pointColor: 'import-dataset-style-point-color',
    pointShape: 'import-dataset-style-point-shape',
    pointSize: 'import-dataset-style-point-size',

    lineColor: 'import-dataset-style-line-color',
    lineDash: 'import-dataset-style-line-dash',
    lineCap: 'import-dataset-style-line-cap',
    lineJoin: 'import-dataset-style-line-join',
    lineWidth: 'import-dataset-style-line-width',

    areaBorderColor: 'import-dataset-style-area-border-color',
    areaBorderDash: 'import-dataset-style-area-border-dash',
    areaBorderJoin: 'import-dataset-style-area-border-join',
    areaBorderWidth: 'import-dataset-style-area-border-width',
    fillColor: 'import-dataset-style-area-fill-color',
    fillPattern: 'import-dataset-style-area-fill-pattern',

    jsonPreview: 'import-dataset-style-json-preview'
  };

  // --- accessible tab-radio names
  const radioGroupLabel = seStrings.subheaders?.style || 'Style';

  return (
    <div>
      <GroupTitle id={ids.styleTab}>{radioGroupLabel}</GroupTitle>
      <RadioTypeGroup
        id={`${ids.styleTab}-group`}
        role="radiogroup"
        aria-label={radioGroupLabel}
        aria-labelledby={ids.styleTab}
      >
        <TypeRadioButton
          selected={type === 'point'}
          htmlFor={ids.radioPoint}
          id={`${ids.radioPoint}-label`}
        >
          <input
            id={ids.radioPoint}
            type="radio"
            name="geomtype"
            value="point"
            checked={type === 'point'}
            onChange={() => setType('point')}
            aria-controls={ids.panelPoint}
            aria-label={seStrings.dot?.title || 'Point feature style'}
          />
          <RadioDot selected={type === 'point'} aria-hidden="true" />
          {seStrings.dot?.title || 'Point feature style'}
        </TypeRadioButton>
        <TypeRadioButton
          selected={type === 'line'}
          htmlFor={ids.radioLine}
          id={`${ids.radioLine}-label`}
        >
          <input
            id={ids.radioLine}
            type="radio"
            name="geomtype"
            value="line"
            checked={type === 'line'}
            onChange={() => setType('line')}
            aria-controls={ids.panelLine}
            aria-label={seStrings.line?.title || 'Line feature style'}
          />
          <RadioDot selected={type === 'line'} aria-hidden="true" />
          {seStrings.line?.title || 'Line feature style'}
        </TypeRadioButton>
        <TypeRadioButton
          selected={type === 'area'}
          htmlFor={ids.radioArea}
          id={`${ids.radioArea}-label`}
        >
          <input
            id={ids.radioArea}
            type="radio"
            name="geomtype"
            value="area"
            checked={type === 'area'}
            onChange={() => setType('area')}
            aria-controls={ids.panelArea}
            aria-label={seStrings.area?.title || 'Area feature style'}
          />
          <RadioDot selected={type === 'area'} aria-hidden="true" />
          {seStrings.area?.title || 'Area feature style'}
        </TypeRadioButton>
      </RadioTypeGroup>

      {/* POINT PANEL */}
      {type === 'point' && (
        <Grouping
          id={ids.panelPoint}
          role="region"
          aria-labelledby={ids.radioPoint}
        >
          <GroupTitle>
            {seStrings.dot?.title || 'Point feature style'}
          </GroupTitle>
          <InputRow>
            <InputCol>
              <Label htmlFor={ids.pointColor}>
                {seStrings.dot?.color?.label || 'Colour'}:
              </Label>
              <ColorPicker
                id={ids.pointColor + "-color-picker"}
                value={pointColor}
                onChange={setPointColor}
                ariaLabel={seStrings.dot?.color?.label || 'Colour'}
              />
            </InputCol>
            <InputCol style={{ minWidth: 140 }}>
              <SvgLabel id={`${ids.pointShape}-label`}>
                {seStrings.dot?.symbol?.label || 'Icon'}:
              </SvgLabel>
              <SvgButtonGroup
                role="group"
                aria-labelledby={`${ids.pointShape}-label`}
              >
                {POINT_SHAPES.map((s) => (
                  <SvgRadioButton
                    key={s.id}
                    id={`${ids.pointShape}-${s.id}`}
                    selected={pointShape === s.id}
                    aria-label={s.label}
                    onClick={() => setPointShape(s.id)}
                    type="button"
                    title={s.label}
                    tabIndex={0}
                  >
                    {s.preview}
                  </SvgRadioButton>
                ))}
              </SvgButtonGroup>
            </InputCol>
            <InputCol style={{ maxWidth: 110 }}>
              <Label htmlFor={ids.pointSize}>
                {seStrings.dot?.size?.label || 'Size'}:
              </Label>
              <NumberInput
                id={ids.pointSize}
                type="number"
                min={1}
                max={5}
                value={pointSize}
                onChange={(e) => setPointSize(Number(e.target.value))}
              />
            </InputCol>
          </InputRow>
        </Grouping>
      )}

      {/* LINE PANEL */}
      {type === 'line' && (
        <Grouping
          id={ids.panelLine}
          role="region"
          aria-labelledby={ids.radioLine}
        >
          <GroupTitle>
            {seStrings.line?.title || 'Line feature style'}
          </GroupTitle>
          <InputRow>
            <InputCol>
              <Label htmlFor={ids.lineColor}>
                {seStrings.line?.color?.label || 'Colour'}:
              </Label>
              <ColorPicker
                id={ids.lineColor + "-color-picker"}
                value={lineColor}
                onChange={setLineColor}
                ariaLabel={seStrings.dot?.color?.label || 'Colour'}
              />
            </InputCol>
            <InputCol>
              <SvgLabel id={`${ids.lineDash}-label`}>
                {seStrings.line?.style?.label || 'Dash'}:
              </SvgLabel>
              <SvgButtonGroup
                role="group"
                aria-labelledby={`${ids.lineDash}-label`}
              >
                {LINE_STYLES.lineDash.map((opt) => (
                  <SvgRadioButton
                    key={opt.name}
                    id={`${ids.lineDash}-${opt.name}`}
                    selected={lineDash === opt.name}
                    aria-label={opt.name}
                    onClick={() => setLineDash(opt.name)}
                    title={opt.name}
                    type="button"
                    tabIndex={0}
                  >
                    {renderOskariSvg(opt.data, 30)}
                  </SvgRadioButton>
                ))}
              </SvgButtonGroup>
            </InputCol>
          </InputRow>
          <InputRow>
            <InputCol>
              <SvgLabel id={`${ids.lineCap}-label`}>
                {seStrings.line?.cap?.label || 'Endings'}:
              </SvgLabel>
              <SvgButtonGroup
                role="group"
                aria-labelledby={`${ids.lineCap}-label`}
              >
                {LINE_STYLES.linecaps.map((opt) => (
                  <SvgRadioButton
                    key={opt.name}
                    id={`${ids.lineCap}-${opt.name}`}
                    selected={lineCap === opt.name}
                    aria-label={opt.name}
                    onClick={() => setLineCap(opt.name)}
                    title={opt.name}
                    type="button"
                    tabIndex={0}
                  >
                    {renderOskariSvg(opt.data, 30)}
                  </SvgRadioButton>
                ))}
              </SvgButtonGroup>
            </InputCol>
            <InputCol>
              <SvgLabel id={`${ids.lineJoin}-label`}>
                {seStrings.line?.corner?.label || 'Corners'}:
              </SvgLabel>
              <SvgButtonGroup
                role="group"
                aria-labelledby={`${ids.lineJoin}-label`}
              >
                {LINE_STYLES.corners.map((opt) => (
                  <SvgRadioButton
                    key={opt.name}
                    id={`${ids.lineJoin}-${opt.name}`}
                    selected={lineJoin === opt.name}
                    aria-label={opt.name}
                    onClick={() => setLineJoin(opt.name)}
                    title={opt.name}
                    type="button"
                    tabIndex={0}
                  >
                    {renderOskariSvg(opt.data, 30)}
                  </SvgRadioButton>
                ))}
              </SvgButtonGroup>
            </InputCol>
            <InputCol style={{ maxWidth: 110 }}>
              <Label htmlFor={ids.lineWidth}>
                {seStrings.line?.width?.label || 'Width'}:
              </Label>
              <NumberInput
                id={ids.lineWidth}
                type="number"
                min={1}
                max={5}
                value={lineWidth}
                onChange={(e) => setLineWidth(Number(e.target.value))}
              />
            </InputCol>
          </InputRow>
        </Grouping>
      )}

      {/* AREA PANEL */}
      {type === 'area' && (
        <Grouping
          id={ids.panelArea}
          role="region"
          aria-labelledby={ids.radioArea}
        >
          <GroupTitle>
            {seStrings.area?.title || 'Area feature style'}
          </GroupTitle>
          <InputRow>
            <InputCol>
              <Label htmlFor={ids.areaBorderColor}>
                {seStrings.area?.linecolor?.label || 'Line colour'}:
              </Label>
              <ColorPicker
                id={ids.areaBorderColor + "-color-picker"}
                value={areaBorderColor}
                onChange={setAreaBorderColor}
                ariaLabel={seStrings.dot?.color?.label || 'Colour'}
              />
            </InputCol>
            <InputCol>
              <SvgLabel id={`${ids.areaBorderDash}-label`}>
                {seStrings.area?.linestyle?.label || 'Line dash'}:
              </SvgLabel>
              <SvgButtonGroup
                role="group"
                aria-labelledby={`${ids.areaBorderDash}-label`}
              >
                {LINE_STYLES.lineDash.map((opt) => (
                  <SvgRadioButton
                    key={opt.name}
                    id={`${ids.areaBorderDash}-${opt.name}`}
                    selected={areaDash === opt.name}
                    aria-label={opt.name}
                    onClick={() => setAreaDash(opt.name)}
                    title={opt.name}
                    type="button"
                    tabIndex={0}
                  >
                    {renderOskariSvg(opt.data, 30)}
                  </SvgRadioButton>
                ))}
              </SvgButtonGroup>
            </InputCol>
            <InputCol>
              <SvgLabel id={`${ids.areaBorderJoin}-label`}>
                {seStrings.area?.linecorner?.label || 'Line corners'}:
              </SvgLabel>
              <SvgButtonGroup
                role="group"
                aria-labelledby={`${ids.areaBorderJoin}-label`}
              >
                {LINE_STYLES.corners.map((opt) => (
                  <SvgRadioButton
                    key={opt.name}
                    id={`${ids.areaBorderJoin}-${opt.name}`}
                    selected={areaJoin === opt.name}
                    aria-label={opt.name}
                    onClick={() => setAreaJoin(opt.name)}
                    title={opt.name}
                    type="button"
                    tabIndex={0}
                  >
                    {renderOskariSvg(opt.data, 30)}
                  </SvgRadioButton>
                ))}
              </SvgButtonGroup>
            </InputCol>
            <InputCol style={{ maxWidth: 110 }}>
              <Label htmlFor={ids.areaBorderWidth}>
                {seStrings.area?.linewidth?.label || 'Line width'}:
              </Label>
              <NumberInput
                id={ids.areaBorderWidth}
                type="number"
                min={1}
                max={5}
                value={areaBorderWidth}
                onChange={(e) => setAreaBorderWidth(Number(e.target.value))}
              />
            </InputCol>
          </InputRow>
          <InputRow>
            <InputCol>
              <Label htmlFor={ids.fillColor}>
                {seStrings.area?.color?.label || 'Fill colour'}:
              </Label>
              <ColorPicker
                id={ids.fillColor + "-color-picker"}
                value={fillColor}
                onChange={setFillColor}
                ariaLabel={seStrings.dot?.color?.label || 'Colour'}
              />
            </InputCol>
            <InputCol>
              <SvgLabel id={`${ids.fillPattern}-label`}>
                {seStrings.area?.fill?.label || 'Fill pattern'}:
              </SvgLabel>
              <SvgButtonGroup
                role="group"
                aria-labelledby={`${ids.fillPattern}-label`}
              >
                {fillPatternOptions.map((opt) => (
                  <SvgRadioButton
                    key={opt.id}
                    id={`${ids.fillPattern}-${opt.id}`}
                    selected={fillPattern === opt.value}
                    aria-label={opt.label}
                    onClick={() => setFillPattern(opt.value)}
                    title={opt.label}
                    type="button"
                    tabIndex={0}
                  >
                    {opt.preview}
                  </SvgRadioButton>
                ))}
              </SvgButtonGroup>
            </InputCol>
          </InputRow>
        </Grouping>
      )}

      <PreviewBox
        id={ids.jsonPreview}
        aria-label={seStrings.preview?.label || 'Preview'}
        role="region"
      >
        <StyledJSONPreviewTitle>
          {seStrings.preview?.label || 'Preview'}
        </StyledJSONPreviewTitle>
        <pre style={{ margin: 0 }}>
          {JSON.stringify(
            type === 'point'
              ? {
                  image: {
                    shape: pointShape,
                    size: pointSize,
                    fill: { color: pointColor }
                  }
                }
              : type === 'line'
              ? {
                  stroke: {
                    color: lineColor,
                    width: lineWidth,
                    lineDash: lineDash,
                    lineCap: lineCap,
                    lineJoin: lineJoin
                  }
                }
              : {
                  fill: { color: fillColor, area: { pattern: fillPattern } },
                  stroke: {
                    area: {
                      color: areaBorderColor,
                      width: areaBorderWidth,
                      lineDash: areaDash,
                      lineJoin: areaJoin
                    }
                  }
                },
            null,
            2
          )}
        </pre>
      </PreviewBox>
    </div>
  );
}
