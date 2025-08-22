import { useEffect, useContext, useRef, useState } from 'react';
import { ReactReduxContext } from 'react-redux';
import { useAppSelector } from '../../state/hooks';
import styled from 'styled-components';
import strings from '../../translations';
import {
  setSavedTab,
  setShowSavedContentGeometryForm,
  setShowSavedContentViewForm
} from '../../state/slices/uiSlice';

import { Swiper, SwiperSlide } from 'swiper/react';
import ViewsTab from './Views/ViewsTab';
import GeometriesTab from './Geometries/GeometriesTab';
import ProfileTab from './ProfileTab';

const StyledContent = styled.div`
  max-width: 660px;
  overflow: hidden;
  flex-direction: column;
  display: flex;
  height: 100%;
`;

const StyledTabs = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  max-height: 100px;
  background-color: #f2f2f2;
  &::before {
    z-index: 2;
    position: absolute;
    content: '';
    width: ${(props) => 'calc(100% /' + props.tabsCount + ')'};
    height: 100%;
    background-color: ${(props) => props.theme.colors.mainWhite};
    bottom: 0px;
    left: ${(props) => props.tabIndex * (100 / (props.tabsCount - 1)) + '%'};
    border-radius: 4px 4px 0px 0px;
    transform: translateX(
      ${(props) => {
        return props.tabIndex * -(100 / (props.tabsCount - 1)) + '%';
      }}
    );
    transition: all 0.3s ease-out;
  }
  &::after {
    position: absolute;
    content: '';
    width: ${(props) => 'calc(100% /' + props.tabsCount + ')'};
    height: 100%;
    bottom: 0px;
    left: ${(props) => props.tabIndex * (100 / (props.tabsCount - 1)) + '%'};
    border-radius: 4px 4px 0px 0px;
    transform: translateX(
      ${(props) => {
        return props.tabIndex * -(100 / (props.tabsCount - 1)) + '%';
      }}
    );
    transition: all 0.3s ease-out;
    box-shadow: 0px -1px 11px rgba(0, 99, 175, 0.3);
  }
`;

const StyledTab = styled.div`
  z-index: 2;
  user-select: none;
  width: ${(props) => 'calc(100% /' + props.tabsCount + ')'};
  cursor: pointer;
  color: ${(props) =>
    props.isSelected ? props.theme.colors[props.color] : '#656565'};
  text-align: center;
  transition: color 0.2s ease-out;
  display: flex;
  justify-content: center;

  p {
    font-size: 15px;
    font-weight: bold;
    margin: 0;
    padding: 10px;
  }
`;

const StyledSwiper = styled(Swiper)`
  margin-left: 0;
  margin-right: 0;

  .swiper-slide {
    background-color: ${(props) => props.theme.colors.mainWhite};
    padding: 16px 16px 16px 16px;
    overflow-y: auto;
    height: 100%;
  }
  transition: box-shadow 0.3s ease-out;
`;

export const SavedContent = () => {
  const inputEl = useRef(null);

  const { store } = useContext(ReactReduxContext);
  const { savedTab } = useAppSelector(
    (state) => state.ui
  );
  const { isLoggedIn } = useAppSelector((state) => state.rpc);
  const [tabIndex, setTabIndex] = useState(0);

  const isProgrammaticSlide = useRef(false);

  const tabsContentLoggedIn = [
    {
      key: 'profile',
      title: strings.savedContent.profileTitle,
      titleColor: 'mainColor1',
      content: <ProfileTab />
    },
    {
      key: 'views',
      title: strings.savedContent.viewTitle,
      titleColor: 'mainColor1',
      content: <ViewsTab />
    },
    {
      key: 'geometry',
      title: strings.savedContent.geometryTitle,
      titleColor: 'mainColor1',
      content: <GeometriesTab />
    }
  ];

  const tabsContentLoggedOut = [
    {
      key: 'views',
      title: strings.savedContent.viewTitle,
      titleColor: 'mainColor1',
      content: <ViewsTab />
    },
    {
      key: 'geometry',
      title: strings.savedContent.geometryTitle,
      titleColor: 'mainColor1',
      content: <GeometriesTab />
    }
  ];

  // Choose correct content array for current login state
  const tabsContent = isLoggedIn ? tabsContentLoggedIn : tabsContentLoggedOut;

  useEffect(() => {
    let newTabIndex = 0;
    if (savedTab !== null) {
      newTabIndex = tabsContent.findIndex((tab) => tab.key === savedTab);
      if (newTabIndex === -1) newTabIndex = 0; // fallback
    }
    isProgrammaticSlide.current = true;
    inputEl.current.swiper.slideTo(newTabIndex);
    setTabIndex(newTabIndex);
  }, [savedTab]);

  const handleChangeTab = (index) => {
    // If user clicked the currently active tab, do nothing.
    if (index === tabIndex) return;

    let newTabName = tabsContent[index].key;
    store.dispatch(setShowSavedContentGeometryForm(false));
    store.dispatch(setShowSavedContentViewForm(false));
    store.dispatch(setSavedTab(newTabName));
  };

  return (
    <StyledContent>
      <StyledTabs tabIndex={tabIndex} tabsCount={tabsContent.length}>
        {tabsContent.map((tab, index) => (
          <StyledTab
            key={'sc_tab_' + tab.title}
            isSelected={index === tabIndex}
            color={tab.titleColor}
            onClick={(e) => handleChangeTab(index)}
            tabsCount={tabsContent.length}
          >
            <p>{tab.title}</p>
          </StyledTab>
        ))}
      </StyledTabs>
      <StyledSwiper
        ref={inputEl}
        id={'app-info-swiper'}
        tabIndex={tabIndex}
        onSlideChange={(e) => {
          if (isProgrammaticSlide.current) {
            isProgrammaticSlide.current = false;
            return;
          }
          if (e.activeIndex !== tabIndex) {
            handleChangeTab(e.activeIndex);
          }
        }}
        allowTouchMove={false}
        speed={300}
      >
        {tabsContent.map((tab, index) => (
          <SwiperSlide
            id={'sc_tab_content_' + index}
            key={'sc_tab_content_' + index}
          >
            {tab.content}
          </SwiperSlide>
        ))}
      </StyledSwiper>
    </StyledContent>
  );
};

export default SavedContent;
