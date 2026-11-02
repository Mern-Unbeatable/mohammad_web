import FormattedMessage from "@/components/data-display/Messenger/FormattedMessage";

/** Read-only view of text written in `RichTextArea` (bold, italic, lists, links…). */
const RichText = ({ text, className = "" }) =>
  text ? (
    <div className={`space-y-2 [overflow-wrap:anywhere] ${className}`}>
      <FormattedMessage text={text} tone="plain" paragraphs />
    </div>
  ) : null;

export default RichText;
