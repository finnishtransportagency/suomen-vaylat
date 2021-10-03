import React from 'react';
import strings from '../../../../translations';
import { StyledParagraph, StyledTitle } from './Common';
import UseLimitation from './UseLimitation';

export const UseLimitations = ({ identification }) => {
    return (
        <React.Fragment key={'metadata-modal-use-limitations'}>
            {identification.useLimitations && identification.useLimitations.length > 0 &&
                <React.Fragment key={'metadata-modal-use-limitations-content'}>
                    <StyledTitle>{strings.metadata.heading.useLimitation}</StyledTitle>
                    <StyledParagraph>
                        {identification.useLimitations.map((data, index) => {
                            return (
                                <UseLimitation uselimitation={data} key={'metadata-modal-use-limitations-content-' + data + '-' + index}></UseLimitation>
                            )
                        })}
                    </StyledParagraph>
                </React.Fragment>
            }
        </React.Fragment>
    );
};
export default UseLimitations;