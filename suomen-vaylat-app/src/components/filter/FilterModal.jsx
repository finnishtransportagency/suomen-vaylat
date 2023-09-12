import { useState, useContext, useEffect } from 'react';
import { useAppSelector } from '../../state/hooks';
import { ReactReduxContext } from 'react-redux';

import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';
import strings from '../../translations';
import Dropdown from '../select/Dropdown';
import { faPlus, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { setFilters , setActiveGFILayer } from '../../state/slices/rpcSlice';


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
    const { filters, activeGFILayer, filteringInfo, gfiLocations, selectedLayers, channel } = useAppSelector((state) => state.rpc);
    const { store } = useContext(ReactReduxContext);
    const [ operatorValue,  setOperatorValue] = useState({});
    const [ filterValue, setFilterValue] = useState("");
    const [ propValue, setPropValue] = useState({});
    const [ fieldNameLocales, setFieldNameLocales] = useState({});

    const addFilter = () => {
        const prop = propValue.value;
        const value = filterValue;
        const oper = operatorValue.value;
        const layer = filteringInfo?.layer?.id; 

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
        if (activeGFILayer === null) {
            const layer = selectedLayers.filter(l => l.id == gfiLocations[0].layerId);
            store.dispatch(setActiveGFILayer(layer));
        }

        var layer = filteringInfo?.layer;
        channel.getFieldNameLocales([layer?.id], (data) => {
            setFieldNameLocales(data);
        },
        (err) => {
            console.log(err);
        }
    );
      }, []);

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
            const updatedFilters = filters.filter(filter => filter.layer !== activeGFILayer[0]?.id)
            store.dispatch(setFilters(updatedFilters));
        }
    }

    const filterOptions = () => {
        var layer = filteringInfo?.layer;
        const options = layer?.tableProps?.filterableColumns?.map( column => {
            if (fieldNameLocales) {
                return { value: column.key, label: fieldNameLocales[column.title], type: column.type};
            } else {
                return {};
            }
        })
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
                                            <StyledFilterProp>{strings.gfifiltering.property}:  {fieldNameLocales && fieldNameLocales[filter.property]}</StyledFilterProp> 
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