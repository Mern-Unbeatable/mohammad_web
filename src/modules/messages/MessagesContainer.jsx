import { CHAT_BASE_PATHS, CHAT_SECTIONS } from '@/features/messages/chatPaths';
import MessagesPageContent from './components/layout/MessagesPageContent';
import NewMessageModal from '@/components/modals/messages/NewMessageModal';
import CreateGroupModal from '@/components/modals/messages/CreateGroupModal';
import ConversationInfoModal from '@/components/modals/messages/ConversationInfoModal';
import DeleteMessageModal from '@/components/modals/messages/DeleteMessageModal';
import LeaveGroupModal from '@/components/modals/messages/LeaveGroupModal';
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
