import { RootSlice } from './reducer';

import { AnimationsSlice } from '../../general/animations/app';
import { BorderSlice } from '../../general/border/app';
import { ContainerTopBarSlice } from '../../general/containerTopBar/app';
import { GeneralSettingsSlice } from '../../general/main/app';

import { RootState } from '../domain/state';

export const RootSelectors = RootSlice.getSelectors((state: RootState) => state);

export const GeneralSettingsSelectors = GeneralSettingsSlice.getSelectors(RootSelectors.generals);

export const AnimationsSelectors = AnimationsSlice.getSelectors(GeneralSettingsSelectors.animations);
export const BorderSelectors = BorderSlice.getSelectors(GeneralSettingsSelectors.border);
export const ContainerTopBarSelectors = ContainerTopBarSlice.getSelectors(GeneralSettingsSelectors.containerTopBar);

export const getMonitorSelector = (idx: number) => (state: RootState) => RootSelectors.monitors(state)[idx];
export const getWorkspaceSelector = (idx: number, monitorIdx: number) => (state: RootState) => getMonitorSelector(monitorIdx)(state)?.workspaces[idx];
