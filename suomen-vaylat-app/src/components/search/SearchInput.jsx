import styled from 'styled-components';
import strings from '../../translations';
import { useAppSelector } from '../../state/hooks';
import { useState } from 'react';

// Label and input group
const InputRow = styled.div`
    display: flex;
    gap: 18px;
    width: 100%;
    justify-content: flex-start;
    margin-bottom: 20px;
`;

const InputGroup = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 72px;
`;

const InputLabel = styled.label`
    font-size: 15px;
    margin-bottom: 4px;
    margin-left: 0.5em;
    font-weight: normal;
    color: #222;
    text-align: left;
`;

const PillInput = styled.input`
    width: 72px;
    height: 48px;
    border: 1.5px solid #ccc;
    border-radius: 24px;
    text-align: center;
    font-size: 22px;
    outline: none;
    transition: border-color 0.2s;
    background: #fff;
    margin-bottom: 0;
    &.error {
        border-color: ${props => props.theme.colors.secondaryColorDarkOrange || "#c55"};
    }
    &:focus {
        border-color: #888;
    }
`;

// Standard full width input for address etc.
const WideInputGroup = styled(InputGroup)`
    width: 100%;
    align-items: stretch;
`;

const WidePillInput = styled(PillInput)`
    width: 100%;
    min-width: 180px;
    max-width: 600px;
`;

const StyledFeatureSearchSection = styled.div`
    display: flex;
    flex-direction: column;
    width: 90%;
    margin-bottom: 1em;
`;
const StyledSearchSection = styled.div`
    width: 90%;
    margin-bottom: 1em;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`;

const CheckboxWrapper = styled.div`
    display: flex;
    align-items: center;
    margin-top: 10px;
`;

const StyledCheckbox = styled.input`
    margin-left: 0;
    margin-right: 8px;
    width: 16px;
    height: 16px;
`;

const CheckboxLabel = styled.label`
    font-size: 16px;
    color: ${props => props.theme.colors.darkGrey || "#333"};
`;

const StyledValidationMessage = styled.div`
    color: ${props => props.theme.colors.secondaryColorDarkOrange || "#c55"};
    margin-top: 4px;
`;

const StyledSelectedLayerWrapper = styled.div`
    display: flex;
    align-items: baseline;
    margin-left: 0.5em;
    margin-top: 4px;
    overflow: hidden;
    white-space: nowrap;
`
const StyledSelectedLayerTitle = styled.div`
    color: ${props => props.theme.colors.mainColor1};
    font-size: 16px;
    font-weight: 500;
`
const StyledSelectedLayerText = styled.div`
    font-size: 15px;
    font-weight: 400;
    margin-left: 0.5em;
    margin-right: 0.5em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    &:hover {
        white-space: normal;
    }
`
const StyledNoActivaLayers = styled.div`
    color: ${props => props.theme.colors.secondaryColorDarkOrange};
    font-size: 16px;
    font-weight: 500;
