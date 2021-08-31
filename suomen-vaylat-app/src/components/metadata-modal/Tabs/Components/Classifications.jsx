import strings from '../../../../translations';
import {StyledTitle, StyledUl, StyledLi} from './Common';

export const Classifications = ({ identification }) => {
    return (
        <>
        {identification.classifications && identification.classifications.length > 0 &&
            <>
                <StyledTitle>{strings.metadata.heading.classifications}</StyledTitle>
                <StyledUl>
                {identification.classifications.map((data, index) => {
                    return (
                        <StyledLi key={'metadata-classification-li-' + index}
                            title={(strings.metadata.codeLists['gmd:MD_ClassificationCode'][data] || {description: data}).description}
                        >
                            {(strings.metadata.codeLists['gmd:MD_ClassificationCode'][data] || {label: data}).label}
                        </StyledLi>
                    )
                })}
                </StyledUl>
            </>
        }
        </>
    );
};
export default Classifications;