import strings from '../../../../translations';
import {StyledTitle, StyledUl, StyledLi} from './Common';

export const Languages = ({ identification }) => {
    return (
        <>
        {identification.languages && identification.languages.length > 0 &&
            <>
                <StyledTitle>{strings.metadata.heading.resourceLanguage}</StyledTitle>
                <StyledUl>
                {identification.languages.map((language, index) => {
                        return (
                            <StyledLi>
                                {strings.metadata.languages[language] || language}
                            </StyledLi>
                        )
                })}
                </StyledUl>
            </>
        }
        </>
    );
};
export default Languages;