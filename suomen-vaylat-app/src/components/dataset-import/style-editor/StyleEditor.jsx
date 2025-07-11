import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { POINT_SHAPES } from "./styleConstants";
import { FILL_ORDER, FILLS, LINE_STYLES } from "./styleConstants"; // Adjust path if needed!

// ---- Styled Components ----
const RadioTypeGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 22px;
`;

const TypeRadioButton = styled.label`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  font-size: 16px;
  font-weight: 600;
  background: ${({ selected }) => selected ? "#fff" : "#f2f4f9"};
  color: ${p => p.selected ? p.theme.colors.mainColor1 : p.theme.colors.darkGrey};
  border: 2px solid ${p => p.selected ? p.theme.colors.mainColor1 : "#e0e3e7"};
  border-radius: 10px;
  cursor: pointer;
  padding: 13px 0 13px 0;
  box-shadow: ${({ selected }) => selected ? "0 4px 12px #ffc68a24" : "none"};
  transition: background .17s, color .17s, border-color .17s;

  input[type="radio"] {
    display: none;
  }

  &:hover, &:focus-within {
    background: #f9fbfc;
    border-color: ${p => !p.selected && p.theme.colors.mainColor1};
    outline: none;
  }
`;

const RadioDot = styled.span`
  width: 17px;
  height: 17px;
  border-radius: 50%;
  box-sizing: border-box;
  margin-right: 9px;
  border: 2.2px solid ${({ selected, theme }) =>
    selected ? theme.colors.mainColor1 : theme.colors.lightGrey};
  background: ${({ selected, theme }) =>
    selected ? theme.colors.transparentMain : theme.colors.white};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background .14s, border-color .14s;
  &:after {
    content: '';
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: ${({ selected, theme }) =>
      selected ? theme.colors.mainColor1 : "transparent"};
    display: block;
    transition: background .12s;
  }
`;


const Grouping = styled.fieldset`
  border: none;
  margin: 0 0 10px 0;
  padding: 0;
`;

const GroupTitle = styled.h6`
  font-weight: 600;
  color: ${p => p.theme.colors.mainColor1};
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
  background: ${p => p.selected ? p.theme.colors.mainColor3transparent80 : "#f3f4f8"};
  border: 2px solid ${p => p.selected ? p.theme.colors.mainColor1 : "#e0e3e7"};
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${p => p.selected ? "0 0 8px #ffbe8b44" : "none"};
  padding: 0;
  &:hover { border-color: ${p => !p.selected && p.theme.colors.lightGrey}; background-color: ${p => !p.selected && p.theme.colors.lightGrey};}
`;

const ColorInput = styled.input`
  border: none;
  background: none;
  width: 37px;
  height: 32px;
  box-shadow: 0 1px 3px #0001;
  margin-left: 5px;
  margin-right: 2px;
  cursor: pointer;
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
      style={{display: 'inline-block', width: size, height: size, verticalAlign: 'middle'}}
      dangerouslySetInnerHTML={{__html: data}}
    />
  );
}

