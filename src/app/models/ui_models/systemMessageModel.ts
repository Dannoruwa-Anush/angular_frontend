export type MessageType = 'success' | 'error' | 'info' | 'warning';

export interface SystemMessageModel {
  type: MessageType;
  text: string;
}
