import { FormLabel, Input } from "@/components/form-controls";

/** Read time and the "Publish immediately" checkbox. */
const PublishOptions = ({ readTime, onReadTimeChange, publish, onPublishChange, disabled }) => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
    <div>
      <FormLabel variant="editor" htmlFor="blog-read-time">
        Read time
      </FormLabel>
      <Input
        variant="editor"
        id="blog-read-time"
        type="text"
        value={readTime}
        onChange={(event) => onReadTimeChange(event.target.value)}
        placeholder="5 min read"
        disabled={disabled}
      />
    </div>
    <label className="mt-7 flex items-center gap-2 text-[14px] text-deep-blue">
      <input
        type="checkbox"
        checked={publish}
        onChange={(event) => onPublishChange(event.target.checked)}
        className="h-4 w-4 rounded border-[#D0D5DD] text-primary focus:ring-primary"
        disabled={disabled}
      />
      Publish immediately
    </label>
  </div>
);

export default PublishOptions;
