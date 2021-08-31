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
                            <>
                                {strings.metadata.qualityContent.specification}: {data.specification}
                            </>
                        }
                        {data.pass === true &&
                            <>
                                {strings.metadata.qualityContent.qualityPassTrue}
                            </>
                        }
                        {data.pass === false &&
                            <>
                                {strings.metadata.qualityContent.qualityPassFalse}
                            </>
                        }
                        {data.explanation &&
                            <>
                                {strings.metadata.qualityContent.explanation}: {data.explanation}
                            </>
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