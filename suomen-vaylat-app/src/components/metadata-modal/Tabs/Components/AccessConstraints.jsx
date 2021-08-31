import strings from '../../../../translations';
import {StyledTitle, StyledUl, StyledLi} from './Common';

export const AccessConstraints = ({ identification }) => {
    return (
        <>
        {identification.accessConstraints && identification.accessConstraints.length > 0 &&
            <>
                <StyledTitle>{strings.metadata.heading.accessConstraint}</StyledTitle>
                <StyledUl>
                {identification.accessConstraints.map((data, index) => {
                    return (
                        <StyledLi key={'metadata-access-contraints-li-' + index}
                            title={(strings.metadata.codeLists['gmd:MD_RestrictionCode'][data] || {description: data}).description}
                        >
                            {(strings.metadata.codeLists['gmd:MD_RestrictionCode'][data] || {label: data}).label}
                        </StyledLi>
                    )
                })}
                </StyledUl>
            </>
        }
        </>
    );
};
export default AccessConstraints;