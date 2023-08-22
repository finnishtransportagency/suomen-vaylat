import { useState, useContext, useEffect, useRef, useCallback } from 'react';
import { useAppSelector } from '../../state/hooks';
import { ReactReduxContext } from 'react-redux';

import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';
import strings from '../../translations';
import Dropdown from '../select/Dropdown';
import { faPlus, faTimes, faTrash, faBullhorn } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//import { fetchFeaturesSynchronous, fetchContentFromChannel } from '../../utils/gfiUtil';
import { setWarning } from '../../state/slices/uiSlice';


import { setFilters, setFilteringInfo , setVKMData, setGFICroppingArea, setGFILocations } from '../../state/slices/rpcSlice';


const BODY_SIZE_EXCEED = "BODY_SIZE_EXCEED";
const GENERAL_FAIL = "GENERAL_FAIL";


const StyledFilterProp = styled.div`

`;  

const StyledFilterPropContainer = styled.div`
    width: 95%;
`;  


const StyledFilterHeader = styled.div`
    font-size: 16px;
    font-weight: bold;
`;  

const StyledModalContainer = styled.div`
    :after {
        content: "";
        display: table;
        clear: both;
    }
    padding-left: 20px;
    padding-right: 20px;
    margin-top: 30px;
    margin-bottom: 30px;
    min-height: 160px;
    min-width: 800px;
    position: relative;
`;

const StyledModalFloatingChapter = styled.div`
    float: left;
    width: 29%;
    margin-left: 6px;
    position: relative; 
`;
const StyledModalFloatingActionChapter = styled.div`
    width: 7%;
    margin-left: 6px;
    float: left;
    position: relative; 
`;


const StyledInput = styled.input`
    width: 100%;
    padding-left: 12px;
    font-size: 16px;
    padding-top: 10px;
    border-radius: 4px;
    border: 2px solid;
    border-color: hsl(0, 0%, 80%);
    padding: 5px 10px;
`;

const StyledFilterContainer = styled.div`
    padding-top: 1em;
    margin-left: 6px;
    //position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;

const StyledFilterResultContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

const StyledFilterReusltButtons = styled.div`
    display: flex;
    align-items: flex-end;
`;

const StyledFilter = styled.div`
    background-color: #f2f2f2;
    //float: left;
    border: solid 1px black;
    border-radius: 7px;
    //margin-left: 5px;
    margin-bottom: 5px;
    padding-left: 3px;
    padding-right: 3px;
    :nth-child(odd) {
        background-color: white;
        //margin-left: 5px;
    }
    :nth-child(3) {
        //float: none;
    }
    display: flex;
`;

const StyledSelectedTabDisplayOptionsButton = styled.div`
    position: relative;
    right: 0px;
    padding: 8px;
    cursor: pointer;
    color: ${(props) => props.theme.colors.mainColor1};
    svg {
        font-size: 24px;
    };
`;

const StyledIconWrapper = styled.div`
    border: none;
    background: none;
    cursor: pointer;
    svg {
        color: ${props => props.theme.colors.mainColor1};
        font-size: 20px;
        transition: all 0.1s ease-out;
    };
    &:hover {
        svg {
            color: ${props => props.theme.colors.mainColor2};
        }
    };
    float: right;
    margin-right: 8px;
`;

const StyledFloatingDiv = styled.div`
    :after {
        content: "";
        display: table;
        clear: both;
    }
