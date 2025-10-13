import React, { useContext } from 'react';
import { faMap } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAppSelector } from '../../../../state/hooks';
import { ReactReduxContext } from 'react-redux';
import strings from '../../../../translations';
import { selectGroup } from '../../../../utils/rpcUtil';
import { ThemeGroupShareButton } from '../../../share-website/ShareLinkButtons';
import Badge from '../../../badges/Badge';
import { theme } from '../../../../theme/theme';

// Adjust as needed!
const ThemeBadge = () => {
  const { store } = useContext(ReactReduxContext);
  const lang = strings.getLanguage();
  const { channel, selectedTheme, lastSelectedTheme } =
    useAppSelector((state) => state.rpc);

  const handleClose = () => {
    selectGroup(
      store,
      channel,
      null,
      selectedTheme,
      lastSelectedTheme,
      selectedTheme?.id
    );
  };

  return (
    <Badge
      idPrefix={"theme"}
      icon={<FontAwesomeIcon icon={faMap} />}
      title={selectedTheme?.locale[lang].name || ''}
      bg={theme.colors.secondaryColorGreen}
      actionButtons={[
        <ThemeGroupShareButton key="share" themeId={selectedTheme?.id} />
      ]}
      closeAction={handleClose}
    />
  );
}

export default ThemeBadge;