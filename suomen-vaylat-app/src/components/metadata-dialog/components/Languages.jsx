import React from 'react';
import strings from '../../../translations';
import { StyledLi, StyledTitle, StyledUl } from './Common';

export const Languages = ({ identification }) => {
    return (
        <React.Fragment key={'metadata-dialog-languages'}>
            {identification.languages && identification.languages.length > 0 &&
                <React.Fragment key={'metadata-dialog-languages-content'}>
                    <StyledTitle>{strings.metadata.heading.resourceLanguage}</StyledTitle>
                    <StyledUl>
                        {identification.languages.map((language, index) => {
                            return (
                                <StyledLi key={'metadata-dialog-languages-content-' + language + '-' + index }>
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