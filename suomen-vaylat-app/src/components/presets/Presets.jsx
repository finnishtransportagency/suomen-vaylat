import { useState, useEffect } from 'react';
import { useAppSelector } from '../../state/hooks';
import styled from 'styled-components';
import strings from '../../translations';

const StyledViewsContainer = styled.div`
    padding: 24px;
`;

const StyledPresetContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const StyledPresteName = styled.input`

`;


const Presets = () => {
    const [presets, setPresets] = useState([]);
    const [presetName, setPresetName] = useState("");

    const {
        center,
        currentZoomLevel,
        selectedLayers,
    } = useAppSelector(state => state.rpc);

    useEffect(() => {
        window.localStorage.getItem("presets") !== null && setPresets(JSON.parse(window.localStorage.getItem("presets")));
    },[]);

    const handleSavePreset = () => {

        let newPreset = {
            id: `preset_${presets.length + 1}`,
            name: presetName,
            saveDate: Date.now(),
            data: {
                zoomLevel: currentZoomLevel,
                x: center.x,
                y: center.y,
                layers: selectedLayers,
                language: strings.getLanguage()
            }
        };

        presets.push(newPreset);
        window.localStorage.setItem('presets', JSON.stringify(presets));
        setPresets(JSON.parse(window.localStorage.getItem("presets")));
        setPresetName("");
    };

    const handleActivatePreset = (preset) => {
       
    };

    const handleRemovePreset = (preset) => {
        let updatedPresets = presets.filter(presetData => presetData.id !== preset.id);
        window.localStorage.setItem('presets', JSON.stringify(updatedPresets));
        setPresets(JSON.parse(window.localStorage.getItem("presets")));

    };


    return (
            <StyledViewsContainer>
                <div>
                {
                    presets.length > 0 ? presets.map(preset => {
                        return <StyledPresetContainer
                                    key={preset.id}
                                    onClick={e => {
                                        e.preventDefault();
                                        handleActivatePreset(preset);
                                    }}
                                >
                                   <p>{preset.name}</p>
                                   <button onClick={() => handleRemovePreset(preset)}>X</button>
                                </StyledPresetContainer>
                    }) : <p>Ei tallennettuja esiasetuksia</p>
                }
                </div>
                <p>TALLENNA NYKYINEN ESIASETUS</p>
                <label htmlFor="preset-name">Nimi</label>
                <StyledPresteName
                    id="preset-name"
                    type="text"
                    value={presetName}
                    onChange={e => setPresetName(e.target.value)}
                />
                <button onClick={() => {
                    presetName !== "" && handleSavePreset()
                }}>SAVE</button>
            </StyledViewsContainer>
    )

};

export default Presets;