import { useContext } from 'react';
import styled from 'styled-components';
import ReactTooltip from 'react-tooltip';
import { setShareUrl } from '../../state/slices/uiSlice';
import { ReactReduxContext } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShareAlt } from '@fortawesome/free-solid-svg-icons';
import strings from '../../translations';

const StyledShareButton = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    border: none;
    background-color: transparent;
    margin-right: 0px;
    svg {
        font-size: 14px;
        transition: all 0.5s ease-out;
        color: ${props => props.theme.colors.black};
    };
`;

const StyledHeaderButton = styled.div`
    position: relative;
    cursor: pointer;
    width: 40px;
    height: 40px;
    margin-right:5px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: transparent;
    border-radius: 50%;
    svg {
        font-size: 18px;
        color: ${props => props.theme.colors.mainWhite};
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
export const ThemeGroupShareButton = ({theme}) => {
    const { store } = useContext(ReactReduxContext);
    const url = process.env.REACT_APP_SITE_URL + '/theme/{lang}/{zoom}/{x}/{y}/' + encodeURIComponent(theme);
    const shareGroup = () => {
        store.dispatch(setShareUrl(url));
    };

    return(
        <>
            <ReactTooltip id={'share_' + theme} place='right' type='dark' effect='float'>
                <span>{strings.tooltips.share}</span>
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
        <StyledHeaderButton onClick={(e) => {
            e && e.stopPropagation();
            store.dispatch(setShareUrl(url));
        }}>
            <FontAwesomeIcon
                icon={faShareAlt}
            />
        </StyledHeaderButton>
    );
};