import strings from "../../translations";
import styled from "styled-components";
import suomenVaylatTextIcon from "./images/suomen_vaylat_text.jpg"
import shareIcon from "./images/jaa_sivu.jpg"
import infoIcon from "./images/info_nappi.jpg"
import languageSelectionIcon from "./images/kieli_valinta.jpg"

const StyledIcon = styled.img`
    // width: 100%;
    height: 28px;
`;

const StyledSubTitle = styled.em`
    margin-left: 5px;
    color: ${props => props.theme.colors.mainColor1}; 
`;

const UserGuideUpperBarContent = () => {
    return (
        <div>
            <StyledIcon src={suomenVaylatTextIcon} />
            <StyledSubTitle>{strings.appGuide.modalContent.upperBar.startingView.title}</StyledSubTitle>
            <p>{strings.appGuide.modalContent.upperBar.startingView.text}</p>
            <StyledIcon src={shareIcon} />
            <StyledSubTitle>{strings.appGuide.modalContent.upperBar.sharePage.title}</StyledSubTitle>
            <p>{strings.appGuide.modalContent.upperBar.sharePage.text}</p>
            <StyledIcon src={infoIcon} />
            <StyledSubTitle>{strings.appGuide.modalContent.upperBar.infoButton.title}</StyledSubTitle>
            <p>{strings.appGuide.modalContent.upperBar.infoButton.text}</p>
            <StyledIcon src={languageSelectionIcon} />
            <StyledSubTitle>{strings.appGuide.modalContent.upperBar.languageSelection.title}</StyledSubTitle>
            <p>{strings.appGuide.modalContent.upperBar.languageSelection.text}</p>
        </div>
    )
}

export default UserGuideUpperBarContent;