import React from 'react';
import strings from '../../../../translations';
import { StyledTitle, StyledUl, StyledLi } from './Common';

export const Classifications = ({ identification }) => {
    return (
        <React.Fragment key={'metadata-modal-classifications'}>
            {identification.classifications && identification.classifications.length > 0 &&
                <React.Fragment key={'metadata-modal-classifications-content'}>
                    <StyledTitle>{strings.metadata.heading.classifications}</StyledTitle>
                    <StyledUl>
                        {identification.classifications.map((data, index) => {
                            return (
                                <StyledLi key={'metadata-classification-li-' + index}
                                    title={(strings.metadata.codeLists['gmd:MD_ClassificationCode'][data] || { description: data }).description}
                                >
                                    {(strings.metadata.codeLists['gmd:MD_ClassificationCode'][data] || { label: data }).label}
                                </StyledLi>
                            )
                        })}
                    </StyledUl>
                </React.Fragment>
            }
        </React.Fragment>
    );
};
export default Classifications;