`

// Utility methods for road/track parsing (same as before, abbreviated for brevity)
const getSearchValuePart = (searchValue, searchType, part, carriageWaySearch) => {
    // ... (keep your existing logic here)
    const splittedSearchArray = splitSearchValue(searchValue, searchType, part);
    let retVa;
    let actualPart;
    if (carriageWaySearch === true) {
        if (splittedSearchArray && part > splittedSearchArray.length){
            return ""
        }else {
            actualPart = part;
        }
    } else {
        if (part === 2 || part ===6){
            return ""
        }
        else if (part > 6) {
            actualPart = part - 2;
        } else if ( part >= 3) {
            actualPart = part - 1;
        } else {
            actualPart = part;
        }
    }  
    if(splittedSearchArray !== undefined && (splittedSearchArray.length -1) >= actualPart
        && typeof splittedSearchArray[actualPart] !== 'undefined') {
        retVa= splittedSearchArray[ actualPart];       
    }
    else if (part === 0){
         retVa = searchValue; 
    } 
    else {
        retVa = "";
    }
    return retVa;
}
const splitSearchValue = (searchValue, searchType) => {
    let roadParts;
    if (searchValue!== "" && searchType !== undefined &&
        searchType === 'address' && searchValue.includes("/")){
        if (searchValue.includes(' ')){
            const partsArray = searchValue.split(" ");
            const part1 = partsArray[0].split("/").filter((val) => val !=="")
            const part2 = partsArray[1].split("/").filter((val) => val !=="")
            roadParts = part1.concat(part2)
        }else {
            roadParts =  searchValue.split("/");
        }            
    }
    return roadParts;
}
const updateRoadSearchValue = (searchValue, searchType, setSearchValue, part, value, carriageWaySearch=false) => {
    let searchArray = splitSearchValue(searchValue, searchType);
    const effectivePart = carriageWaySearch ? part : part -1
    if ((searchArray!==undefined && searchArray!=="") && searchArray.length >= effectivePart){
        if (value === ""){
            searchArray.length=part
        }
        const blancSpacePosition = carriageWaySearch ? 4 : 3
        if (part > blancSpacePosition){
            searchArray[effectivePart] = value;
        }else {
            searchArray[part] = value;
        }
        const updatedSearchValue= parseSearchValueFromParts(searchArray, blancSpacePosition)
        if (updatedSearchValue!==undefined){
            setSearchValue(updatedSearchValue);
        }
    } else if ((searchArray===undefined || searchArray==="") && value !== undefined && part === 0) {
        setSearchValue(value);
    } else if ((searchArray===undefined || searchArray==="") && searchValue !== undefined && part === 1) {
        setSearchValue(searchValue + "/" + value);
    } else if ((searchArray!==undefined && searchArray!=="") && searchArray.length === (part -1)) {
        setSearchValue(searchValue + "/" + value);
    } 
}
const parseSearchValueFromParts = (partsArray, blancSpacePosition) => {
    let newSearchValue;
    if (partsArray !== undefined && partsArray.length > (blancSpacePosition -1)){ 
        let firstPart = partsArray.slice(0, blancSpacePosition).join('/')
        let secondi = partsArray.slice(blancSpacePosition).join('/')
        newSearchValue = [firstPart, ' ',secondi].join('') ;
    }else {
        newSearchValue = partsArray.join('/');
    }
    return newSearchValue.endsWith('/') ? newSearchValue.slice(0, -1) : newSearchValue;
}
const getTrackSearchValuePart = (position, searchValue) => {
    if (!searchValue) return '';
    const searchArray = searchValue.split("/");
    return searchArray[position] || '';
}
const updateTrackSearchValue = (newValue, position, searchValue, setSearchValue, trackErrors, setTrackErrors ) => {
    const newErrors = [...(trackErrors ?? [])];
    newErrors[position] = newValue === '';
    setTrackErrors(newErrors);
    let searchArray = searchValue ? searchValue.split("/") : ['','',''];
    searchArray[position] = newValue;
    const newSearchValue = searchArray.join("/");
    setSearchValue(newSearchValue.endsWith('/') ? newSearchValue.slice(0, -1) : newSearchValue);
}
const parseTrackSearchQuery = (searchQuery) => {
    return searchQuery.endsWith('/') ? searchQuery.slice(0, -1) : searchQuery;
}

const SearchInput = ({
    searchValue,
    setSearchValue,
    searchType,
    handleSeach,
    carriageWaySearch, 
    setCarriageWaySearch,
    trackErrors,
    setTrackErrors,
    validateTrackSearch,
    featureErrors
}) => {
    const { selectedLayersByType } = useAppSelector((state) => state.rpc);
    const { activeSwitch } = useAppSelector((state) => state.ui);
    const [roadEndEnabled, setRoadEndEnabled] = useState(false);

    return (
        <>
            {activeSwitch === 'road' &&  (
                <>
                <StyledSearchSection>
                    {/* Start fields */}
                    <InputRow>
                    <div><InputGroup>
                            <InputLabel htmlFor="road-tie">{strings.search.vkm.tie}</InputLabel>
                            <PillInput
                                id="road-tie"
                                type="text"
                                placeholder=""
                                onChange={(e) => updateRoadSearchValue(searchValue, searchType, setSearchValue, 0, e.target.value, carriageWaySearch) }
                                value={getSearchValuePart(searchValue, searchType, 0)}
                                onKeyPress={e => { if (e.key === 'Enter') handleSeach(searchValue); }}
                            />
                        </InputGroup>
                        <InputGroup>
                            <InputLabel htmlFor="road-osa">{strings.search.vkm.osa}</InputLabel>
                            <PillInput
                                id="road-osa"
                                type="text"
                                placeholder=""
                                onChange={(e) => updateRoadSearchValue(searchValue, searchType, setSearchValue, 1, e.target.value, carriageWaySearch) }
                                value={getSearchValuePart(searchValue, searchType, 1)}
                                onKeyPress={e => { if (e.key === 'Enter') handleSeach(searchValue); }}
                            />
                        </InputGroup>
                    </div>
                    <div>
                        <InputGroup>
                            <InputLabel htmlFor="road-majorata">{strings.search.vkm.ajorata}</InputLabel>
                            <PillInput
                                id="road-majorata"
                                type="text"
                                placeholder=""
                                onChange={(e) => updateRoadSearchValue(searchValue, searchType, setSearchValue, 2, e.target.value, carriageWaySearch) }
                                value={getSearchValuePart(searchValue, searchType, 2, carriageWaySearch )}
                                onKeyPress={e => { if (e.key === 'Enter') handleSeach(searchValue); }}
                                disabled={!carriageWaySearch}
                            />
                        </InputGroup>
                        <InputGroup>
                            <InputLabel htmlFor="road-etaisyys">{strings.search.vkm.etaisyys}</InputLabel>
                            <PillInput
                                id="road-etaisyys"
                                type="text"
                                placeholder=""
                                onChange={(e) => updateRoadSearchValue(searchValue, searchType, setSearchValue, carriageWaySearch ? 3 : 2, e.target.value, carriageWaySearch) }
                                value={getSearchValuePart(searchValue, searchType, 3, carriageWaySearch)}
                                onKeyPress={e => { if (e.key === 'Enter') handleSeach(searchValue); }}
                            />
                        </InputGroup>
                    </div>
                        
                        
                    </InputRow>
                    {/* End fields (optional) */}
                    { roadEndEnabled &&
                        <InputRow>
                            <InputGroup>
                                <InputLabel htmlFor="road-tieloppu">{strings.search.vkm.tieloppu}</InputLabel>
                                <PillInput
                                    id="road-tieloppu"
                                    type="text"
                                    placeholder=""
                                    onChange={(e) => updateRoadSearchValue(searchValue, searchType, setSearchValue, 4, e.target.value, carriageWaySearch) }
                                    value={getSearchValuePart(searchValue, searchType, 4, carriageWaySearch)}
                                    onKeyPress={e => { if (e.key === 'Enter') handleSeach(searchValue); }}
                                />
                            </InputGroup>
                            <InputGroup>
                                <InputLabel htmlFor="road-osa-loppu">{strings.search.vkm.osaLoppu}</InputLabel>
                                <PillInput
                                    id="road-osa-loppu"
                                    type="text"
                                    placeholder=""
                                    onChange={(e) => updateRoadSearchValue(searchValue, searchType, setSearchValue, 5, e.target.value, carriageWaySearch) }
                                    value={getSearchValuePart(searchValue, searchType, 5, carriageWaySearch)}
                                    onKeyPress={e => { if (e.key === 'Enter') handleSeach(searchValue); }}
                                />
                            </InputGroup>
                            <InputGroup>
                                <InputLabel htmlFor="road-majorata-loppu">{strings.search.vkm.ajorata}</InputLabel>
                                <PillInput
                                    id="road-majorata-loppu"
                                    type="text"
                                    placeholder=""
                                    value={getSearchValuePart(searchValue, searchType, 6, carriageWaySearch)}
                                    onChange={(e) =>  updateRoadSearchValue(searchValue, searchType, setSearchValue, 6, e.target.value, carriageWaySearch)}
                                    onKeyPress={e => { if (e.key === 'Enter') handleSeach(searchValue); }}
                                    disabled={!carriageWaySearch}
                                />
                            </InputGroup>
                            <InputGroup>
                                <InputLabel htmlFor="road-etaisyys-loppu">{strings.search.vkm.etaisyysLoppu}</InputLabel>
                                <PillInput
                                    id="road-etaisyys-loppu"
                                    type="text"
                                    placeholder=""
                                    value={ getSearchValuePart(searchValue, searchType, 7, carriageWaySearch)}
                                    onChange={(e) => updateRoadSearchValue(searchValue, searchType, setSearchValue, carriageWaySearch ? 7 : 6, e.target.value, carriageWaySearch) }
                                    onKeyPress={e => { if (e.key === 'Enter') handleSeach(searchValue); }}
                                />
                            </InputGroup>
                        </InputRow>
                    }
                    <CheckboxWrapper>
                        <StyledCheckbox
                            id='carriageWaySearchBox'
                            name='carriageWaySearchBox'
                            type='checkbox'
                            onChange={() => (setCarriageWaySearch(!carriageWaySearch))}
                            checked={carriageWaySearch}
                        />
                        <CheckboxLabel htmlFor='carriageWaySearchBox'>{strings.search.carriageWaySearch}</CheckboxLabel>
                    </CheckboxWrapper>
                    <CheckboxWrapper>
                        <StyledCheckbox
                            id='roadEndCheckbox'
                            name='roadEndCheckbox'
                            type='checkbox'
                            onChange={() => (setRoadEndEnabled(!roadEndEnabled))}
                            checked={roadEndEnabled}
                        />
                        <CheckboxLabel htmlFor='roadEndCheckbox'>{"Anna tien loppu tiedot"}</CheckboxLabel>
                    </CheckboxWrapper>
                </StyledSearchSection>  
                </>
            )}

            {activeSwitch === 'track' && (
                <StyledSearchSection>
                    <InputRow>
                        <InputGroup>
                            <InputLabel htmlFor="track-tracknumber">{strings.search.track.tracknumber}</InputLabel>
                            <PillInput
                                id="track-tracknumber"
                                type="text"
                                value={getTrackSearchValuePart(0, searchValue)}
                                onChange={(e) => updateTrackSearchValue(e.target.value, 0, searchValue, setSearchValue, trackErrors, setTrackErrors)}
                                onKeyPress={e => {
                                    if (e.key === 'Enter') {
                                        if (validateTrackSearch(searchValue, setTrackErrors)){
                                            handleSeach(parseTrackSearchQuery(searchValue));
                                        }
                                    }
                                }}
                                className={trackErrors[0] ? 'error' : ''}
                            />
                        </InputGroup>
                        <InputGroup>
                            <InputLabel htmlFor="track-trackkm">{strings.search.track.trackkm}</InputLabel>
                            <PillInput
                                id="track-trackkm"
                                type="text"
                                value={getTrackSearchValuePart(1, searchValue)}
                                onChange={(e) => updateTrackSearchValue(e.target.value,1, searchValue, setSearchValue, trackErrors, setTrackErrors) }
                                onKeyPress={e => {
                                    if (e.key === 'Enter') {
                                        if (validateTrackSearch(searchValue, setTrackErrors)){
                                            handleSeach(parseTrackSearchQuery(searchValue));
                                        }
                                    }
                                }}
                                className={trackErrors[1] ? 'error' : ''}
                            />
                        </InputGroup>
                        <InputGroup>
                            <InputLabel htmlFor="track-trackm">{strings.search.track.trackm}</InputLabel>
                            <PillInput
                                id="track-trackm"
                                type="text"
                                value={getTrackSearchValuePart(2, searchValue)}
                                onChange={(e) => updateTrackSearchValue(e.target.value,2, searchValue, setSearchValue, trackErrors, setTrackErrors)}
                                onKeyPress={e => {
                                    if (e.key === 'Enter') {
                                        if (validateTrackSearch(searchValue, setTrackErrors)){
                                            handleSeach(parseTrackSearchQuery(searchValue));
                                        }
                                    }
                                }}
                                className={trackErrors[2] ? 'error' : ''}
                            />
                        </InputGroup>
                    </InputRow>
                    { trackErrors.some((error) => error === true) && (
                        <StyledValidationMessage>
                            {strings.search.track.trackMandatoryMessage}
                        </StyledValidationMessage>
                    )}
                </StyledSearchSection>
            )}

            {activeSwitch === 'address' && (
                <StyledSearchSection>
                    <WideInputGroup>
                        <InputLabel htmlFor="address-search">{strings.tooltips.searchButton}</InputLabel>
                        <WidePillInput
                            id="address-search"
                            type="text"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            onKeyPress={e => {
                                if (e.key === 'Enter') handleSeach(searchValue);
                            }}
                        />
                    </WideInputGroup>
                </StyledSearchSection>
            )}

            {activeSwitch === 'nomenclature' && (
                <StyledSearchSection>
                    <WideInputGroup>
                        <InputLabel htmlFor="nomenclature-search">{strings.search.nomenclature.title}</InputLabel>
                        <WidePillInput
                            id="nomenclature-search"
                            type="text"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            onKeyPress={e => {
                                if (e.key === 'Enter') handleSeach(searchValue);
                            }}
                        />
                    </WideInputGroup>
                </StyledSearchSection>
            )}

            {activeSwitch === 'premise' && (
                <StyledSearchSection>
                    <WideInputGroup>
                        <InputLabel htmlFor="premise-search">{strings.search.premise.title}</InputLabel>
                        <WidePillInput
                            id="premise-search"
                            type="text"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            onKeyPress={e => {
                                if (e.key === 'Enter') handleSeach(searchValue);
                            }}
                        />
                    </WideInputGroup>
                </StyledSearchSection>
            )}

            {activeSwitch === 'layer' && (
                <StyledSearchSection>
                    <WideInputGroup>
                        <InputLabel htmlFor="metadata-search">{strings.search.layer.title}</InputLabel>
                        <WidePillInput
                            id="metadata-search"
                            type="text"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            onKeyPress={e => {
                                if (e.key === 'Enter') handleSeach(searchValue);
                            }}
                        />
                    </WideInputGroup>
                </StyledSearchSection>
            )}

            {activeSwitch === 'feature' && (
                <StyledFeatureSearchSection>
                    <WideInputGroup>
                        <InputLabel htmlFor="feature-search">{strings.search.feature.title}</InputLabel>
                        <WidePillInput
                            id="feature-search"
                            type="text"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            onKeyPress={e => {
                                if (e.key === 'Enter') handleSeach(searchValue.trim());
                            }}
                            className={featureErrors.length > 0 ? 'error' : ''}
                        />
                    </WideInputGroup>

                    <StyledSelectedLayerWrapper>
                        { selectedLayersByType.mapLayers.length > 0 ?
                            (
                                <>
                                    <StyledSelectedLayerTitle>{ strings.search.feature.searchFromLayer }</StyledSelectedLayerTitle>
                                    <StyledSelectedLayerText>{ selectedLayersByType.mapLayers[0].name }</StyledSelectedLayerText>
                                </>
                            )
                        :
                            (
                                <StyledNoActivaLayers></StyledNoActivaLayers>
                            )
                        }
                    </StyledSelectedLayerWrapper>
                </StyledFeatureSearchSection>
            )}
        </>
    );
};

export default SearchInput;
