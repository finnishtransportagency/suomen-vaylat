import strings from '../../../../translations';
import {StyledTitle, StyledUl, StyledLi} from './Common';

export const DescriptiveKeywords = ({ identification }) => {
    return (
        <>
        {identification.descriptiveKeywords && identification.descriptiveKeywords.length > 0 &&
            <>
                <StyledTitle>{strings.metadata.heading.descriptiveKeyword}</StyledTitle>
                <StyledUl>
                {identification.descriptiveKeywords.filter((d) => { return d.length > 0}).map((data, index) => {
                    return (
                        <StyledLi key={'metadata-descriptive-keyword-li-' + index}>
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
export default DescriptiveKeywords;