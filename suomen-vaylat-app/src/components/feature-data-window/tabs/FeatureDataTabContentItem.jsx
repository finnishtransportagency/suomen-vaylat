import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';

import strings from '../../../translations';
import { useAppSelector } from '../../../state/hooks';
import { renderLinksInText } from '../../../utils/commonUtil'

const StyledGfiTabContentItem = styled(motion.div)`
    border-bottom: 1px solid #cdcdcd;
`;

// this is needed for hover bg color to 
const StyledGfiTabContentItemHeaderContainer = styled.div`
    padding: 12px;
    &:hover {
        background-color: ${(props) => props.theme.colors.hover};
    }
`;

const StyledGfiTabContentItemHeader = styled(motion.div)`
    cursor: pointer;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const StyledGfiSubTabContentItemHeader = styled(motion.div)`
    cursor: pointer;
    height: 40px;
    display: flex;
    align-items: center;
    margin: 0 0 0 16px;
`;

const StyledGfiTabContentItemName = styled.p`
    margin: 0;
    color: ${props => props.theme.colors.mainColor1};
    font-size: 16px;
    font-weight: 600;
`;

const StyledGfiSubTabContentItemName = styled.p`
    margin: 0;
    padding-right: 8px;
    color: ${props => props.theme.colors.mainColor1};
    font-size: 14px;
    font-weight: 600;
`;

const StyledGfiTabContentItemExpandIcon = styled(motion.div)`
    display: flex;
    align-items: center;
    font-size: 24px;
    margin: 6px;
    svg {
        color: ${props => props.theme.colors.mainColor1};
    }
`;

const StyledGfiSubTabContentItemExpandIcon = styled(motion.div)`
    display: flex;
    align-items: center;
    font-size: 18px;
    svg {
        color: ${props => props.theme.colors.mainColor1};
    }
`;

const StyledGfiTabContentItemCollapseContent = styled(motion.div)`

`;

const StyledTableWrapper = styled.div`
  width: 100%;
  box-sizing: border-box;
  overflow-x: auto; /* show horizontal scrollbar if needed */
  -webkit-overflow-scrolling: touch;
`;

const StyledGfiTabContentItemTable = styled.table`
  border-collapse: collapse;
  /* allow the table to be as wide as its contents; min-width ensures it fills parent */
  width: max-content;
  min-width: 100%;
  table-layout: auto;
`;

const StyledGfiTabContentItemTableRow = styled.tr`

`;


const StyledGfiTabContentItemTableHeader = styled.th`
    padding: 6px 6px 6px 16px;
    font-size: 14px;
    font-weight: 600;
`;

const StyledGfiTabContentItemTableData = styled.td`
    font-size: 14px;
    padding: 8px;
`;

const StyledGfiTabContentItemSubCollapseContent = styled(motion.div)`

