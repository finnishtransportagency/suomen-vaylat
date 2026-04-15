import React from 'react';
import { StyledCitationTitle } from './Common';

export const Citation = ({ identification }) => {
    return (
        <React.Fragment key={'metadata-dialog-citation'}>
            {identification?.citation?.title?.length > 0 &&
                <StyledCitationTitle>{identification.citation.title}</StyledCitationTitle>
            }
        </React.Fragment>
    );
};

export default Citation;