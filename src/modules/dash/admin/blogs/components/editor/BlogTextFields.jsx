import { BLOG_CATEGORY_OPTIONS } from "@/features/dash/admin/blogs";
import { FormLabel, Input, Select, Textarea } from "@/components/form-controls";

/** Headline, category, excerpt and body. `setField(key)` returns a value setter. */
const BlogTextFields = ({ fields, setField, disabled }) => (
  <>
    <div>
      <FormLabel variant="editor" htmlFor="blog-headline">
        Headline
      </FormLabel>
      <Input
        variant="editor"
        id="blog-headline"
        type="text"
        value={fields.title}
        onChange={(event) => setField("title")(event.target.value)}
        placeholder="Write title"
        required
        disabled={disabled}
      />
    </div>

    <div>
      <FormLabel variant="editor" htmlFor="blog-category">
        Category
      </FormLabel>
      <Select
        variant="editor"
        id="blog-category"
        value={fields.category}
        onChange={(event) => setField("category")(event.target.value)}
        required
        disabled={disabled}
      >
        {BLOG_CATEGORY_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </Select>
    </div>

    <div>
      <FormLabel variant="editor" htmlFor="blog-description">
        Excerpt
      </FormLabel>
      <Textarea
        variant="editor"
        id="blog-description"
        value={fields.excerpt}
        onChange={(event) => setField("excerpt")(event.target.value)}
        placeholder="Short summary shown on cards"
        rows={3}
        className="resize-none"
        required
        disabled={disabled}
      />
    </div>

    <div>
      <FormLabel variant="editor" htmlFor="blog-body">
        Body
      </FormLabel>
      <Textarea
        variant="editor"
        id="blog-body"
        value={fields.body}
        onChange={(event) => setField("body")(event.target.value)}
        placeholder="Full article content"
        rows={8}
        className="resize-y"
        required
        disabled={disabled}
      />
    </div>
  </>
);

export default BlogTextFields;
