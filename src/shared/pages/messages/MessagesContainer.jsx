import { CHAT_BASE_PATHS, CHAT_SECTIONS } from '@/shared/constants/chat';
import MessagesPageContent from './components/layout/MessagesPageContent';
import NewMessageModal from './components/modals/NewMessageModal';
import CreateGroupModal from './components/modals/CreateGroupModal';
import ConversationInfoModal from './components/modals/ConversationInfoModal';
import DeleteMessageModal from './components/modals/DeleteMessageModal';
import LeaveGroupModal from './components/modals/LeaveGroupModal';
import { useMessagesContainer } from './hooks/useMessagesContainer';

/**
 * API-backed messenger shared by User, Supplier and Admin inboxes.
 * The URL is the source of truth (see `ChatLayout`): `section` picks the
 * tab and `targetId` the open conversation — the other user's id for direct
 * chats (opens the composer when no thread exists yet), the conversation id
 * for groups. `?listing=<id>` on a direct chat preloads that marketplace
 * listing into the composer (see `listingChatPath`).
 */
const MessagesContainer = ({
  variant = 'dashboard',
  basePath = CHAT_BASE_PATHS.USER,
  section = CHAT_SECTIONS.DIRECT,
  targetId = null,
}) => {
  const { pageProps, newMessageProps, createGroupProps, infoProps, deleteProps, leaveProps } =
    useMessagesContainer({ variant, basePath, section, targetId });

  return (
    <>
      <MessagesPageContent {...pageProps} />
      <NewMessageModal {...newMessageProps} />
      <CreateGroupModal {...createGroupProps} />
      <ConversationInfoModal {...infoProps} />
      <DeleteMessageModal {...deleteProps} />
      <LeaveGroupModal {...leaveProps} />
    </>
  );
};

export default MessagesContainer;
