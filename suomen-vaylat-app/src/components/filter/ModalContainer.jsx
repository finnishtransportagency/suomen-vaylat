import { useContext, useState, useEffect, useRef } from "react";
import {
  faTimes,
  faAngleLeft,
  faAngleRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactReduxContext } from "react-redux";
import styled from "styled-components";
import strings from "../../translations";
import { useAppSelector } from "../../state/hooks";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Controller } from "swiper";
import { theme, isMobile } from "../../theme/theme";
import { CQLFilterModal } from "./CQLFilterModal";
import { setCQLFilteringInfo } from "../../state/slices/rpcSlice";

const StyledModalContainer = styled.div`
  :after {
    content: "";
    display: table;
    clear: both;
  }
  min-width: 20em;
  position: relative;
  display: flex;
  flex-direction: column;
  z-index: 2;
`;


const StyledGfiTab = styled.div`
  z-index: 10;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${(props) =>
    props.selected
      ? props.theme.colors.mainColor1
      : props.theme.colors.mainWhite};
  background-color: ${(props) =>
    props.selected
      ? props.theme.colors.mainWhite
      : props.theme.colors.mainColor1};
  border-left: 2px solid ${(props) => props.theme.colors.mainWhite};
  border-top: 2px solid ${(props) => props.theme.colors.mainWhite};
  border-right: 2px solid ${(props) => props.theme.colors.mainWhite};
  padding: 8px 16px 8px 8px;
  border-radius: 4px 4px 0px 0px;
`;

const StyledTabCloseButton = styled.div`
  display: flex;
  justify-content: center;
  margin-left: 12px;
`;

const StyledSwiper = styled(Swiper)`
  width: 100%;
  .swiper-slide {
    height: 1px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  .swiper-slide-active {
    height: auto;
  }
`;

const StyledTabsSwiper = styled(Swiper)`
  margin-left: unset;
  width: 100%;
  padding-top: 8px;
  .swiper-slide {
    max-width: 200px;
  }
  .swiper-slide-active {
  }
`;

const StyledSwiperNavigatorButton = styled.div`
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60px;
  background-color: ${(props) => props.theme.colors.mainColor1};
  svg {
    font-size: 20px;
    color: white;
  }
`;

const StyledTabSwiperContainer = styled.div`
  z-index: 2;
  display: flex;
  background-color: ${(props) => props.theme.colors.mainColor1};
`;

const StyledTabName = styled.p`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  @media ${(props) => props.theme.device.mobileL} {
    font-size: 14px;
  }
`;
const StyledTabContent = styled.div`
  user-select: text;
  overflow: hidden;
  display: flex;
  height: 100%;
`;


export const ModalContainer = ({}) => {
  // GET ALL FILTERS WITH LAYER AND MAP THEM BY LAYER TO RETURN CQLFILTERMODAL
  const [selectedTab, setSelectedTab] = useState(0);
  const [tabsContent, setTabsContent] = useState([]);
  const {
    cqlFilters,
    cqlFilteringInfo,
    allLayers,
    channel,
  } = useAppSelector((state) => state.rpc);
  const {
    minimizeCQLFilter
  } = useAppSelector((state) => state.ui);
  const gfiInputEl = useRef(null);
  const { store } = useContext(ReactReduxContext);

  useEffect(() => {
    gfiInputEl.current.swiper.slideTo(selectedTab);
  }, [selectedTab]);

  // When added a new layer filter, select that one aka the last one
  useEffect(() => {
    gfiInputEl.current.swiper.slideTo(cqlFilteringInfo.length);
  }, [cqlFilteringInfo]);

  // open the right tab when clicked on a layers filter button in selected layers
  useEffect(() => {
    if (!minimizeCQLFilter.minimized) {
        const index = cqlFilteringInfo.findIndex(f => f.layer.id === minimizeCQLFilter.layer)
        gfiInputEl.current.swiper.slideTo(index);
    }
  }, [minimizeCQLFilter]);

  const [gfiTabsSwiper, setGfiTabsSwiper] = useState(null);
  const [gfiTabsSnapGridLength, setGfiTabsSnapGridLength] = useState(0);

  const handleSelectTab = (index) => {
    setSelectedTab(index);
  };

  const closeTab = (index, id) => {
    // delete filter by layer
    store.dispatch(setCQLFilteringInfo(cqlFilteringInfo.filter(f => f.layer.id !== id)))
    if (index > 0) {
      handleSelectTab(index - 1);
    } else {
      handleSelectTab(0);
    }
  };
  return (
    <StyledModalContainer>
{        /** HAVE TABS HERE  */
}
        <StyledTabSwiperContainer>
          {!isMobile && gfiTabsSnapGridLength > 1 && (
            <StyledSwiperNavigatorButton
              onClick={() => {
                gfiTabsSwiper.slidePrev();
              }}
            >
              <FontAwesomeIcon icon={faAngleLeft} />
            </StyledSwiperNavigatorButton>
          )}

          <StyledTabsSwiper
            id={"cql-tabs-swiper"}
            spaceBetween={4}
            slidesPerView={"auto"}
            freeMode={true}
            modules={[Controller, FreeMode]}
            onSwiper={setGfiTabsSwiper}
            controller={{ control: gfiTabsSwiper }}
            onSnapGridLengthChange={(e) => {
                console.log(e.snapGrid.length)
              setGfiTabsSnapGridLength(e.snapGrid.length)}
            }
          >
            {cqlFilteringInfo.map((filter, index) => {
              return (

                <SwiperSlide id={"tab_" + index} key={"tab_" + index}>

                <StyledGfiTab
                    onClick={() => handleSelectTab(index)}
                    selected={selectedTab === index}
                >
{                    /** Get layer name compared to filter id */
}                    <StyledTabName>
                        {allLayers.filter(
                        (l) => l.id === filter?.layer?.id
                            ).length > 0
                                ? allLayers.filter(
                                    (l) => l.id === filter?.layer?.id
                                )[0].name
                                : filter?.layer?.id}
                    </StyledTabName>

{                    /** Close button for tab */
}                    <StyledTabCloseButton
                        onClick={(e) => {
                            e.stopPropagation();
                            closeTab(index, filter.layer.id);
                        }}
                    >
                        <FontAwesomeIcon icon={faTimes} />
                    </StyledTabCloseButton>
                </StyledGfiTab>
                </SwiperSlide>
              )})}


        </StyledTabsSwiper>
        
        {!isMobile && gfiTabsSnapGridLength > 1 && (
            <StyledSwiperNavigatorButton
              onClick={() => {
                gfiTabsSwiper.slideNext();
              }}
            >
              <FontAwesomeIcon icon={faAngleRight} />
            </StyledSwiperNavigatorButton>
          )}
        </StyledTabSwiperContainer>


        <StyledTabContent>
            <StyledSwiper
            ref={gfiInputEl}
            id={"cql-swiper"}
            onSlideChange={(e) => {
                handleSelectTab(e.activeIndex);
            }}
            tabIndex={selectedTab}
            allowTouchMove={isMobile} // Disable swiping
            speed={300}
            >
            {cqlFilteringInfo.map((filterInfo) => {
                
                return (
                    <SwiperSlide
                    style={{width: "20em"}}
                    id={"cql_tab_content_" + filterInfo?.layer?.id}
                    key={"cql_tab_content_" + filterInfo?.layer?.id}
                    >
                        <CQLFilterModal cqlFilterInfo={filterInfo}/>
                    </SwiperSlide>
                );
            })}
            </StyledSwiper>
      </StyledTabContent>

      
    </StyledModalContainer>
  );
};
