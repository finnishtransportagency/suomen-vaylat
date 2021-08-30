import strings from '../../../../translations';
import {StyledTitle, StyledUl, StyledLi} from './Common';

export const DistributionFormats = ({ distributionFormats }) => {
    return (
        <>
        {distributionFormats && distributionFormats.length > 0 &&
            <>
                <StyledTitle>{strings.metadata.heading.distributionFormat}</StyledTitle>
                <StyledUl>
                {distributionFormats.map((data, index) => {
                    return (
                        <StyledLi key={'metadata-distribution-format-li-' + index}>
                            {data.name} {data.version ? '(' + data.version + ')' : ''}
                        </StyledLi>
                    )
                })}
                </StyledUl>
            </>
        }
        </>
    );
};
export default DistributionFormats;