const FillPatternSvgPreview = ({ type }) => {
  // Colors for fill/stroke (match Oskari default preview)
  const DARK = "#444";
  const LIGHT = "#fff";
  const BORDER = "#d2d8df";
  // Render different patterns
  switch (type) {
    case "TRANSPARENT":
      // Checkerboard
      return (
        <svg width="24" height="15">
          <rect x="0" y="0" width="24" height="15" fill={LIGHT} stroke={BORDER} strokeWidth="1"/>
          <rect x="0" y="0" width="6" height="7.5" fill="#e5e7ef"/>
          <rect x="6" y="7.5" width="6" height="7.5" fill="#e5e7ef"/>
          <rect x="12" y="0" width="6" height="7.5" fill="#e5e7ef"/>
          <rect x="18" y="7.5" width="6" height="7.5" fill="#e5e7ef"/>
        </svg>
      );
    case "SOLID":
      return (
        <svg width="24" height="15">
          <rect x="0" y="0" width="24" height="15" fill={DARK} stroke={BORDER} strokeWidth="1"/>
        </svg>
      );
    case "THIN_HORIZONTAL":
      return (
        <svg width="24" height="15">
          <rect x="0" y="0" width="24" height="15" fill={LIGHT} stroke={BORDER} strokeWidth="1"/>
          <line x1="0" y1="4" x2="24" y2="4" stroke={DARK} strokeWidth="1"/>
          <line x1="0" y1="10" x2="24" y2="10" stroke={DARK} strokeWidth="1"/>
        </svg>
      );
    case "THICK_HORIZONTAL":
      return (
        <svg width="24" height="15">
          <rect x="0" y="0" width="24" height="15" fill={LIGHT} stroke={BORDER} strokeWidth="1"/>
          <line x1="0" y1="4" x2="24" y2="4" stroke={DARK} strokeWidth="2"/>
          <line x1="0" y1="10" x2="24" y2="10" stroke={DARK} strokeWidth="2"/>
        </svg>
      );
    case "THIN_DIAGONAL":
      return (
        <svg width="24" height="15">
          <rect x="0" y="0" width="24" height="15" fill={LIGHT} stroke={BORDER} strokeWidth="1"/>
          <line x1="2" y1="13" x2="15" y2="0" stroke={DARK} strokeWidth="1"/>
          <line x1="9" y1="15" x2="24" y2="0" stroke={DARK} strokeWidth="1"/>
          <line x1="19" y1="15" x2="24" y2="10" stroke={DARK} strokeWidth="1"/>
        </svg>
      );
    case "THICK_DIAGONAL":
      return (
        <svg width="24" height="15">
          <rect x="0" y="0" width="24" height="15" fill={LIGHT} stroke={BORDER} strokeWidth="1"/>
          <line x1="2" y1="13" x2="15" y2="0" stroke={DARK} strokeWidth="2"/>
          <line x1="9" y1="15" x2="24" y2="0" stroke={DARK} strokeWidth="2"/>
          <line x1="19" y1="15" x2="24" y2="10" stroke={DARK} strokeWidth="2"/>
        </svg>
      );
    default:
      return null;
  }
};

// --- FILL PATTERNS ---
const fillPatternOptions = FILL_ORDER.map((name) => ({
  id: name,
  label: name[0] + name.slice(1).toLowerCase().replace('_',' '),
  value: FILLS[name],
  preview: <FillPatternSvgPreview type={name}/>
}));

