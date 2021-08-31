import strings from '../../../../translations';
import {StyledTitle, StyledUl} from './Common';
import UseLimitation from './UseLimitation';

export const UseLimitations = ({ identification }) => {
    return (
        <>
        {identification.useLimitations && identification.useLimitations.length > 0 &&
            <>
                <StyledTitle>{strings.metadata.heading.useLimitation}</StyledTitle>
                <StyledUl>
                {identification.useLimitations.map((data) => {
                    return (
                        <UseLimitation uselimitation={data}></UseLimitation>
                    )
                })}
                </StyledUl>
            </>
        }
        </>
    );
};
export default UseLimitations;