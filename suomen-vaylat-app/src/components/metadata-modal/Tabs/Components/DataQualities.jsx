import React from 'react';
import strings from '../../../../translations';
import { StyledTitle, StyledTitleLittle, StyledDiv } from './Common';
import ConformanceResultList from './ConformanceResultList';

export const DataQualities = ({ dataQualities }) => {
    return (
        <React.Fragment key={'metadata-modal-data-qualities'}>
            {dataQualities && dataQualities.length > 0 &&
                <React.Fragment key={'metadata-modal-data-qualities-content'}>
                    {dataQualities.map((dataQuality, index) => {
                        return (
                            <StyledDiv key={'metadata-data-quality-div-' + index}>
                                <StyledTitle>{strings.metadata.heading[dataQuality.nodeName]}</StyledTitle>
                                <StyledTitleLittle>{strings.metadata.heading.reportConformance}</StyledTitleLittle>
                                <ConformanceResultList key={'metadata-data-quality-conformance-result-list-' + index} conformanceResultList={dataQuality.conformanceResultList}></ConformanceResultList>
                            </StyledDiv>
                        )
                    })}
                </React.Fragment>
            }
        </React.Fragment>
    );
};
export default DataQualities;