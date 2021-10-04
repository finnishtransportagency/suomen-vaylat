import { useContext } from 'react';
import { faShareAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactReduxContext } from 'react-redux';
import ReactTooltip from 'react-tooltip';
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
        font-size: 14px;
        color: ${props => props.theme.colors.black};
        transition: all 0.5s ease-out;
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
    margin-right: 5px;
    border-radius: 50%;
    svg {
        color: ${props => props.theme.colors.mainWhite};
        font-size: 18px;
    };
    @media ${props => props.theme.device.mobileL} {
        width: 40px;
        height: 40px;
    };
`;

/**
 * Theme group share button
 * @param {String} theme theme name
 * @returns theme share button component
 */
export const ThemeGroupShareButton = ({ theme }) => {
    const { store } = useContext(ReactReduxContext);
    const url = process.env.REACT_APP_SITE_URL + '/theme/{lang}/{zoom}/{x}/{y}/' + encodeURIComponent(theme);
    const shareGroup = () => {
        store.dispatch(setShareUrl(url));
    };

    return(
        <>
            <ReactTooltip id={'share_' + theme} place='top' type='dark' effect='float'>
                <span>{strings.tooltips.shareTheme}</span>
            </ReactTooltip>
            <StyledShareButton
                data-tip data-for={'share_' + theme}
                onClick={(e) => {
                    e && e.stopPropagation();
                    shareGroup();
                }}>
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
export const WebSiteShareButton = () => {
    const { store } = useContext(ReactReduxContext);
    const url = process.env.REACT_APP_SITE_URL + '/link/{lang}/{layerlistType}/{zoom}/{x}/{y}/{maplayers}';
    return (
        <>
            <ReactTooltip id={'share_website'} place='bottom' type='dark' effect='float'>
                <span>{strings.tooltips.share}</span>
            </ReactTooltip>
            <StyledHeaderButton
                data-tip data-for={'share_website'}
                onClick={(e) => {
                    e && e.stopPropagation();
                    store.dispatch(setShareUrl(url));
                }}>
                <FontAwesomeIcon
                    icon={faShareAlt}
                />
            </StyledHeaderButton>
        </>
    );
};