`;

const FeatureDataTabContentItem = ({
    index,
    title,
    data,
    selectFeature,
    deSelectFeature
}) => {
    const [isExpanded, setIsExpanded] = useState(index === 0);
    const [isSubExpanded, setIsSubExpanded] = useState(false);
    const [orderHigh, setOrderHigh] = useState(null);
    const [orderLow, setOrderLow] = useState(null);
    const { channel } = useAppSelector(state => state.rpc);

    // === Structure detection! ===
    const isGeojson = !!data.properties;
    const isFlatGeojson = !!data.geojson && typeof data.geojson === 'object' && !Array.isArray(data.geojson);

    // Use these for flat objects (table rows):
    const dataFields = isFlatGeojson
        ? Object.keys(data.geojson).filter(
            key => key !== 'id' && key !== 'UID'   // Exclude if needed
        )
        : [];

    useEffect(() => {
        if (isGeojson) {
            const hightPriorityFields = data.properties._orderHigh && JSON.parse(data.properties._orderHigh);
            const lowPriorityFields = data.properties._order && JSON.parse(data.properties._order);

            if (hightPriorityFields && hightPriorityFields.length > 0) {
                setOrderHigh(hightPriorityFields);
                lowPriorityFields && lowPriorityFields.length > 0 && setOrderLow(lowPriorityFields);
            } else if (lowPriorityFields && lowPriorityFields.length > 0) {
                setOrderHigh(lowPriorityFields);
                setOrderLow(null);
            }
        } else {
            setOrderHigh(null);
            setOrderLow(null);
        }
    }, [data, isGeojson]);
    
    return (
        <StyledGfiTabContentItem
            id={'gfi_tab_content_item_' + data.id}
            onMouseEnter={() => {
                if (selectFeature && isGeojson) selectFeature(channel, [data]);
            }}
            onMouseLeave={() => {
                if (deSelectFeature && isGeojson) deSelectFeature(channel, [data]);
            }}
        >
            <StyledGfiTabContentItemHeaderContainer>
                <StyledGfiTabContentItemHeader
                    onClick={() => {
                        setIsExpanded(!isExpanded);
                        isExpanded && setIsSubExpanded(false);
                    }}
                >
                    <StyledGfiTabContentItemName>
                        {title}
                    </StyledGfiTabContentItemName>
                    <StyledGfiTabContentItemExpandIcon
                        animate={{
                            rotate: isExpanded ? 180 : 0,
                        }}
                        transition={{
                            duration: 0.3,
                            type: 'tween',
                        }}
                    >
                        <FontAwesomeIcon icon={faAngleDown} />
                    </StyledGfiTabContentItemExpandIcon>
                </StyledGfiTabContentItemHeader>
            </StyledGfiTabContentItemHeaderContainer>
            <AnimatePresence>
                {isExpanded && (
                    <StyledGfiTabContentItemCollapseContent
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, type: 'tween' }}
                    >
                        {/* === GEOJSON properties version === */}
                        {isGeojson ? (
                            <StyledTableWrapper>
                                <StyledGfiTabContentItemTable>
                            <tbody>
                                {orderHigh ? orderHigh.filter(value => value !== 'UID').map(value => (
                                    <StyledGfiTabContentItemTableRow key={value + '_' + data.properties[value]}>
                                        <StyledGfiTabContentItemTableHeader>{value}</StyledGfiTabContentItemTableHeader>
                                        <StyledGfiTabContentItemTableData>
                                            {renderLinksInText(data.properties[value])}
                                        </StyledGfiTabContentItemTableData>
                                    </StyledGfiTabContentItemTableRow>
                                )) : orderLow && orderLow.filter(value => value !== 'UID').map(value => (
                                    <StyledGfiTabContentItemTableRow key={value + '_' + data.properties[value]}>
                                        <StyledGfiTabContentItemTableHeader>{value}</StyledGfiTabContentItemTableHeader>
                                        <StyledGfiTabContentItemTableData>
                                            {renderLinksInText(data.properties[value])}
                                        </StyledGfiTabContentItemTableData>
                                    </StyledGfiTabContentItemTableRow>
                                ))}
                            </tbody>
                        </StyledGfiTabContentItemTable>

                        {orderLow && (
                            <>
                                <StyledGfiSubTabContentItemHeader
                                    onClick={() => setIsSubExpanded(!isSubExpanded)}
                                >
                                    <StyledGfiSubTabContentItemName>
                                        {strings.gfi.additionalInfo}
                                    </StyledGfiSubTabContentItemName>
                                    <StyledGfiSubTabContentItemExpandIcon
                                        animate={{
                                            rotate: isSubExpanded ? 180 : 0,
                                        }}
                                        transition={{
                                            duration: 0.3,
                                            type: 'tween',
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faAngleDown} />
                                    </StyledGfiSubTabContentItemExpandIcon>
                                </StyledGfiSubTabContentItemHeader>
                                <AnimatePresence>
                                    {isSubExpanded && (
                                        <StyledGfiTabContentItemSubCollapseContent
                                            initial={{
                                                height: 0,
                                                opacity: 0,
                                            }}
                                            animate={{
                                                height: 'auto',
                                                opacity: 1,
                                            }}
                                            exit={{
                                                height: 0,
                                                opacity: 0,
                                            }}
                                            transition={{
                                                duration: 0.3,
                                                type: 'tween',
                                            }}
                                        >
                                            <StyledGfiTabContentItemTable>
                                                <tbody>
                                                    {orderLow && orderLow.map(value => (
                                                        <StyledGfiTabContentItemTableRow key={value + '_' + data.properties[value]}>
                                                            <StyledGfiTabContentItemTableHeader>{value}</StyledGfiTabContentItemTableHeader>
                                                            <StyledGfiTabContentItemTableData>
                                                                {renderLinksInText(data.properties[value])}
                                                            </StyledGfiTabContentItemTableData>
                                                        </StyledGfiTabContentItemTableRow>
                                                    ))}
                                                </tbody>
                                            </StyledGfiTabContentItemTable>
                                        </StyledGfiTabContentItemSubCollapseContent>
                                    )}
                                </AnimatePresence>
                            </>
                        )}
                            </StyledTableWrapper>
                        ) 
                        : isFlatGeojson ? (
                            /* === FLAT new table/JSON version (data.geojson) === */
                            <StyledGfiTabContentItemTable>
                                <tbody>
                                    {dataFields.map((field) => (
                                        <StyledGfiTabContentItemTableRow key={field + '_' + data.geojson[field]}>
                                            <StyledGfiTabContentItemTableHeader>{field}</StyledGfiTabContentItemTableHeader>
                                            <StyledGfiTabContentItemTableData>
                                                {renderLinksInText(data.geojson[field])}
                                            </StyledGfiTabContentItemTableData>
                                        </StyledGfiTabContentItemTableRow>
                                    ))}
                                </tbody>
                            </StyledGfiTabContentItemTable>
                        ) : (
                            /* fallback for very unusual shaped data */
                            <StyledGfiTabContentItemTable>
                                <tbody>
                                    {Object.keys(data).filter(key => key !== 'id').map((key) => (
                                        <StyledGfiTabContentItemTableRow key={key + '_' + data[key]}>
                                            <StyledGfiTabContentItemTableHeader>{key}</StyledGfiTabContentItemTableHeader>
                                            <StyledGfiTabContentItemTableData>
                                                {renderLinksInText(data[key])}
                                            </StyledGfiTabContentItemTableData>
                                        </StyledGfiTabContentItemTableRow>
                                    ))}
                                </tbody>
                            </StyledGfiTabContentItemTable>
                        )}
                    </StyledGfiTabContentItemCollapseContent>
                )}
            </AnimatePresence>
        </StyledGfiTabContentItem>
    );
};

export default FeatureDataTabContentItem;