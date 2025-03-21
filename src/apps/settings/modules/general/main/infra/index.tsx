import { SeelenCommand, SupportedLanguages } from '@seelen-ui/lib';
import { path } from '@tauri-apps/api';
import { invoke } from '@tauri-apps/api/core';
import { Button, Input, Select, Switch, Tooltip } from 'antd';
import { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { startup } from '../../../shared/tauri/infra';
import { useAppDispatch } from '../../../shared/utils/infra';

import { RootActions } from '../../../shared/store/app/reducer';
import { RootSelectors } from '../../../shared/store/app/selectors';
import { Icon } from 'src/apps/shared/components/Icon';

import { SettingsGroup, SettingsOption } from '../../../../components/SettingsBox';
import { Colors } from './Colors';
import { IconPacks } from './IconPacks';
import { Themes } from './Themes';

export function General() {
  const [changingAutostart, setChangingAutostart] = useState(false);

  const autostartStatus = useSelector(RootSelectors.autostart);
  const language = useSelector(RootSelectors.language);
  const dateFormat = useSelector(RootSelectors.dateFormat);

  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const onAutoStart = async (value: boolean) => {
    setChangingAutostart(true);
    try {
      if (value) {
        await startup.enable();
      } else {
        await startup.disable();
      }
      dispatch(RootActions.setAutostart(await startup.isEnabled()));
    } catch (e) {
      console.error(e);
    }
    setChangingAutostart(false);
  };

  const onDateFormatChange = (e: ChangeEvent<HTMLInputElement>) =>
    dispatch(RootActions.setDateFormat(e.target.value));

  return (
    <>
      <SettingsGroup>
        <SettingsOption>
          <b>{t('general.startup')}</b>
          <Switch
            onChange={onAutoStart}
            value={!!autostartStatus}
            loading={changingAutostart || autostartStatus === null}
          />
        </SettingsOption>
      </SettingsGroup>
      <SettingsGroup>
        <SettingsOption>
          <b>{t('general.language')}</b>
          <Select
            showSearch
            filterOption={(_searching, option) => {
              if (!option) {
                return true;
              }
              const searching = _searching.toLocaleLowerCase();
              let label = option.label.toLocaleLowerCase();
              let enLabel = option.enLabel.toLocaleLowerCase();
              return label.includes(searching) || enLabel.includes(searching);
            }}
            style={{ width: '200px' }}
            value={language}
            options={[...SupportedLanguages]}
            onSelect={(value) => dispatch(RootActions.setLanguage(value))}
          />
        </SettingsOption>
        <SettingsOption>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <b>{t('general.date_format')}</b>
            <Tooltip
              title={
                <a href="https://momentjs.com/docs/#/displaying/format/" target="_blank">
                  https://momentjs.com/docs/#/displaying/format/
                </a>
              }
            >
              <Icon iconName="LuCircleHelp" />
            </Tooltip>
          </div>
          <Input
            style={{ width: '200px', maxWidth: '200px' }}
            placeholder="YYYY-MM-DD"
            value={dateFormat}
            onChange={onDateFormatChange}
          />
        </SettingsOption>
      </SettingsGroup>

      <Colors />

      <SettingsGroup>
        <SettingsOption>
          <b>{t('general.theme.label')}</b>
          <Tooltip title={t('general.theme.open_folder')}>
            <Button
              type="default"
              onClick={async () => {
                const dataDir = await path.appDataDir();
                invoke(SeelenCommand.OpenFile, { path: await path.join(dataDir, 'themes') });
              }}
            >
              <Icon iconName="PiFoldersDuotone" />
            </Button>
          </Tooltip>
        </SettingsOption>
        <Themes />
      </SettingsGroup>

      <SettingsGroup>
        <SettingsOption>
          <b>{t('general.icon_pack.label')}</b>
          <Tooltip title={t('general.icon_pack.open_folder')}>
            <Button
              type="default"
              onClick={async () => {
                const dataDir = await path.appDataDir();
                invoke(SeelenCommand.OpenFile, { path: await path.join(dataDir, 'icons') });
              }}
            >
              <Icon iconName="PiFoldersDuotone" />
            </Button>
          </Tooltip>
        </SettingsOption>
        <IconPacks />
      </SettingsGroup>
    </>
  );
}
