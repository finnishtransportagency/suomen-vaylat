import { useContext } from 'react';
import styled from 'styled-components';

import { faMap, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppSelector } from '../../state/hooks';
import { ReactReduxContext } from 'react-redux';

import { selectGroup } from '../../utils/rpcUtil';

import { ThemeGroupShareButton } from '../share-web-site/ShareLinkButtons';

import { motion } from 'framer-motion';

const variants = {
    open: {
        pointerEvents: 'auto',
        y: 0,
        x: '-50%',
        opacity: 1,
    },
    closed: {
        pointerEvents: 'none',
        y: '20px',
        x: '-50%',
        opacity: 0,
    },
};

const StyledActionButtonWrapper = styled(motion.div)`
    position: absolute;
    top: 0px;
    left: 50vw;
    width: 100%;
    max-width: 312px;
    height: 48px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: ${props => props.theme.colors.secondaryColor2};
    box-shadow: 2px 2px 4px #0000004D;
    margin-top: 16px;
    border-radius: 24px;
    color: ${props => props.theme.colors.mainWhite};
    pointer-events: auto;
    svg {
        color: ${props => props.theme.colors.mainWhite};
    }
`;

const StyledLeftContent = styled.div`
    height: 100%;
    display: flex;
    align-items: center;

`;

const StyledRightContent = styled.div`
    height: 100%;
    display: flex;
    align-items: center;
`;

const StyledActionButtonIcon = styled.div`
    min-width: 48px;
    height: 48px;
    display: flex;
    justify-content: center;
    align-items: center;
    svg {
        font-size: 18px;
    };
`;

const StyledActionButtonText = styled.p`
    width: 100%;
    margin: 0;
    font-size: 14px;
    font-weight: 600;
    user-select: none;
`;

const StyledActionButtonClose = styled.div`
    width: 48px;
    height: 48px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    svg {
        font-size: 20px;
    };
`;

const ThemeMapsActionButton = () => {
    const { store } = useContext(ReactReduxContext);

    const { channel, selectedTheme,  lastSelectedTheme, selectedThemeIndex} = useAppSelector((state) => state.rpc);

    const handleSelectGroup = (index, theme) => {
        selectGroup(store, channel, index, theme, lastSelectedTheme, selectedThemeIndex);
    };


    return (
    <StyledActionButtonWrapper
        initial='closed'
        animate={selectedTheme && selectedTheme !== '' ? 'open' : 'closed'}
        variants={variants}
        transition={{
            duration: 0.3,
            type: "tween"
        }}
    >
        <StyledLeftContent>
            <StyledActionButtonIcon>
                <FontAwesomeIcon
                    icon={faMap}
                />
            </StyledActionButtonIcon>
            <StyledActionButtonText>{selectedTheme && selectedTheme.name}</StyledActionButtonText>
        </StyledLeftContent>
        <StyledRightContent>
            <ThemeGroupShareButton themeId={selectedTheme && selectedTheme.id}/>
            <StyledActionButtonClose
                onClick={() => handleSelectGroup(selectedThemeIndex, selectedTheme)}
            >
                <FontAwesomeIcon
                    icon={faTimes}
                />
            </StyledActionButtonClose>
        </StyledRightContent>

    </StyledActionButtonWrapper>
    )
};

export default ThemeMapsActionButton;