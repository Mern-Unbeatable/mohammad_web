import MessagesContainer from '@/shared/pages/messages/MessagesContainer';
import { useChatRoute } from './useChatRoute';

/**
 * Persistent messenger for every chat section route. It stays mounted while
 * the URL moves between `messages[/:userId]` and `group[/:groupId]`, and
 * feeds the matched location to the container.
 */
const ChatLayout = ({ variant = 'dashboard' }) => {
  const { basePath, section, targetId } = useChatRoute();
  return (
    <MessagesContainer
      variant={variant}
      basePath={basePath}
      section={section}
      targetId={targetId}
    />
  );
};

export default ChatLayout;
