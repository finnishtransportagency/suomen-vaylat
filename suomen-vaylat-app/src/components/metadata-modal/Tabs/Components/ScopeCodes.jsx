import strings from '../../../../translations';
import {StyledTitle, StyledUl, StyledLi} from './Common';

export const ScopeCodes = ({ scopeCodes }) => {
    return (
        <>
        {scopeCodes && scopeCodes.length > 0 &&
            <>
                <StyledTitle>{strings.metadata.heading.scopeCode}</StyledTitle>
                <StyledUl>
                {scopeCodes.map((data, index) => {
                    return (
                        <StyledLi key={'metadata-scope-code-li-' + index}
                            title={(strings.metadata.codeLists['gmd:MD_ScopeCode'][data] || {description: data}).description}
                        >
                            {(strings.metadata.codeLists['gmd:MD_ScopeCode'][data] || {label: data}).label}
                        </StyledLi>
                    )
                })}
                </StyledUl>
            </>
        }
        </>
    );
};
export default ScopeCodes;