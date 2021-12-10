import React from 'react';
import strings from '../../../translations';

export const ConformanceResultList = ({ conformanceResultList }) => {
    return (
        <React.Fragment key={'metadata-modal-conformance-result-list'}>
            {conformanceResultList && conformanceResultList.length > 0 &&
                <React.Fragment key={'metadata-modal-conformance-result-list-content'}>
                    {conformanceResultList.map((data, index) => {
                        return (
                            <React.Fragment key={'conformance-result-list-' + index}>
                                {data.specification &&
                                    <React.Fragment key={'conformance-result-list-specification-' + index}>
                                        {strings.metadata.qualityContent.specification}: {data.specification}<br />
                                    </React.Fragment>
                                }
                                {data.pass === true &&
                                    <React.Fragment key={'conformance-result-list-pass-true-' + index}>
                                        {strings.metadata.qualityContent.qualityPassTrue}<br />
                                    </React.Fragment>
                                }
                                {data.pass === false &&
                                    <React.Fragment key={'conformance-result-list-pass-false-' + index}>
                                        {strings.metadata.qualityContent.qualityPassFalse}<br />
                                    </React.Fragment>
                                }
                                {data.explanation &&
                                    <React.Fragment key={'conformance-result-list-explanation' + index}>
                                        {strings.metadata.qualityContent.explanation}: {data.explanation}<br />
                                    </React.Fragment>
                                }
                            </React.Fragment>
                        )
                    })}
                </React.Fragment>
            }
        </React.Fragment>
    );
};
export default ConformanceResultList;