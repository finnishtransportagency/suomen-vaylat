import styled from 'styled-components';

const StyledWarningModalContainer = styled.div`
    padding: 16px;
    color: ${props => props.theme.colors.mainColor1};
`;

const StyledWarningTitle = styled.p`

`;

const StyledWarningSubtitle = styled.p`

`;

const StyledWarningButtonsContainer = styled.div`
    display: flex;
    justify-content: space-around;
    padding: 18px;
`;

const StyledActionButton = styled.button`
    min-height: 48px;
    min-width: 90px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    background-color: ${props => props.theme.colors.mainColor1};
    border-radius: 4px;
    padding: 8px 0px 8px 0px;
    box-shadow: 0px 3px 6px 0px rgba(0,0,0,0.16);
    border: none;
    color: white;
    padding: 8px 16px 8px 16px;
`;

const WarningModalContent = ({
    warning
}) => {
    return <StyledWarningModalContainer>
        <StyledWarningTitle>{warning.title && warning.title}</StyledWarningTitle>
        <StyledWarningSubtitle>{warning.subtitle && warning.subtitle}</StyledWarningSubtitle>
        <StyledWarningButtonsContainer>
            {
                warning.cancel &&
                <StyledActionButton
                    onClick={() => warning.cancel.action()}
                >
                    {warning.cancel.text}
                </StyledActionButton>
            }
            {
                warning.confirm &&
                <StyledActionButton
                    onClick={() => warning.confirm.action()}
                >
                     {warning.confirm.text}
                </StyledActionButton>
            }
        </StyledWarningButtonsContainer>

    </StyledWarningModalContainer>
};

export default WarningModalContent;