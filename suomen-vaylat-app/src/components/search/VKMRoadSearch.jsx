import styled from 'styled-components';
import strings from '../../translations';
import { motion, AnimatePresence } from 'framer-motion';

const StyledContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

const StyledDropdownContentItem = styled(motion.div)`
    user-select: none;
    cursor: pointer;
    padding-left: 8px;
    padding-bottom: 16px;
    border-radius: 5px;

    background-color: ${props => props.itemSelected ? props.theme.colors.mainColor3 : ''};
    p {
        margin: 0;
        padding: 0;
    }
`;

const StyledDropdownContentItemTitle = styled.p`
    text-align: ${props => props.type === 'noResults' && 'center'};
    font-size: 14px;
    color: #504d4d;
`;

const StyledInput = styled.input`
    width: 100%;
    cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
    margin: 0;
    padding-left: 8px;
    border: none;
    font-size: 14px;
    &:disabled {
        opacity: 0.3;
    };
    -moz-appearance: textfield;
    ::-webkit-inner-spin-button{
        -webkit-appearance: none;
        margin: 0;
    };
    ::-webkit-outer-spin-button{
        -webkit-appearance: none;
        margin: 0;
    };
    &:focus {
        outline: none;
    };
`;

const StyledLabel = styled.label`
    font-size: 14px;
    font-weight: bold;
    margin: 0px;
    color: ${props => props.error && props.theme.colors.secondaryColor6};
`;

const StyledSelect = styled.select`
    width: 100%;
    min-width: 95px;
    min-height: 48px;
    cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
    padding: 8px;
    border: 1px solid #e3e3e3;
    border-radius: 8px;
    &:disabled {
        opacity: 0.3;
    };
    &:focus {
        outline: none;
    };

`;

const StyledOption = styled.option`

`;

const DropdownContentItem = (props) => {
    return <StyledDropdownContentItem
        transition={{
            duration: 0.2,
            type: "tween"
        }}
        initial={{
            opacity: 0,
            height: 0,
        }}
        animate={{
            opacity: 1,
            height: "auto",
        }}
        exit={{
            opacity: 0,
            height: 0,
        }}
        >
            {props.children}
    </StyledDropdownContentItem>
};

const VKMRoadSearch = ({
  searchValue,
  setSearchValue,
  handleVKMSearch,
  vkmError,
  setVkmError
}) => {

    if (searchValue === '' && vkmError !== null) {
        setVkmError(null);
    }
    return (
        <StyledContainer>
            <>
                {
                    vkmError &&
                    <StyledDropdownContentItem>
                        <StyledDropdownContentItemTitle type='noResults'>{strings.search.vkm.error.text}</StyledDropdownContentItemTitle>
                        <StyledDropdownContentItemTitle type='noResults'>{vkmError}</StyledDropdownContentItemTitle>
                    </StyledDropdownContentItem>
                }
                <AnimatePresence>
                    {
                        searchValue.hasOwnProperty('tieosat') && searchValue.tieosat.length > 0 && 
                        <DropdownContentItem>
                            <StyledLabel htmlFor='vkm-tieosa'>{strings.search.vkm.osa}:</StyledLabel>
                            <StyledSelect
                                id='vkm-tieosa'
                                onChange={e => {
                                    handleVKMSearch({
                                        vkmTienumero: searchValue.tienumero,
                                        vkmTieosa: e.target.value
                                    });
                                }}
                                disabled={!searchValue.tieosat || (searchValue.tieosat && !searchValue.tieosat.length > 0)}
                                value={searchValue.tieosa || 'default'}
                            >
                                <StyledOption value='default' disabled readOnly={true}>{strings.search.vkm.osa}</StyledOption>
                                {
                                    searchValue.tieosat && searchValue.tieosat.map(tieosa => {
                                        return <StyledOption key={'vkm_tieosa_'+tieosa} value={tieosa}>{tieosa}</StyledOption>
                                    })
                                }
                            </StyledSelect>
                        </DropdownContentItem>
                    }
                </AnimatePresence>

                <AnimatePresence>
                    {
                        searchValue.hasOwnProperty('ajoradat') && searchValue.ajoradat.length > 0 && 
                        <DropdownContentItem>
                            <StyledLabel htmlFor='vkm-ajorata'>{strings.search.vkm.ajorata}:</StyledLabel>
                            <StyledSelect
                                id='vkm-ajorata'
                                onChange={e => {
                                    handleVKMSearch({
                                        vkmTienumero: searchValue.tienumero,
                                        vkmTieosa: searchValue.tieosa,
                                        vkmAjorata: e.target.value
                                    });
                                }}
                                disabled={!searchValue.ajoradat || (searchValue.ajoradat && !searchValue.ajoradat.length > 0)}
                                value={searchValue.hasOwnProperty('ajorata') ? searchValue.ajorata : 'default'}
                            >
                                <StyledOption value='default' disabled readOnly={true}>{strings.search.vkm.ajorata}</StyledOption>
                                {
                                    searchValue.ajoradat && searchValue.ajoradat.map(item => {
                                        return <StyledOption key={'vkm_ajorata_'+item} value={item}>{item}</StyledOption>
                                    })
                                }
                            </StyledSelect>
                        </DropdownContentItem>
                    }
                </AnimatePresence>

                <AnimatePresence>
                    {
                        searchValue.hasOwnProperty('ajorata') && searchValue.ajorata !== 'default' &&
                        <DropdownContentItem>
                            <StyledLabel
                                htmlFor='vkm-etaisyys'
                                error={vkmError}
                            >
                                    {strings.search.vkm.etaisyys}:
                            </StyledLabel>
                            <StyledInput
                                id='vkm-etaisyys'
                                placeholder={strings.search.vkm.etaisyys}
                                min='1'
                                type='number'
                                onChange={e => {
                                    setSearchValue({
                                        tienumero: searchValue.tienumero,
                                        tieosa: searchValue.tieosa,
                                        ajorata: searchValue.ajorata,
                                        etaisyys: e.target.value,
                                        tieosat: searchValue.tieosat,
                                        ajoradat: searchValue.ajoradat
                                    });
                                }}
                                value={searchValue.etaisyys || ''}
                                disabled={!searchValue.ajoradat || (searchValue.ajoradat && !searchValue.ajoradat.length > 0)}
                                onKeyPress={e => {
                                        if (e.key === 'Enter') {
                                            handleVKMSearch({vkmTienumero: searchValue.tienumero, vkmTieosa: searchValue.tieosa, vkmAjorata: searchValue.ajorata, vkmEtaisyys: e.target.value});
                                        }
                                    }
                                }
                            />
                        </DropdownContentItem>
                    }
                </AnimatePresence>

            </>
        </StyledContainer>
    );
};
export default VKMRoadSearch;