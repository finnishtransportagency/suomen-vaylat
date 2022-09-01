import strings from "../../translations";
import styled from "styled-components";
import { SEARCH_TIP_LOCALSTORAGE } from "../../utils/constants";

const StyledToastButton = styled.button`
    border: none;
    background: none;
    color: ${props => props.theme.colors.button};
    padding: 0px;
    font-weight: bold;
    &:hover {
        color: ${props => props.theme.colors.buttonActive }
    }
    margin-top: 12px;
`;

const StyledHeader = styled.div`
    padding: 0px;
    padding-bottom: 1em;
    font-size: 14px;
`;

const StyledContainer = styled.div`
    @media ${(props) => props.theme.device.desktop} {

    };
    @media ${props => props.theme.device.tablet} {
        height: 60vh;
        overflow: auto;
    };

    @media ${(props) => props.theme.device.mobileL} {
        height: 60vh;
        overflow: auto;
    };
`;

const StyledContent = styled.div`
    font-size: 14px;

`;

const StyledExamplesHeader = styled.div`
    font-size: 14px;
    padding-right: 8px;
`;

const StyledExample = styled.div`
    font-style: italic;
    font-size: 14px;
`;

const StyledTable = styled.div`
    display: table;
    width: auto;
    border-spacing: 5px;
    margin-left: 16px;
`;

const StyledRow = styled.div`
    display: table-row;
    width: auto;
`;

const StyledCol = styled.div`
    display: table-cell;
`;

export const SearchToast = ({header, texts, handleButtonClick}) => {

    const handleClick = () => {
        localStorage.setItem(SEARCH_TIP_LOCALSTORAGE, JSON.stringify(false));
        handleButtonClick();
    };

    return(
        <div>
            <StyledContainer>
                <StyledHeader>{header}</StyledHeader>
                {texts.map((text) => {
                    return (
                        <StyledContent key={text.text + '_content'}>
                            {text.text}
                            <StyledTable key={text.text + '_table'}>
                                <StyledRow key={text.text + '_row'}>
                                    <StyledCol key={text.text + '_col1'}>
                                        <StyledExamplesHeader key={text.text + '_header'}>{strings.search.tips.example}</StyledExamplesHeader>
                                    </StyledCol>
                                    <StyledCol key={text.text + '_col2'}>
                                    {text.examples.map((example) => {
                                            return (
                                                <StyledExample key={text.text + '_example_' + example}>{example}</StyledExample>
                                            )
                                        })}
                                    </StyledCol>
                                </StyledRow>
                            </StyledTable>
                        </StyledContent>
                    );
                })}
            </StyledContainer>
            <StyledToastButton onClick={() => handleClick()}>{ `${strings.general.OkLowerCaseK}, ${strings.general.dontShowAgain.toLowerCase()}.`}</StyledToastButton>
        </div>
    )

/*
    return(
        <div>
            <StyledContainer>
                <StyledHeader>{header}</StyledHeader>
                {texts.map((text) => {
                    return (
                        <StyledContent>
                            {text.text}
                            <table style={{marginLeft: "16px"}}>
                                <tr>
                                    <td style={{verticalAlign: "top"}}>
                                        <StyledExamplesHeader>{strings.search.tips.example}</StyledExamplesHeader>
                                    </td>
                                    <td>
                                    {text.examples.map((example) => {
                                            return (
                                                <StyledExample>{example}</StyledExample>
                                            )
                                        })}
                                    </td>
                                </tr>
                            </table>
                        </StyledContent>
                    );
                })}
            </StyledContainer>
            <StyledToastButton onClick={() => handleClick()}>{ `${strings.general.OkLowerCaseK}, ${strings.general.dontShowAgain.toLowerCase()}.`}</StyledToastButton>
        </div>
    )
    */
};

export default SearchToast;