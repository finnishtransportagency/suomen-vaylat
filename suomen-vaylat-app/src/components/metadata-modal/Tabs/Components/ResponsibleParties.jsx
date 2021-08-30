import {StyledTitle, StyledUl, StyledLi} from './Common';
import ElectronicMailAddresses from './ElectronicMailAddresses';

export const ResponsibleParties = ({ visible, header, responsibleParties }) => {
    return (
        <>
        {visible &&
            <>
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
            </>
        }
        </>
    );
};
export default ResponsibleParties;