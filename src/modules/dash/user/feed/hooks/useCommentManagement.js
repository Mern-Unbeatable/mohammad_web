import { useState } from "react";

/**
 * Edit and delete state for the viewer's own comments. Edit/delete are only
 * offered when the matching callback is provided.
 */
export function useCommentManagement({ onEditComment, onDeleteComment, onEditStart, onDeleted }) {
  const [editingId, setEditingId] = useState(null);
  const [editSaving, setEditSaving] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const startEdit = (comment) => {
    onEditStart?.();
    setEditingId(comment.id);
  };

  const cancelEdit = () => setEditingId(null);

  const saveEdit = async (comment, text) => {
    if (editSaving) return;
    if (text === comment.content.trim()) {
      setEditingId(null);
      return;
    }
    setEditSaving(true);
    try {
      const ok = await onEditComment(comment.id, text);
      if (ok !== false) setEditingId(null);
    } finally {
      setEditSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete || deleting) return;
    const target = pendingDelete;
    setDeleting(true);
    try {
      const ok = await onDeleteComment(target.id);
      if (ok === false) return;
      setPendingDelete(null);
      if (editingId === target.id) setEditingId(null);
      onDeleted?.(target.id);
    } finally {
      setDeleting(false);
    }
  };

  const closeDelete = () => {
    if (!deleting) setPendingDelete(null);
  };

  return {
    manage: {
      editingId,
      editSaving,
      onStartEdit: startEdit,
      onCancelEdit: cancelEdit,
      onSaveEdit: onEditComment ? saveEdit : undefined,
      onRequestDelete: onDeleteComment ? setPendingDelete : undefined,
    },
    deletion: {
      comment: pendingDelete,
      deleting,
      confirm: confirmDelete,
      close: closeDelete,
    },
  };
}
