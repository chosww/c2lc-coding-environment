// @flow

export type DeviceConnectionStatus = 'notConnected' | 'connecting' | 'connected';

export type Program = Array<string>;

export type EditorMode = 'text' | 'block';

export type SelectedCommand = null | { command : 'forward' | 'left' | 'right' } | { func : 'add' | 'delete' };
