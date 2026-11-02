const PostBody = ({ paragraphs }) => (
  <div className="space-y-4">
    {paragraphs.map((paragraph, index) => (
      <p
        key={`${index}-${paragraph.slice(0, 24)}`}
        className="text-[14px] leading-[1.75] text-[#475467]"
      >
        {paragraph}
      </p>
    ))}
  </div>
);

export default PostBody;
