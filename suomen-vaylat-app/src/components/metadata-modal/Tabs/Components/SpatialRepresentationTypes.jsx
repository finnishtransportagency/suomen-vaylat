import strings from '../../../../translations';
import {StyledTitle, StyledUl, StyledLi} from './Common';

export const SpatialRepresentationTypes = ({ identification }) => {
    return (
        <>
        {identification.spatialRepresentationTypes && identification.spatialRepresentationTypes.length > 0 &&
            <>
                <StyledTitle>{strings.metadata.heading.spatialRepresentationType}</StyledTitle>
                <StyledUl>
                {identification.spatialRepresentationTypes.map((data, index) => {
                    return (
                        <StyledLi key={'metadata-spatial-representation-types-li-' + index} title={(strings.metadata.codeLists['gmd:MD_SpatialRepresentationTypeCode'][data] || {description: data}).description}>
                            {(strings.metadata.codeLists['gmd:MD_SpatialRepresentationTypeCode'][data] || {label: data}).label}
                        </StyledLi>
                    )
                })}
                </StyledUl>
            </>
        }
        </>
    );
};
export default SpatialRepresentationTypes;