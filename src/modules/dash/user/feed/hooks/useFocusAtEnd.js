import { useEffect, useRef } from "react";

/** Ref for a text field that is focused on mount with the caret after its text. */
export function useFocusAtEnd() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.focus();
    el.setSelectionRange(el.value.length, el.value.length);
  }, []);

  return ref;
}
