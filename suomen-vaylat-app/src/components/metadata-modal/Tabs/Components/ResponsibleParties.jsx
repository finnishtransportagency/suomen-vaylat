import React from 'react';
import { StyledLi, StyledTitle, StyledUl } from './Common';
import ElectronicMailAddresses from './ElectronicMailAddresses';

export const ResponsibleParties = ({ visible, header, responsibleParties }) => {
    return (
        <React.Fragment key={'metadata-modal-responsible-parties'}>
            {visible &&
                <React.Fragment key={'metadata-modal-responsible-parties-content'}>
                    <StyledTitle>{header}</StyledTitle>
                    <StyledUl>
                        {responsibleParties.map((data, index) => {
                            return (
                                <StyledLi key={'metadata-responsible-party-li-' + index}>
                                    {data.organisationName}
                                    <ElectronicMailAddresses electronicMailAddresses={data.electronicMailAddresses}></ElectronicMailAddresses>
                                </StyledLi>
                            )
                        })}
                    </StyledUl>
                </React.Fragment>
            }
        </React.Fragment>
    );
};
export default ResponsibleParties;