import React from 'react';
import strings from '../../../../translations';
import { StyledLi, StyledTitle, StyledUl } from './Common';

export const ScopeCodes = ({ scopeCodes }) => {
    return (
        <React.Fragment key={'metadata-modal-scope-codes'}>
            {scopeCodes && scopeCodes.length > 0 &&
                <React.Fragment key={'metadata-modal-scopoe-codes-content'}>
                    <StyledTitle>{strings.metadata.heading.scopeCode}</StyledTitle>
                    <StyledUl>
                        {scopeCodes.map((data, index) => {
                            return (
                                <StyledLi key={'metadata-scope-code-li-' + index}
                                    title={(strings.metadata.codeLists['gmd:MD_ScopeCode'][data] || { description: data }).description}
                                >
                                    {(strings.metadata.codeLists['gmd:MD_ScopeCode'][data] || { label: data }).label}
                                </StyledLi>
                            )
                        })}
                    </StyledUl>
                </React.Fragment>
            }
        </React.Fragment>
    );
};
export default ScopeCodes;