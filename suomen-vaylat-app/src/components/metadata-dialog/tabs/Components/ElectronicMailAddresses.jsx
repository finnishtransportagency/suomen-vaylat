import React from 'react';
import { StyledA, StyledUl, StyledLi } from './Common';

export const ElectronicMailAddresses = ({ electronicMailAddresses }) => {
    return (
        <React.Fragment key={'metadata-dialog-electronic-mail-addresses'}>
            {electronicMailAddresses && electronicMailAddresses.length > 0 &&
                <React.Fragment key={'metadata-dialog-electronic-mail-addresses-content'}>
                    <StyledUl>
                        {electronicMailAddresses.map((electronicMailAddress, index) => {
                            return (
                                <StyledLi key={'metadata-electronic-mail-address-li-' + index}>
                                    <StyledA href={'mailto:' + electronicMailAddress}>
                                        {electronicMailAddress}
                                    </StyledA>
                                </StyledLi>
                            )
                        })}
                    </StyledUl>
                </React.Fragment>
            }
        </React.Fragment>
    );
};
export default ElectronicMailAddresses;