import { CHAT_SECTIONS } from '@/shared/constants/chat';
import { CHAT_TAB, CONVERSATION_TYPE } from '../constant/constants';

export const tabForSection = (section) =>
  section === CHAT_SECTIONS.GROUP ? CHAT_TAB.GROUPS : CHAT_TAB.MESSAGES;

export const sectionForTab = (tab) =>
  tab === CHAT_TAB.GROUPS ? CHAT_SECTIONS.GROUP : CHAT_SECTIONS.DIRECT;

export const typeForTab = (tab) =>
  tab === CHAT_TAB.GROUPS ? CONVERSATION_TYPE.GROUP : CONVERSATION_TYPE.DIRECT;
