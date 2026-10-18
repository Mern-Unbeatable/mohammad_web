import { parseMessage } from "@/features/messages/messageFormat";

const TONES = {
  me: {
    code: "bg-white/20 text-white",
    link: "text-white underline decoration-white/70 hover:decoration-white",
  },
  them: {
    code: "bg-white/80 text-[#0F172A]",
    link: "text-primary underline decoration-primary/40 hover:decoration-primary",
  },
  plain: {
    code: "bg-[#F2F4F7] text-[#0F172A]",
    link: "text-primary underline decoration-primary/40 hover:decoration-primary",
  },
};

const renderInline = (nodes, tone) =>
  nodes.map((node, index) => {
    if (typeof node === "string") return node;
    switch (node.type) {
      case "code":
        return (
          <code
            key={index}
            className={`rounded px-1 py-0.5 font-mono text-[12px] ${tone.code}`}
          >
            {node.text}
          </code>
        );
      case "bold":
        return (
          <strong key={index} className="font-semibold">
            {renderInline(node.children, tone)}
          </strong>
        );
      case "italic":
        return <em key={index}>{renderInline(node.children, tone)}</em>;
      case "strike":
        return <s key={index}>{renderInline(node.children, tone)}</s>;
      case "link":
        return (
          <a
            key={index}
            href={node.href}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className={`underline-offset-2 [overflow-wrap:anywhere] ${tone.link}`}
          >
            {node.text}
          </a>
        );
      default:
        return null;
    }
  });

/** Chat message text with lightweight formatting (see `messageFormat.js`). */
const FormattedMessage = ({ text, tone = "them" }) => {
  const palette = TONES[tone] || TONES.them;
  return parseMessage(text).map((block, index) => {
    if (block.type === "ul") {
      return (
        <ul key={index} className="list-disc space-y-0.5 pl-5">
          {block.items.map((item, itemIndex) => (
            <li key={itemIndex} className="whitespace-pre-wrap pl-0.5">
              {renderInline(item, palette)}
            </li>
          ))}
        </ul>
      );
    }
    if (block.type === "ol") {
      return (
        <ol key={index} className="space-y-0.5">
          {block.items.map((item, itemIndex) => (
            <li key={itemIndex} className="flex gap-1.5">
              <span className="min-w-[1.25rem] shrink-0 tabular-nums opacity-80">
                {block.markers[itemIndex]}
              </span>
              <span className="min-w-0 flex-1 whitespace-pre-wrap">
                {renderInline(item, palette)}
              </span>
            </li>
          ))}
        </ol>
      );
    }
    return (
      <p key={index} className="whitespace-pre-wrap">
        {block.items.map((line, lineIndex) => (
          <span key={lineIndex}>
            {lineIndex > 0 ? "\n" : null}
            {renderInline(line, palette)}
          </span>
        ))}
      </p>
    );
  });
};

export default FormattedMessage;
