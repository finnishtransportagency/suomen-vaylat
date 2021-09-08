import React from 'react';
import { StyledParagraph } from './Common';

export const UseLimitation = ({ uselimitation }) => {
    return (
        <React.Fragment key={'metadata-modal-use-limitation'}>
            {uselimitation && uselimitation.length > 0 && typeof uselimitation === 'object' &&
                <React.Fragment key={'metadata-modal-use-limitation-content'}>
                    {uselimitation.map((data, index) => {
                        return (
                            <StyledParagraph key={'metadata-use-limitation-li-' + index}>
                                {data}
                            </StyledParagraph>
                        )
                    })}
                </React.Fragment>
            }
            {uselimitation && typeof uselimitation === 'string' &&
                <StyledParagraph>
                    {uselimitation}
                </StyledParagraph>
            }
        </React.Fragment>
    );
};
export default UseLimitation;