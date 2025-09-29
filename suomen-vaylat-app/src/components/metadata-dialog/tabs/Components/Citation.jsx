import React from 'react';
import { StyledTitle } from './Common';

export const Citation = ({ identification }) => {
    return (
        <React.Fragment key={'metadata-dialog-citation'}>
            {identification.citation.title.length > 0 &&
                <StyledTitle>{identification.citation.title}</StyledTitle>
            }
        </React.Fragment>
    );
};

export default Citation;