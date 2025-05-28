import React from 'react';
import strings from '../../../../translations';
import { StyledTitle } from './Common';
import UseLimitation from './UseLimitation';

export const UseLimitations = ({ identification }) => {
    return (
        <React.Fragment key={'metadata-dialog-use-limitations'}>
            {identification.useLimitations && identification.useLimitations.length > 0 &&
                <React.Fragment key={'metadata-dialog-use-limitations-content'}>
                    <StyledTitle>{strings.metadata.heading.useLimitation}</StyledTitle>
                        {identification.useLimitations.map((data, index) => {
                            return (
                                <UseLimitation uselimitation={data} key={'metadata-dialog-use-limitations-content-' + data + '-' + index}></UseLimitation>
                            )
                        })}
                </React.Fragment>
            }
        </React.Fragment>
    );
};
export default UseLimitations;