import React from 'react';
import strings from '../../../../translations';
import { StyledLi, StyledTitle, StyledUl } from './Common';

export const OperatesOn = ({ identification }) => {
    return (
        <React.Fragment key={'metadata-modal-operates-on'}>
            {identification.operatesOn && identification.operatesOn.length > 0 &&
                <React.Fragment key={'metadata-modal-operates-on-content'}>
                    <StyledTitle>{strings.metadata.heading.operatesOn}</StyledTitle>
                    <StyledUl>
                        {identification.operatesOn.map((data, index) => {
                            return (
                                <StyledLi key={'metadata-operates-on-li-' + index}>
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
export default OperatesOn;