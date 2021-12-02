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

const upperBarImages = {
    0: suomenVaylatTextIcon,
    1: shareIcon,
    2: infoIcon,
    3: languageSelectionIcon,
};

const UserGuideUpperBarContent = () => {
    return (
        Object.values(strings.appGuide.modalContent.upperBar.content).map((value, index) => {
            return (
                <div>
                    <StyledIcon src={upperBarImages[index]} />
                    <StyledSubTitle>{value.title}</StyledSubTitle>
                    <p>{value.text}</p>
                </div>
            )
        })
    )
}

export default UserGuideUpperBarContent;