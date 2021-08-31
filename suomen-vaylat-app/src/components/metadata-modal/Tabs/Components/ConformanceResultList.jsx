import strings from '../../../../translations';
import {StyledDiv} from './Common';

export const ConformanceResultList = ({ conformanceResultList }) => {
    return (
        <>
        {conformanceResultList && conformanceResultList.length > 0 &&
            <>
                {conformanceResultList.map((data, index) => {
                    return (
                        <>
                        {data.specification &&
                            <StyledDiv key={'metadata-conformance-result-specification-' + index}>{strings.metadata.qualityContent.specification}: {data.specification}</StyledDiv>
                        }
                        {data.pass === true &&
                            <StyledDiv key={'metadata-conformance-result-pass-' + index}>{strings.metadata.qualityContent.qualityPassTrue}</StyledDiv>
                        }
                        {data.pass === false &&
                            <StyledDiv key={'metadata-conformance-result-pass-' + index}>{strings.metadata.qualityContent.qualityPassFalse}</StyledDiv>
                        }
                        {data.explanation &&
                            <StyledDiv key={'metadata-conformance-result-explanation-' + index}>{strings.metadata.qualityContent.explanation}: {data.explanation}</StyledDiv>
                        }
                        </>
                    )
                })}
            </>
        }
        </>
    );
};
export default ConformanceResultList;