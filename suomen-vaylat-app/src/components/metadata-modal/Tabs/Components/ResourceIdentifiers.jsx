import strings from '../../../../translations';
import {StyledTitle, StyledUl, StyledLi} from './Common';

export const ResourceIdentifiers = ({ identification }) => {
    return (
        <>
        {identification.citation && identification.citation.resourceIdentifiers &&  identification.citation.resourceIdentifiers.length > 0 &&
            <>
                <StyledTitle>{strings.metadata.heading.resourceIdentifier}</StyledTitle>
                <StyledUl>
                {identification.citation.resourceIdentifiers.map((data, index) => {
                    return (
                        <StyledLi key={'metadata-citation-resource-identifier-li-' + index}>
                            {data.codeSpace}.{data.code}
                        </StyledLi>
                    )
                })}
                </StyledUl>
            </>
        }
        </>
    );
};
export default ResourceIdentifiers;