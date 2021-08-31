import strings from '../../../../translations';
import {StyledTitle, StyledUl, StyledLi} from './Common';

export const OperatesOn = ({ identification }) => {
    return (
        <>
        {identification.operatesOn && identification.operatesOn.length > 0 &&
            <>
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
            </>
        }
        </>
    );
};
export default OperatesOn;