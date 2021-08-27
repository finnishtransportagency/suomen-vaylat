import strings from '../../../../translations';
import {StyledTitle, StyledUl, StyledLi, StyledA} from './Common';

export const OnlineResources = ({ onlineResources }) => {
    return (
        <>
        {onlineResources && onlineResources.length > 0 &&
            <>
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
                        return (<></>)
                    }
                })}
                </StyledUl>
            </>
        }
        </>
    );
};
export default OnlineResources;