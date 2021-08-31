import {StyledParagraph} from './Common';

export const UseLimitation = ({ uselimitation }) => {
    return (
        <>
        {uselimitation && uselimitation.length > 0 &&
            <>
                {uselimitation.map((data, index) => {
                    return (
                        <StyledParagraph key={'metadata-use-limitation-li-' + index}>
                            {data}
                        </StyledParagraph>
                    )
                })}
            </>
        }
        </>
    );
};
export default UseLimitation;