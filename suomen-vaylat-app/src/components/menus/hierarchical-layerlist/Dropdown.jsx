import { useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleUp } from '@fortawesome/free-solid-svg-icons';

const StyledDropDownContainerName = styled.p`
    color: ${props => props.theme.colors.maincolor1};
    margin: 0;
    padding-left: 10px;
    font-size: 14px;
    font-weight: 400;
    transition: all 0.1s ease-in;
`;

const StyledDropDownContainer = styled.div`
    color: ${props => props.theme.colors.black};
    background-color: ${props => props.theme.colors.mainWhite};
    border-radius: 2px;
    transition: all 0.1s ease-in;
    &::-webkit-scrollbar {
        display: none;
    };
`;

const StyledHeaderContent = styled.div`
    z-index: 1;
    position: sticky;
    top: 0px;
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    box-shadow: rgb(0 0 0 / 16%) 0px 3px 6px, rgb(0 0 0 / 23%) 0px 3px 6px;
    background-color: #fff;
`;

const StyledExpandButton = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: transparent;
    margin-right: 10px;
    border: none;
    svg {
        color: ${props => props.theme.colors.black};
        font-size: 30px;
        transition: all 0.5s ease-out;
    };
`;

const StyledExpandContent = styled.div`

`;

const Dropdown = (props) => {
    const [isOpen, setIsOpen] = useState(props.isOpen === true);
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