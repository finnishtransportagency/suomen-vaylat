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
import ViewsTab from './ViewsTab';
import GeometriesTab from './GeometriesTab';
import ProfileTab from './ProfileTab';

// -- Styled Components (unchanged unless noted) --
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
  const { savedTab, showSavedContentGeometryForm } = useAppSelector(
    (state) => state.ui
  );
  console.log(showSavedContentGeometryForm);
  const { isLoggedIn } = useAppSelector((state) => state.rpc);
  const [tabIndex, setTabIndex] = useState(0);

  const isProgrammaticSlide = useRef(false);

  const tabsContentLogged = [
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

  const tabsContent = [
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

  useEffect(() => {
    let newTabIndex = 0;
    if (savedTab !== null) {
      if (isLoggedIn) {
        newTabIndex = tabsContentLogged.findIndex(
          (tab) => tab.key === savedTab
        );
      } else {
        newTabIndex = tabsContent.findIndex((tab) => tab.key === savedTab);
      }
    }
    isProgrammaticSlide.current = true; // Mark as programmatic
    inputEl.current.swiper.slideTo(newTabIndex);
    setTabIndex(newTabIndex);
  }, [savedTab]);

  const handleChangeTab = (index) => {
    let newTabName = 'views';
    store.dispatch(setShowSavedContentGeometryForm(false));
    store.dispatch(setShowSavedContentViewForm(false));
    if (isLoggedIn) {
      newTabName = tabsContentLogged[index].key;
    } else {
      newTabName = tabsContent[index].key;
    }
    store.dispatch(setSavedTab(newTabName));
  };

  return (
    <>
      <StyledContent>
        <StyledTabs tabIndex={tabIndex} tabsCount={tabsContent.length}>
          {isLoggedIn
            ? tabsContentLogged.map((tab, index) => {
                return (
                  <StyledTab
                    key={'sc_tab_' + tab.title}
                    isSelected={index === tabIndex}
                    color={tab.titleColor}
                    onClick={() => handleChangeTab(index)}
                    tabsCount={tabsContent.length}
                  >
                    <p>{tab.title}</p>
                  </StyledTab>
                );
              })
            : tabsContent.map((tab, index) => {
                return (
                  <StyledTab
                    key={'sc_tab_' + tab.title}
                    isSelected={index === tabIndex}
                    color={tab.titleColor}
                    onClick={() => handleChangeTab(index)}
                    tabsCount={tabsContent.length}
                  >
                    <p>{tab.title}</p>
                  </StyledTab>
                );
              })}
        </StyledTabs>
        <StyledSwiper
          ref={inputEl}
          id={'app-info-swiper'}
          tabIndex={tabIndex}
          onSlideChange={(e) => {
            if (isProgrammaticSlide.current) {
              // Reset the flag, this was a programmatic slide
              isProgrammaticSlide.current = false;
              return;
            }
            // User-triggered slide change: dispatch tab change etc
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
    </>
  );
};

export default SavedContent;
