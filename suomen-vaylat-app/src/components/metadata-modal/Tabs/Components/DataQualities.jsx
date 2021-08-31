import strings from '../../../../translations';
import {StyledTitle, StyledTitleLittle, StyledParagraph} from './Common';
import ConformanceResultList from './ConformanceResultList';

export const DataQualities = ({ dataQualities }) => {
    return (
        <>
        {dataQualities && dataQualities.length > 0 &&
            <>
                {dataQualities.map((dataQuality, index) => {
                    return (
                        <StyledParagraph key={'metadata-data-quality-ui-div-' + index}>
                            <StyledTitle>{strings.metadata.heading[dataQuality.nodeName]}</StyledTitle>
                            <StyledTitleLittle>{strings.metadata.heading.reportConformance}</StyledTitleLittle>
                            <ConformanceResultList conformanceResultList={dataQuality.conformanceResultList}></ConformanceResultList>
                        </StyledParagraph>
                    )
                })}
            </>
        }
        </>
    );
};
export default DataQualities;