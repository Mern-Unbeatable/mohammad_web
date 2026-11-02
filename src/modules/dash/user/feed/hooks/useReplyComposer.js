import { useState } from "react";
import { VISIBLE_REPLIES } from "../constants";
import { findRootId } from "../utils/commentTree";
import { mentionFromName } from "../utils/mentions";

const CLOSED = { targetId: null, rootId: null, initialValue: "" };

/**
 * Inline reply state for a comment list. Replies always attach to the
 * top-level comment; replying to a reply pre-fills an @mention instead.
 * Also tracks which threads are expanded past `VISIBLE_REPLIES`.
 */
export function useReplyComposer(comments, onAddComment) {
  const [target, setTarget] = useState(CLOSED);
  const [submitting, setSubmitting] = useState(false);
  const [expandedRoots, setExpandedRoots] = useState(() => new Set());

  const expandThread = (rootId) =>
    setExpandedRoots((prev) => (prev.has(rootId) ? prev : new Set(prev).add(rootId)));

  const toggleThread = (rootId) =>
    setExpandedRoots((prev) => {
      const next = new Set(prev);
      if (next.has(rootId)) next.delete(rootId);
      else next.add(rootId);
      return next;
    });

  const cancel = () => setTarget(CLOSED);

  const toggle = (comment) => {
    if (target.targetId === comment.id) {
      cancel();
      return;
    }

    const rootId = findRootId(comments, comment.id);
    const isReply = rootId !== comment.id;
    setTarget({
      targetId: comment.id,
      rootId,
      initialValue: isReply ? `${mentionFromName(comment.author?.name)} ` : "",
    });

    if (isReply) {
      const root = comments.find((item) => item.id === rootId);
      const index = root?.replies?.findIndex((reply) => reply.id === comment.id) ?? -1;
      if (index >= VISIBLE_REPLIES) expandThread(rootId);
    }
  };

  const submit = async (text) => {
    const { rootId } = target;
    if (!text?.trim() || submitting || !rootId) return false;
    setSubmitting(true);
    try {
      const ok = await onAddComment(text, rootId);
      if (ok !== false) {
        const root = comments.find((item) => item.id === rootId);
        if ((root?.replies?.length ?? 0) + 1 > VISIBLE_REPLIES) expandThread(rootId);
        cancel();
      }
      return ok;
    } finally {
      setSubmitting(false);
    }
  };

  /** Closes the reply box when `commentId` (or its thread) is being removed. */
  const closeIfInvolves = (commentId) => {
    if (target.targetId === commentId || target.rootId === commentId) cancel();
  };

  return {
    targetId: target.targetId,
    initialValue: target.initialValue,
    submitting,
    expandedRoots,
    toggle,
    cancel,
    submit,
    toggleThread,
    closeIfInvolves,
  };
}