`;

export const FilterModal = () => {
    const { filters, activeGFILayer, filteringInfo } = useAppSelector((state) => state.rpc);
    const { store } = useContext(ReactReduxContext);
    const [ operatorValue,  setOperatorValue] = useState({});
    const [ filterValue, setFilterValue] = useState("");
    const [ propValue, setPropValue] = useState({});

    useEffect(() => {
        const filtersFromLocalStorage = JSON.parse(localStorage.getItem('filters'));
        if (filtersFromLocalStorage) {
            store.dispatch(setFilters(filtersFromLocalStorage));
        }
      }, []);

    const addFilter = () => {
        const prop = propValue.value;
        const value = filterValue;
        const oper = operatorValue.value;
        const layer = filteringInfo?.chosenLayer; 

        if (!prop || !value || !oper){
            return
        }
        store.dispatch(setFilters(
            [...filters,
            {   
                "layer" : layer,
                "property": prop,
                "operator": oper,
                "value": value
            }
        ]
        ));
        setPropValue({})
        setFilterValue("")
        setOperatorValue({})
    }

    const gfiFilteringNumberOptions = [
        { value: 'equals', label: strings.gfifiltering.operators.equals },
        { value: 'notEquals', label: strings.gfifiltering.operators.notEquals },
        { value: 'smallerThan', label: strings.gfifiltering.operators.smallerThan },
        { value: 'biggerThan', label: strings.gfifiltering.operators.biggerThan },
    ];

    const gfiFilteringStringOptions = [
        { value: 'equals', label: strings.gfifiltering.operators.equals },
        { value: 'notEquals', label: strings.gfifiltering.operators.notEquals },
        { value: 'includes', label: strings.gfifiltering.operators.includes },
        { value: 'doesntInclude', label: strings.gfifiltering.operators.doesntInclude },
    ];

    var comparisonOperatorsHash = {
        'number': gfiFilteringNumberOptions,
        'string': gfiFilteringStringOptions
    };
    
    useEffect(() => {
        const filterInfoFromlStorage = JSON.parse(localStorage.getItem('filteringInfo'));
        if (filterInfoFromlStorage) {
            store.dispatch(setFilteringInfo(filterInfoFromlStorage));
        }
      }, []);

    useEffect(() => {
        localStorage.setItem('filteringInfo', JSON.stringify(filteringInfo));
    }, [filteringInfo]);

     useEffect(() => {
        store.dispatch(setFilteringInfo({...filteringInfo, chosenLayer: activeGFILayer[0]?.id}));
    }, [activeGFILayer]);  

    const [activeFilters, setActiveFilters] = useState();

    useEffect(() => {
        if (filteringInfo && filteringInfo?.layer && filters){
            const updatedActivefilters = filters.filter(filter => filter.layer === filteringInfo?.layer.id)
            setActiveFilters(updatedActivefilters)
        }
     }, [filters, filteringInfo]);
   
    const handleRemoveFilter = (filter) => {

        if (filters && filters.length > 0 && filters.includes(filter)){
            const updatedFilters = filters.filter(existingFilter => existingFilter !== filter )
            store.dispatch(setFilters(updatedFilters));
        }
    }

    const handleRemoveAllFilters = () => {
        if (filters && filters.length > 0){
            store.dispatch(setFilters([]));
        }
    }

    const filterOptions = () => {
        var layer = filteringInfo?.layer;
        const options = layer?.tableProps?.columns?.map( column => {
            return { value: column.key, label: column.title, type: "string"}

            //return { value: column.key, label: column.title, type: column.type}
        }
        )
        return options;
    }

    return (
        <StyledModalContainer>
            <StyledModalFloatingChapter>
            <Dropdown 
                options={filterOptions()}
                placeholder={strings.gfifiltering.placeholders.chooseProp}
                value={propValue}
                setValue={setPropValue}
                isDisabled={false}
            />
            </StyledModalFloatingChapter>
            <StyledModalFloatingChapter>
            <Dropdown 
                options={comparisonOperatorsHash[propValue.type]}
                placeholder={strings.gfifiltering.placeholders.chooseOperator}
                value={operatorValue}
                setValue={setOperatorValue}
                isDisabled={Object.keys(propValue).length === 0}
            />
            </StyledModalFloatingChapter>
            <StyledModalFloatingChapter>
            <StyledInput
                type="text"
                value={filterValue}
                placeholder={strings.gfifiltering.placeholders.chooseValue}
                onChange={e => setFilterValue(e.target.value)}
                onKeyPress={e => {
                    if (e.key === 'Enter') {
                        addFilter();
                    }
                }}
                disabled={Object.keys(operatorValue).length === 0}
            />
            </StyledModalFloatingChapter>
            <StyledModalFloatingActionChapter>
                <StyledSelectedTabDisplayOptionsButton
                    onClick={() =>  addFilter()}
                >
                <FontAwesomeIcon icon={faPlus} />
                </StyledSelectedTabDisplayOptionsButton>
            </StyledModalFloatingActionChapter>
        
            {activeFilters && activeFilters.length > 0 && (
                            <StyledFilterContainer>
                                <StyledFilterResultContainer>
                                    <StyledFilterHeader style={{marginBottom: '.5em'}}>{strings.gfifiltering.activeFilters}</StyledFilterHeader>
                                        {
                                        activeFilters.map( (filter) =>  
                                        <StyledFilter>
                                        <StyledFilterPropContainer>      
                                            <StyledFilterProp>{strings.gfifiltering.property}:  {filter.property}</StyledFilterProp> 
                                            <StyledFilterProp>{strings.gfifiltering.operator}:  {strings.gfifiltering.operators[filter.operator]} </StyledFilterProp> 
                                            <StyledFilterProp>{strings.gfifiltering.value}: {filter.value}</StyledFilterProp> 
                                        </StyledFilterPropContainer>
                                        <StyledIconWrapper
                                        onClick={() => {
                                            handleRemoveFilter(filter);
                                        }}>
                                        <StyledFloatingDiv><FontAwesomeIcon icon={faTimes} size="6x" style={{marginLeft: '.5em'}}/></StyledFloatingDiv>
                                        </StyledIconWrapper>
                                    </StyledFilter>
                                    )}
                                </StyledFilterResultContainer>
                                <StyledFilterReusltButtons>  
                                    <StyledIconWrapper 
                                        onClick={() => {
                                            handleRemoveAllFilters();
                                        }}>
                                        <StyledFloatingDiv>{strings.gfifiltering.removeAllFilters} <FontAwesomeIcon icon={faTrash} size="6x" style={{marginLeft: '.5em'}}/></StyledFloatingDiv>
                                    </StyledIconWrapper>
                                </StyledFilterReusltButtons>                   
                            </StyledFilterContainer>
                        )
                        }
        </StyledModalContainer>

    )
}