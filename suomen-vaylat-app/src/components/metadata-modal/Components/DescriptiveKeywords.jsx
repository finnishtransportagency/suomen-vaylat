import React from 'react';
import strings from '../../../translations';
import { StyledLi, StyledTitle, StyledUl } from './Common';

export const DescriptiveKeywords = ({ identification }) => {
    return (
        <React.Fragment key={'metadata-modal-descriptive-keywords'}>
            {identification.descriptiveKeywords && identification.descriptiveKeywords.length > 0 &&
                <React.Fragment key={'metadata-modal-descriptive-keywords-content'}>
                    <StyledTitle>{strings.metadata.heading.descriptiveKeyword}</StyledTitle>
                    <StyledUl>
                        {identification.descriptiveKeywords.filter((d) => { return d.length > 0 }).map((data, index) => {
                            return (
                                <StyledLi key={'metadata-descriptive-keyword-li-' + index}>
                                    {data}
                                </StyledLi>
                            )
                        })}
                    </StyledUl>
                </React.Fragment>
            }
        </React.Fragment>
    );
};
export default DescriptiveKeywords;