export default function StyleEditor({ initialStyle = {}, onChange }) {
  const [type, setType] = useState("point");

  // Controls
  const [pointColor, setPointColor] = useState(initialStyle?.image?.fill?.color || "#F8931F");
  const [pointShape, setPointShape] = useState(initialStyle?.image?.shape ?? 0);
  const [pointSize, setPointSize] = useState(initialStyle?.image?.size || 3);

  const [lineColor, setLineColor] = useState(initialStyle?.stroke?.color || "#000000");
  const [lineDash, setLineDash] = useState(initialStyle?.stroke?.lineDash || "solid");
  const [lineCap, setLineCap] = useState(initialStyle?.stroke?.lineCap || "round");
  const [lineJoin, setLineJoin] = useState(initialStyle?.stroke?.lineJoin || "round");
  const [lineWidth, setLineWidth] = useState(initialStyle?.stroke?.width || 1);

  const [areaBorderColor, setAreaBorderColor] = useState(initialStyle?.stroke?.area?.color || "#000000");
  const [areaBorderWidth, setAreaBorderWidth] = useState(initialStyle?.stroke?.area?.width || 1);
  const [areaDash, setAreaDash] = useState(initialStyle?.stroke?.area?.lineDash || "solid");
  const [areaJoin, setAreaJoin] = useState(initialStyle?.stroke?.area?.lineJoin || "round");
  const [fillColor, setFillColor] = useState(initialStyle?.fill?.color || "#FAEBD7");
  const [fillPattern, setFillPattern] = useState(initialStyle?.fill?.area?.pattern ?? FILLS.SOLID);

  useEffect(() => {
    let style = {};
    if (type === "point") {
      style = {
        image: {
          shape: pointShape,
          size: pointSize,
          fill: { color: pointColor }
        }
      };
    } else if (type === "line") {
      style = {
        stroke: {
          color: lineColor,
          width: lineWidth,
          lineDash: lineDash,
          lineCap: lineCap,
          lineJoin: lineJoin
        }
      };
    } else if (type === "area") {
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
  }, [type, pointColor, pointShape, pointSize,
      lineColor, lineDash, lineCap, lineJoin, lineWidth,
      fillColor, fillPattern, areaBorderColor, areaBorderWidth,
      areaDash, areaJoin, onChange]);

  return (
    <>
      <GroupTitle>Choose type:</GroupTitle>
      <RadioTypeGroup role="radiogroup" aria-label="Geometry type">
        <TypeRadioButton selected={type === "point"}>
          <input
            type="radio"
            name="geomtype"
            value="point"
            checked={type === "point"}
            onChange={() => setType("point")}
          />
          <RadioDot selected={type === "point"} />
          Point
        </TypeRadioButton>
        <TypeRadioButton selected={type === "line"}>
          <input
            type="radio"
            name="geomtype"
            value="line"
            checked={type === "line"}
            onChange={() => setType("line")}
          />
          <RadioDot selected={type === "line"} />
          Line
        </TypeRadioButton>
        <TypeRadioButton selected={type === "area"}>
          <input
            type="radio"
            name="geomtype"
            value="area"
            checked={type === "area"}
            onChange={() => setType("area")}
          />
          <RadioDot selected={type === "area"} />
          Area
        </TypeRadioButton>
      </RadioTypeGroup>

      {type === "point" && (
        <Grouping>
          <GroupTitle>Point style</GroupTitle>
          <InputRow>
            <InputCol>
              <Label>
                Colour:
              </Label>
              <ColorInput type="color" value={pointColor} onChange={e=>setPointColor(e.target.value)}/>
            </InputCol>
            <InputCol style={{ minWidth: 140 }}>
              <SvgLabel>Shape:</SvgLabel>
              <SvgButtonGroup>
                {POINT_SHAPES.map(s=>(
                  <SvgRadioButton
                    key={s.id}
                    selected={pointShape===s.id}
                    onClick={()=>setPointShape(s.id)}
                    type="button"
                    title={s.label}
                  >
                    {s.preview}
                  </SvgRadioButton>
                ))}
              </SvgButtonGroup>
            </InputCol>
            <InputCol style={{ maxWidth: 110 }}>
              <Label>
                Size:
              </Label>
              <NumberInput type="number" min={1} max={5} value={pointSize} onChange={e=>setPointSize(Number(e.target.value))}/>
            </InputCol>
          </InputRow>
        </Grouping>
      )}

      {type === "line" && (
        <Grouping>
          <GroupTitle>Line style</GroupTitle>
          <InputRow>
            <InputCol>
              <Label>
                Colour:
              </Label>
              <ColorInput type="color" value={lineColor} onChange={e=>setLineColor(e.target.value)} />
            </InputCol>
            <InputCol>
              <SvgLabel>Dash:</SvgLabel>
              <SvgButtonGroup>
                {LINE_STYLES.lineDash.map(opt => (
                  <SvgRadioButton
                    key={opt.name}
                    selected={lineDash === opt.name}
                    onClick={()=>setLineDash(opt.name)}
                    title={opt.name}
                    type="button"
                  >
                    {renderOskariSvg(opt.data, 30)}
                  </SvgRadioButton>
                ))}
              </SvgButtonGroup>
            </InputCol>
          </InputRow>
          <InputRow>
            <InputCol>
              <SvgLabel>Cap:</SvgLabel>
              <SvgButtonGroup>
                {LINE_STYLES.linecaps.map(opt => (
                  <SvgRadioButton
                    key={opt.name}
                    selected={lineCap === opt.name}
                    onClick={()=>setLineCap(opt.name)}
                    title={opt.name}
                    type="button"
                  >
                    {renderOskariSvg(opt.data, 30)}
                  </SvgRadioButton>
                ))}
              </SvgButtonGroup>
            </InputCol>
            <InputCol>
              <SvgLabel>Join:</SvgLabel>
              <SvgButtonGroup>
                {LINE_STYLES.corners.map(opt=>(
                  <SvgRadioButton
                    key={opt.name}
                    selected={lineJoin===opt.name}
                    onClick={()=>setLineJoin(opt.name)}
                    title={opt.name}
                    type="button"
                  >
                    {renderOskariSvg(opt.data, 30)}
                  </SvgRadioButton>
                ))}
              </SvgButtonGroup>
            </InputCol>
            <InputCol style={{ maxWidth: 110 }}>
              <Label>
                Width:
              </Label>
              <NumberInput type="number" min={1} max={5} value={lineWidth} onChange={e=>setLineWidth(Number(e.target.value))}/>
            </InputCol>
          </InputRow>
        </Grouping>
      )}

      {type === "area" && (
        <Grouping>
          <GroupTitle>Area style</GroupTitle>
          
          <InputRow>
            <InputCol>
              <Label>
                Border color:
              </Label>
              <ColorInput type="color" value={areaBorderColor} onChange={e=>setAreaBorderColor(e.target.value)} />
            </InputCol>
            <InputCol>
              <SvgLabel>Dash:</SvgLabel>
              <SvgButtonGroup>
                {LINE_STYLES.lineDash.map(opt=>(
                  <SvgRadioButton
                    key={opt.name}
                    selected={areaDash===opt.name}
                    onClick={()=>setAreaDash(opt.name)}
                    title={opt.name}
                    type="button"
                  >
                    {renderOskariSvg(opt.data, 30)}
                  </SvgRadioButton>
                ))}
              </SvgButtonGroup>
            </InputCol>
            <InputCol>
              <SvgLabel>Join:</SvgLabel>
              <SvgButtonGroup>
                {LINE_STYLES.corners.map(opt=>(
                  <SvgRadioButton
                    key={opt.name}
                    selected={areaJoin===opt.name}
                    onClick={()=>setAreaJoin(opt.name)}
                    title={opt.name}
                    type="button"
                  >
                    {renderOskariSvg(opt.data, 30)}
                  </SvgRadioButton>
                ))}
              </SvgButtonGroup>
            </InputCol>
            <InputCol style={{ maxWidth: 110 }}>
              <Label>
                Width:
              </Label>
              <NumberInput type="number" min={1} max={5} value={areaBorderWidth} onChange={e=>setAreaBorderWidth(Number(e.target.value))}/>
            </InputCol>
          </InputRow>
          <InputRow>
            <InputCol>
              <Label>
                Fill color:
              </Label>
              <ColorInput type="color" value={fillColor} onChange={e=>setFillColor(e.target.value)} />
            </InputCol>
            <InputCol>
              <SvgLabel>Fill pattern:</SvgLabel>
              <SvgButtonGroup>
                {fillPatternOptions.map(opt=>(
                  <SvgRadioButton
                    key={opt.id}
                    selected={fillPattern===opt.value}
                    onClick={()=>setFillPattern(opt.value)}
                    title={opt.label}
                    type="button"
                  >
                    {opt.preview}
                  </SvgRadioButton>
                ))}
              </SvgButtonGroup>
            </InputCol>
          </InputRow>
        </Grouping>
      )}

      <PreviewBox>
        <b>Preview / JSON style to backend:</b>
        <pre style={{margin:0}}>{JSON.stringify(
          type==='point'?{
            image: { shape: pointShape, size: pointSize, fill: { color: pointColor } }
          }:type==='line'?{
            stroke: {
              color: lineColor, width: lineWidth, lineDash: lineDash,
              lineCap: lineCap, lineJoin: lineJoin
            }
          }:{
            fill: { color: fillColor, area: { pattern: fillPattern } },
            stroke: { area: {
              color: areaBorderColor, width: areaBorderWidth,
              lineDash: areaDash, lineJoin: areaJoin
            } }
          }, null, 2)}</pre>
      </PreviewBox>
    </>
  );
}
