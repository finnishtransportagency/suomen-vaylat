import strings from '../../../../translations';
import {StyledTitle, StyledUl, StyledLi} from './Common';

export const SpatialResolutions = ({ identification }) => {
    return (
        <>
        {identification.spatialResolutions && identification.spatialResolutions.length > 0 &&
            <>
                <StyledTitle>{strings.metadata.heading.spatialResolution}</StyledTitle>
                <StyledUl>
                {identification.spatialResolutions.map((data, index) => {
                    return (
                        <StyledLi key={'metadata-spatial-resolution-li-' + index}>
                            1: {data}
                        </StyledLi>
                    )
                })}
                </StyledUl>
            </>
        }
        </>
    );
};
export default SpatialResolutions;