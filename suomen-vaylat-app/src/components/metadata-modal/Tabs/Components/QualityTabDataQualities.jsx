import React from 'react';
import Moment from 'react-moment';
import strings from '../../../../translations';
import { StyledTitle, StyledTitleLittle } from './Common';
import ConformanceResultList from './ConformanceResultList';

export const QualityTabDataQualities = ({ dataQualities }) => {
    return (
        <React.Fragment key={'quality-tab-data-qualities'}>
            {dataQualities && dataQualities.length > 0 &&
                <React.Fragment>
                    {dataQualities.map((dataQuality, index) => {
                        return (
                            <React.Fragment key={'quality-tab-data-qualities-data-quality-' + index}>
                                <StyledTitle>{strings.metadata.heading[dataQuality.nodeName]}</StyledTitle>
                                {dataQuality.nameOfMeasure &&
                                    <React.Fragment key={'quality-tab-data-qualities-data-quality-name-of-measure-' + index}>
                                        {strings.metadata.qualityContent.nameOfMeasure}: {dataQuality.nameOfMeasure}<br />
                                    </React.Fragment>
                                }

                                {dataQuality.measureDescription &&
                                    <React.Fragment key={'quality-tab-data-qualities-data-quality-measure-description-' + index}>
                                        {strings.metadata.qualityContent.measureDescription}: {dataQuality.measureDescription}<br />
                                    </React.Fragment>
                                }
                                {dataQuality.evaluationMethodType &&
                                    <React.Fragment key={'quality-tab-data-qualities-data-quality-evaluation-method-type-' + index}>
                                        {strings.metadata.qualityContent.evaluationMethodType}: {dataQuality.evaluationMethodType}<br />
                                    </React.Fragment>
                                }
                                {dataQuality.evaluationMethodDescription &&
                                    <React.Fragment key={'quality-tab-data-qualities-data-quality-evaluation-method-description-' + index}>
                                        {strings.metadata.qualityContent.evaluationMethodDescription}: {dataQuality.evaluationMethodDescription}<br />
                                    </React.Fragment>
                                }
                                {dataQuality.measureIdentificationAuthorization &&
                                    <React.Fragment key={'quality-tab-data-qualities-data-quality-measure-identification-authorization-' + index}>
                                        {strings.metadata.qualityContent.measureIdentificationAuthorization}: {dataQuality.measureIdentificationAuthorization}<br />
                                    </React.Fragment>
                                }
                                {dataQuality.measureIdentificationCode &&
                                    <React.Fragment key={'quality-tab-data-qualities-data-quality-measure-identification-code-' + index}>
                                        {strings.metadata.qualityContent.measureIdentificationCode}: {dataQuality.measureIdentificationCode}<br />
                                    </React.Fragment>
                                }
                                {dataQuality.dateTime && dataQuality.dateTime.length > 0 &&
                                    <React.Fragment key={'quality-tab-data-qualities-data-quality-date-time-' + index}>
                                        {dataQuality.dateTime.map((dateTime, index) => {
                                            return (
                                                <React.Fragment key={'quality-tab-data-qualities-data-quality-datetime-' + index}>
                                                    {dateTime &&
                                                        <React.Fragment key={'quality-tab-data-qualities-data-quality-datetime-content-' + index}>
                                                            {strings.metadata.qualityContent.dateTime}: <Moment format={'DD.MM.YYYY hh:mm:ss'} tz="Europe/Helsinki">{dateTime}</Moment><br />
                                                        </React.Fragment>
                                                    }
                                                </React.Fragment>
                                            )
                                        })
                                        }
                                    </React.Fragment>
                                }
                                {dataQuality.conformanceResultList && dataQuality.conformanceResultList.length > 0 &&
                                    <React.Fragment key={'quality-tab-data-qualities-data-quality-conformance-result-list-' + index}>
                                        <StyledTitleLittle>{strings.metadata.qualityContent.conformanceResult}</StyledTitleLittle>
                                        <ConformanceResultList conformanceResultList={dataQuality.conformanceResultList}></ConformanceResultList>
                                    </React.Fragment>
                                }
                                {dataQuality.quantitativeResultList && dataQuality.quantitativeResultList.length > 0 &&
                                    <React.Fragment key={'quality-tab-data-qualities-data-quality-quantitative-result-list-' + index}>
                                        <StyledTitleLittle>{strings.metadata.qualityContent.quantitativeResult}</StyledTitleLittle>
                                        {dataQuality.quantitativeResultList.map((quantitativeResult, index) => {
                                            return (
                                                <React.Fragment key={'quality-tab-data-qualities-data-quality-quantitave-result-' + index}>
                                                    {quantitativeResult.valueType &&
                                                        <React.Fragment key={'quality-tab-data-qualities-data-quality-quantitave-result-value-type-' + index}>
                                                            {strings.metadata.qualityContent.valueType}: {quantitativeResult.valueType}<br />
                                                        </React.Fragment>
                                                    }
                                                    {quantitativeResult.valueUnit &&
                                                        <React.Fragment key={'quality-tab-data-qualities-data-quality-quantitave-result-value-unit-' + index}>
                                                            {strings.metadata.qualityContent.valueUnit}: {quantitativeResult.valueUnit}<br />
                                                        </React.Fragment>
                                                    }
                                                    {quantitativeResult.errorStatistic &&
                                                        <React.Fragment key={'quality-tab-data-qualities-data-quality-quantitave-result-error-statistic-' + index}>
                                                            {strings.metadata.qualityContent.errorStatistic}: {quantitativeResult.errorStatistic}<br />
                                                        </React.Fragment>
                                                    }
                                                    {quantitativeResult.quantitativeResult && quantitativeResult.quantitativeResult.length > 0 &&
                                                        <React.Fragment key={'quality-tab-data-qualities-data-quality-quantitave-result-list-' + index}>
                                                            {dataQuality.quantitativeResult.map((value, index) => {
                                                                return (
                                                                    <React.Fragment key={'quality-tab-data-qualities-data-quality-quantitave-resultlist-' + index}>
                                                                        {value &&
                                                                            <React.Fragment key={'quality-tab-data-qualities-data-quality-quantitave-resultlist-value-' + index}>
                                                                                {strings.metadata.qualityContent.value}: {value}
                                                                            </React.Fragment>
                                                                        }
                                                                    </React.Fragment>
                                                                )
                                                            })}
                                                        </React.Fragment>
                                                    }


                                                </React.Fragment>
                                            )
                                        })}
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
export default QualityTabDataQualities;