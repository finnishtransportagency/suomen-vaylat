import {StyledTitle} from './Common';

export const Citation = ({ identification }) => {
    return (
        <>
        {identification.citation.title.length > 0 &&
            <StyledTitle>{identification.citation.title}</StyledTitle>
        }
        </>
    );
};

export default Citation;