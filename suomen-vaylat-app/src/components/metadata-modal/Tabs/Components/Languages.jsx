import React from 'react';
import strings from '../../../../translations';
import { StyledTitle, StyledUl, StyledLi } from './Common';

export const Languages = ({ identification }) => {
    return (
        <React.Fragment key={'metadata-modal-languages'}>
            {identification.languages && identification.languages.length > 0 &&
                <React.Fragment key={'metadata-modal-languages-content'}>
                    <StyledTitle>{strings.metadata.heading.resourceLanguage}</StyledTitle>
                    <StyledUl>
                        {identification.languages.map((language, index) => {
                            return (
                                <StyledLi>
                                    {strings.metadata.languages[language] || language}
                                </StyledLi>
                            )
                        })}
                    </StyledUl>
                </React.Fragment>
            }
        </React.Fragment>
    );
};
export default Languages;