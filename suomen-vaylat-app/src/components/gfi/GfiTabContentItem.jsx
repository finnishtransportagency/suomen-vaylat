import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';

import strings from '../../translations';

import { useAppSelector } from '../../state/hooks';

const StyledGfiTabContentItem = styled(motion.div)`
    cursor: pointer;
    overflow: hidden;
    border-bottom: 1px solid #cdcdcd;
`;

const StyledGfiTabContentItemHeader = styled(motion.div)`
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
`;

const StyledGfiSubTabContentItemHeader = styled(motion.div)`
    height: 40px;
    display: flex;
    align-items: center;
    padding: 16px;
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

const StyledGfiTabContentItemTableHeader = styled.th`
    padding-left: 16px;
    font-size: 14px;
    font-weight: 600;
`;

const StyledGfiTabContentItemTableData = styled.td`
    font-size: 12px;
`;

const StyledGfiTabContentItemSubCollapseContent = styled(motion.div)`

`;

const GfiTabContentItem = ({
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

    useEffect(() => {

        var hightPriorityFields = data.properties._orderHigh && JSON.parse(data.properties._orderHigh);
        var lowPriorityFields = data.properties._order && JSON.parse(data.properties._order);

        if(hightPriorityFields.length > 0){
            hightPriorityFields && setOrderHigh(hightPriorityFields);
            lowPriorityFields && lowPriorityFields.length > 0 && setOrderLow(lowPriorityFields);
        } else if(lowPriorityFields.length > 0){
            setOrderHigh(lowPriorityFields);
        }
    },[data]);

    return  <StyledGfiTabContentItem
                onMouseEnter={() => {
                    setHovered(true);
                    selectFeature(channel, [data]);
                }}
                onMouseLeave={() => {
                    setHovered(false);
                    deSelectFeature(channel, [data]);
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
                                {
                                    orderHigh ? orderHigh.map(value => {
                                        return <StyledGfiTabContentItemTableRow key={value+'_'+data.properties[value]}>
                                            <StyledGfiTabContentItemTableHeader>{value}</StyledGfiTabContentItemTableHeader>
                                            <StyledGfiTabContentItemTableData>{data.properties[value]}</StyledGfiTabContentItemTableData>
                                        </StyledGfiTabContentItemTableRow>
                                    }) : orderLow && orderLow.map(value => {
                                            return <StyledGfiTabContentItemTableRow key={value+'_'+data.properties[value]}>
                                                <StyledGfiTabContentItemTableHeader>{value}</StyledGfiTabContentItemTableHeader>
                                                <StyledGfiTabContentItemTableData>{data.properties[value]}</StyledGfiTabContentItemTableData>
                                            </StyledGfiTabContentItemTableRow>
                                    })
                                }
                            </StyledGfiTabContentItemTable>

                            {
                                orderLow &&
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
                                        {
                                            isSubExpanded &&
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
                                                {
                                                    orderLow && orderLow.map(value => {
                                                        return <StyledGfiTabContentItemTableRow key={value+'_'+data.properties[value]}>
                                                            <StyledGfiTabContentItemTableHeader>{value}</StyledGfiTabContentItemTableHeader>
                                                            <StyledGfiTabContentItemTableData>{data.properties[value]}</StyledGfiTabContentItemTableData>
                                                        </StyledGfiTabContentItemTableRow>
                                                    })
                                                }
                                            </StyledGfiTabContentItemTable>
                                            </StyledGfiTabContentItemSubCollapseContent>
                                        }
                                    </AnimatePresence>
                                </>
                            }

                        </StyledGfiTabContentItemCollapseContent>
                    )}
                    </AnimatePresence>
    </StyledGfiTabContentItem>
};

export default GfiTabContentItem;