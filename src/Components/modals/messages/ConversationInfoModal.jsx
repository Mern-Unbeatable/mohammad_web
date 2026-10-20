import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Crown, Loader2, LogOut, Pencil, UserMinus, UserPlus, X } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import AddMembersModal from '@/components/modals/messages/AddMembersModal';
<<<<<<< HEAD
import { Input } from '@/components/form-controls';
=======

const fieldClass =
  'w-full rounded-lg border border-[#E4E7EC] bg-white px-3.5 py-2.5 text-[14px] text-deep-blue outline-none placeholder:text-[#98A2B3] focus:border-primary focus:ring-2 focus:ring-primary/10';
>>>>>>> 88bd014ce48e4532e70b1b96d0e2b84bc164fef5

const ConversationInfo = ({
  conversation,
  currentUserId,
  onlineUserIds,
  onClose,
  onRename,
  onAddMembers,
  onRemoveMember,
  onLeave,
  recipients,
  recipientsLoading,
  onSearchRecipients,
  getProfileHref,
  busy,
}) => {
  const [editingName, setEditingName] = useState(false);
  const [name, setName] = useState(conversation.name || '');
  const [adding, setAdding] = useState(false);
  const [removingId, setRemovingId] = useState(null);

  const removeMember = async (userId) => {
    if (removingId) return;
    setRemovingId(userId);
    try {
      await onRemoveMember?.(userId);
    } finally {
      setRemovingId(null);
    }
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const isGroup = conversation.isGroup;
  const isOwner = conversation.myRole === 'OWNER';
  const members = conversation.participants || [];
  const memberIds = members.map((m) => m.id);

  const submitRename = async (e) => {
    e.preventDefault();
    if (!name.trim() || name.trim() === conversation.name) {
      setEditingName(false);
      return;
    }
    const ok = await onRename?.(name.trim());
    if (ok !== false) setEditingName(false);
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end justify-center bg-black/50 sm:items-center sm:p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="flex max-h-[92dvh] w-full flex-col rounded-t-2xl bg-white sm:max-w-[480px] sm:rounded-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="conversation-info-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-start justify-between border-b border-[#E4E7EC] px-5 py-4">
          <div className="flex min-w-0 items-center gap-3">
            <Avatar
              src={conversation.avatar}
              alt={conversation.name}
              initials={conversation.initials}
              size="lg"
            />
            <div className="min-w-0">
              {editingName ? (
                <form onSubmit={submitRename} className="flex items-center gap-2">
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={160}
                    aria-label="Group name"
                    autoFocus
                  />
                  <button
                    type="submit"
                    disabled={busy}
                    className="rounded-lg bg-primary px-3 py-2 text-[12px] font-semibold text-white disabled:opacity-60"
                  >
                    Save
                  </button>
                </form>
              ) : (
                <h2
                  id="conversation-info-title"
                  className="flex items-center gap-2 truncate text-[17px] font-bold text-deep-blue"
                >
                  <span className="truncate">{conversation.name}</span>
                  {isGroup && isOwner && onRename ? (
                    <button
                      type="button"
                      onClick={() => setEditingName(true)}
                      aria-label="Rename group"
                      className="rounded-md p-1 text-[#64748B] hover:bg-[#F9FAFB]"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                  ) : null}
                </h2>
              )}
              <p className="mt-0.5 truncate text-[13px] text-[#64748B]">
                {isGroup ? `${members.length} members` : conversation.subtitle}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-[#64748B] hover:bg-[#F9FAFB]"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-4 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[13px] font-semibold text-deep-blue">
              {isGroup ? 'Members' : 'Participants'}
            </p>
            {isGroup && isOwner && onAddMembers ? (
              <button
                type="button"
                onClick={() => setAdding(true)}
                className="inline-flex items-center gap-1 text-[12px] font-semibold text-primary"
              >
                <UserPlus className="h-3.5 w-3.5" />
                Add members
              </button>
            ) : null}
          </div>

          <ul className="space-y-1">
            {members.map((member) => {
              const isSelf = member.id === currentUserId;
              const profileHref = isSelf ? null : getProfileHref?.(member.id) || null;
              const identity = (
                <>
                  <div className="relative shrink-0">
                    <Avatar src={member.avatar} alt={member.name} initials={member.initials} size="sm" />
                    {!isSelf && onlineUserIds?.has(member.id) ? (
                      <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-primary" />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-1.5 truncate text-[14px] font-medium text-deep-blue">
                      <span
                        className={`truncate ${
                          profileHref ? 'group-hover:text-primary group-hover:underline' : ''
                        }`}
                      >
                        {member.name}
                        {isSelf ? ' (you)' : ''}
                      </span>
                      {isGroup && member.role === 'OWNER' ? (
                        <Crown className="h-3.5 w-3.5 shrink-0 text-[#E6A23C]" aria-label="Owner" />
                      ) : null}
                    </p>
                    {member.subtitle ? (
                      <p className="truncate text-[12px] text-[#64748B]">{member.subtitle}</p>
                    ) : null}
                  </div>
                </>
              );
              return (
                <li key={member.id} className="flex items-center gap-3 rounded-lg px-1 py-2">
                  {profileHref ? (
                    <Link
                      to={profileHref}
                      title={`View ${member.name}'s profile`}
                      className="group flex min-w-0 flex-1 items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                    >
                      {identity}
                    </Link>
                  ) : (
                    <div className="flex min-w-0 flex-1 items-center gap-3">{identity}</div>
                  )}
                  {isGroup && isOwner && !isSelf && onRemoveMember ? (
                    <button
                      type="button"
                      onClick={() => removeMember(member.id)}
                      disabled={busy || Boolean(removingId)}
                      aria-busy={removingId === member.id}
                      aria-label={
                        removingId === member.id ? `Removing ${member.name}` : `Remove ${member.name}`
                      }
                      className={`rounded-md p-1.5 hover:bg-[#FEF3F2] hover:text-[#CC1016] disabled:cursor-not-allowed ${
                        removingId === member.id
                          ? 'bg-[#FEF3F2] text-[#CC1016] disabled:cursor-wait'
                          : 'text-[#98A2B3] disabled:opacity-60'
                      }`}
                    >
                      {removingId === member.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <UserMinus className="h-4 w-4" />
                      )}
                    </button>
                  ) : null}
                </li>
              );
            })}
          </ul>

          {isGroup && onLeave ? (
            <button
              type="button"
              onClick={onLeave}
              className="mt-5 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-[#FDA29B] px-4 py-2.5 text-[13px] font-semibold text-[#CC1016] hover:bg-[#FEF3F2]"
            >
              <LogOut className="h-4 w-4" />
              Leave group
            </button>
          ) : null}
        </div>
      </div>

      <AddMembersModal
        open={adding}
        groupName={conversation.name}
        memberIds={memberIds}
        recipients={recipients}
        recipientsLoading={recipientsLoading}
        onSearchRecipients={onSearchRecipients}
        onAdd={onAddMembers}
        onClose={() => setAdding(false)}
        busy={busy}
      />
    </div>
  );
};

const ConversationInfoModal = ({ open, conversation, ...props }) =>
  open && conversation ? (
    <ConversationInfo key={conversation.id} conversation={conversation} {...props} />
  ) : null;

export default ConversationInfoModal;
