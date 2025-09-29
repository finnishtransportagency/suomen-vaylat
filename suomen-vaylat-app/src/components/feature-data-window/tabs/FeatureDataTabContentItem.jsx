import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';

import strings from '../../../translations';
import { isValidUrl } from '../../../utils/validUrlUtil';

import { useAppSelector } from '../../../state/hooks';

const StyledGfiTabContentItem = styled(motion.div)`
    overflow: hidden;
    border-bottom: 1px solid #cdcdcd;
`;

const StyledGfiTabContentItemHeader = styled(motion.div)`
    cursor: pointer;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 12px;
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

const StyledGfiTabContentItemTable = styled.table`

`;

const StyledGfiTabContentItemTableRow = styled.tr`

`;

// inline-block styling makes the area between two text lines clickable
const StyledLinkText = styled.a`
    display: inline-block;
    word-break: break-all;
`;

const StyledPropertyValue = styled.div`
    margin: 6px;
`;

const StyledGfiTabContentItemTableHeader = styled.th`
    padding: 6px 6px 6px 16px;
    font-size: 14px;
    font-weight: 600;
`;

const StyledGfiTabContentItemTableData = styled.td`
    font-size: 14px;
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
    const [isHovered, setHovered] = useState(false);
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

    const formattedContent = (value) => {
        if (isValidUrl(value)) {
            return (<StyledLinkText target="_blank" rel="noreferrer" href={value}>{value}</StyledLinkText>);
        } else {
            return (
                <StyledPropertyValue 
                    dangerouslySetInnerHTML={{ __html: typeof(value) === "string" ? value.replace(/\n/g, '<br />') : value}} 
                />
            );
        }
    };

    return (
        <StyledGfiTabContentItem
            onMouseEnter={() => {
                setHovered(true);
                if (selectFeature && isGeojson) selectFeature(channel, [data]);
            }}
            onMouseLeave={() => {
                setHovered(false);
                if (deSelectFeature && isGeojson) deSelectFeature(channel, [data]);
            }}
            animate={{
                backgroundColor: isHovered ? '#f0f0f0' : '#ffffff',
            }}
        >
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
                            <>
                                <StyledGfiTabContentItemTable>
                            <tbody>
                                {orderHigh ? orderHigh.filter(value => value !== 'UID').map(value => (
                                    <StyledGfiTabContentItemTableRow key={value + '_' + data.properties[value]}>
                                        <StyledGfiTabContentItemTableHeader>{value}</StyledGfiTabContentItemTableHeader>
                                        <StyledGfiTabContentItemTableData>
                                            {formattedContent(data.properties[value])}
                                        </StyledGfiTabContentItemTableData>
                                    </StyledGfiTabContentItemTableRow>
                                )) : orderLow && orderLow.filter(value => value !== 'UID').map(value => (
                                    <StyledGfiTabContentItemTableRow key={value + '_' + data.properties[value]}>
                                        <StyledGfiTabContentItemTableHeader>{value}</StyledGfiTabContentItemTableHeader>
                                        <StyledGfiTabContentItemTableData>
                                            {formattedContent(data.properties[value])}
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
                                                                {formattedContent(data.properties[value])}
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
                            </>
                        ) 
                        : isFlatGeojson ? (
                            /* === FLAT new table/JSON version (data.geojson) === */
                            <StyledGfiTabContentItemTable>
                                <tbody>
                                    {dataFields.map((field) => (
                                        <StyledGfiTabContentItemTableRow key={field + '_' + data.geojson[field]}>
                                            <StyledGfiTabContentItemTableHeader>{field}</StyledGfiTabContentItemTableHeader>
                                            <StyledGfiTabContentItemTableData>
                                                {formattedContent(data.geojson[field])}
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
                                                {formattedContent(data[key])}
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