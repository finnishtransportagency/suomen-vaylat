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

// const upperBarContent = <div dangerouslySetInnerHTML={{ __html: '<StyledIcon src={suomenVaylatTextIcon} />' + strings.appGuide.modalContent.upperBar.content.startingView + '<br><br>' +
//         strings.appGuide.modalContent.upperBar.content.sharePage + '<br><br>' + strings.appGuide.modalContent.upperBar.content.infoButton + '<br><br>'
//         + strings.appGuide.modalContent.upperBar.content.languageSelection }}></div>

const UserGuideUpperBarContent = () => {
    return (
        <div>
            <StyledIcon src={suomenVaylatTextIcon} />
            <p>{strings.appGuide.modalContent.upperBar.content.startingView}</p>
            <StyledIcon src={shareIcon} />
            <p>{strings.appGuide.modalContent.upperBar.content.sharePage}</p>
            <StyledIcon src={infoIcon} />
            <p>{strings.appGuide.modalContent.upperBar.content.infoButton}</p>
            <StyledIcon src={languageSelectionIcon} />
            <p>{strings.appGuide.modalContent.upperBar.content.languageSelection}</p>
        </div>
    )
}

export default UserGuideUpperBarContent;