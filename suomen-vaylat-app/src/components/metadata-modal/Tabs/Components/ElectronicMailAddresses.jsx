import {StyledA, StyledUl, StyledLi} from './Common';

export const ElectronicMailAddresses = ({ electronicMailAddresses }) => {
    console.log(electronicMailAddresses);
    return (
        <>
        {electronicMailAddresses && electronicMailAddresses.length > 0 &&
            <>
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
            </>
        }
        </>
    );
};
export default ElectronicMailAddresses;