import { useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleUp } from '@fortawesome/free-solid-svg-icons';

const StyledDropDownContainerName = styled.p`
    transition: all 0.1s ease-in;
    font-size: 14px;
    font-weight: 400;
    margin: 0;
    padding-left: 10px;
    color: ${props => props.theme.colors.maincolor1};
`;

const StyledDropDownContainer = styled.div`
    overflow-y: auto;
    border-radius: 2px;
    transition: all 0.1s ease-in;
    color: ${props => props.theme.colors.black};
    background-color: ${props => props.theme.colors.mainWhite};
    &::-webkit-scrollbar {
        display: none;
  };
`;

const StyledHeaderContent = styled.div`
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 40px;
`;

const StyledExpandButton = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    border: none;
    background-color: transparent;
    margin-right: 10px;
    svg {
        font-size: 30px;
        transition: all 0.5s ease-out;
        color: ${props => props.theme.colors.black};
    };
`;

const StyledExpandContent = styled.div`

`;

const Dropdown = (props) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <StyledDropDownContainer
            isOpen={isOpen}
        >
        <StyledHeaderContent
            onClick={() => {
                setIsOpen(!isOpen);
            }}
        >
            <StyledDropDownContainerName>{props.title}</StyledDropDownContainerName>
            <StyledExpandButton>
                <FontAwesomeIcon
                    icon={faAngleUp}
                    style={{
                        transform: isOpen && "rotate(180deg)"
                    }}
                />
            </StyledExpandButton>
        </StyledHeaderContent>
        {isOpen && <StyledExpandContent>
                {props.children}
        </StyledExpandContent>}
    </StyledDropDownContainer>
    )
};

export default Dropdown;