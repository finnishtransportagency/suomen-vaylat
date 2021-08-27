import strings from '../../../../translations';
import {StyledTitle, StyledUl, StyledLi} from './Common';

export const TemporalExtents = ({ identification }) => {
    return (
        <>
        {identification.temporalExtents && identification.temporalExtents.length > 0 &&
            <>
                <StyledTitle>{strings.metadata.heading.temporalExtent}</StyledTitle>
                <StyledUl>
                {identification.temporalExtents.map((temporalExtent, index) => {
                    return (
                        <StyledLi key={'metadata-temporal-extent-li-' + index}>
                            {temporalExtent.begin} - {temporalExtent.end}
                        </StyledLi>
                    )
                })}
                </StyledUl>
            </>
        }
        </>
    );
};
export default TemporalExtents;