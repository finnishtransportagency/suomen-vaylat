import { useContext } from 'react';
import { faShareAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactReduxContext } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import { theme, isMobile } from '../../theme/theme';
import styled from 'styled-components';
import { setShareUrl } from '../../state/slices/uiSlice';
import strings from '../../translations';

const StyledShareButton = styled.button`
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: transparent;
    margin-right: 0px;
    border: none;
    svg {
        font-size: 18px;
        color: ${props => props.color ? props.color : props.theme.colors.black};
        transition: all 0.5s ease-out;
    };
    @media ${props => props.theme.device.mobileL} {
        font-size: 16px;
    };
`;

const StyledHeaderButton = styled.div`
    position: relative;
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    background-color: transparent;
    border-radius: 50%;
    svg {
        color: ${props => props.theme.colors.mainWhite};
        font-size: 22px;
    };
    @media ${props => props.theme.device.mobileL} {
        width: 40px;
        height: 40px;
        svg {
            font-size: 18px;
        };
    };
`;

/**
 * Theme group share button
 * @param {String} theme theme name
 * @returns theme share button component
 */
export const ThemeGroupShareButton = ({ themeId, color }) => {
    const { store } = useContext(ReactReduxContext);
    const url = process.env.REACT_APP_SITE_URL + '/theme/{zoom}/{x}/{y}/' + themeId + '/?lang={lang}';

    return(
        <>
            <ReactTooltip backgroundColor={theme.colors.secondaryColor2} disable={isMobile} id={'share_' + themeId} place='bottom' type='dark' effect='solid'>
                <span>{strings.tooltips.shareTheme}</span>
            </ReactTooltip>
            <StyledShareButton
                data-tip data-for={'share_' + themeId}
                onClick={(e) => {
                    e && e.stopPropagation();
                    store.dispatch(setShareUrl(url));
                }}
                color={color}
            >
                <FontAwesomeIcon
                    icon={faShareAlt}
                />
            </StyledShareButton>
        </>
    );
};

/**
 * Website share button
 * @returns  website share button component
 */
export const WebSiteShareButton = ({setSubNavOpen}) => {
    const { store } = useContext(ReactReduxContext);
    const url = process.env.REACT_APP_SITE_URL + '/link/{zoom}/{x}/{y}/{maplayers}/?lang={lang}';
    return (
        <>
            <ReactTooltip backgroundColor={theme.colors.mainColor1} disable={isMobile} id={'share_website'} place='bottom' type='dark' effect='float'>
                <span>{strings.tooltips.share}</span>
            </ReactTooltip>
            <StyledHeaderButton
                data-tip data-for={'share_website'}
                onClick={(e) => {
                    e && e.stopPropagation();
                    setSubNavOpen && setSubNavOpen(false);
                    store.dispatch(setShareUrl(url));
                }}>
                <FontAwesomeIcon
                    icon={faShareAlt}
                />
            </StyledHeaderButton>
        </>
    );
};