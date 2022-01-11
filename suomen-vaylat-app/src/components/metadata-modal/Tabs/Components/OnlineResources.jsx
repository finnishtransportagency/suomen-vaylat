import React from 'react';
import strings from '../../../../translations';
import { StyledA, StyledLi, StyledTitle, StyledUl } from './Common';

export const OnlineResources = ({ onlineResources }) => {
    return (
        <React.Fragment key={'metadata-modal-online-resources'}>
            {onlineResources && onlineResources.length > 0 &&
                <React.Fragment key={'metadata-modal-online-resources-content'}>
                    <StyledTitle>{strings.metadata.heading.onlineResource}</StyledTitle>
                    <StyledUl>
                        {onlineResources.map((onlineResource, index) => {
                            if (onlineResource.url.length > 0) {
                                return (
                                    <StyledLi key={'metadata-online-resource-li-' + index}>
                                        <StyledA href={onlineResource.url} key={'metadata-online-resource-li-a-' + index}>
                                            {onlineResource.name && onlineResource.name.length ? onlineResource.name : onlineResource.url}
                                        </StyledA>
                                    </StyledLi>
                                )
                            } else {
                                return (<React.Fragment key={'metadata-modal-online-resources-empty'}></React.Fragment>)
                            }
                        })}
                    </StyledUl>
                </React.Fragment>
            }
        </React.Fragment>
    );
};
export default OnlineResources;