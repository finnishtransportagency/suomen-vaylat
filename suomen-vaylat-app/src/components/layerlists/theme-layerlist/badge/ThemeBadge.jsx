import React, { useContext } from 'react';
import { faMap } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAppSelector } from '../../../../state/hooks';
import { ReactReduxContext } from 'react-redux';
import strings from '../../../../translations';
import { closeTheme } from '../../../../utils/rpcUtil';
import { ThemeGroupShareButton } from '../../../share-website/ShareLinkButtons';
import Badge from '../../../badges/Badge';
import { theme } from '../../../../theme/theme';

const ThemeBadge = () => {
  const { store } = useContext(ReactReduxContext);
  const lang = strings.getLanguage();
  const { channel, selectedTheme } =
    useAppSelector((state) => state.rpc);

  const handleClose = () => {
    closeTheme(
      store,
      channel,
      selectedTheme
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