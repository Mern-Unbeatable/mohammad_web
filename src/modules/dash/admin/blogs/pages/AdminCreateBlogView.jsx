import Card from "@/components/ui/Card";
import PanelPage from "@/components/navigation/panel/PanelPage";
import PanelPageHeader from "@/components/navigation/panel/PanelPageHeader";
import BlogTextFields from "../components/editor/BlogTextFields";
import CoverImageField from "../components/editor/CoverImageField";
import PublishOptions from "../components/editor/PublishOptions";
import EditorActions from "../components/editor/EditorActions";
import { useBlogEditor } from "../hooks/useBlogEditor";
import { submitLabel } from "../utils/blogForm";

const AdminCreateBlogView = () => {
  const editor = useBlogEditor();
  const { fields, busy } = editor;

  return (
    <PanelPage>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-[#98A2B3]">Blogs</p>

      <PanelPageHeader
        title={editor.isEdit ? "Edit Blog Post" : "Create New Blog Post"}
        subtitle="Fill in the details to publish or save as draft."
      />

      <Card className="p-4 sm:p-5">
        <form className="space-y-4" onSubmit={editor.submit}>
          <BlogTextFields fields={fields} setField={editor.setField} disabled={busy} />

          <CoverImageField
            fileInputRef={editor.fileInputRef}
            preview={editor.imagePreview}
            hasFile={Boolean(editor.imageFile)}
            imageUrl={editor.imageUrl}
            disabled={busy}
            onPick={editor.pickImage}
            onClear={editor.clearImage}
            onUrlChange={editor.changeImageUrl}
          />

          <PublishOptions
            readTime={fields.readTime}
            onReadTimeChange={editor.setField("readTime")}
            publish={fields.publish}
            onPublishChange={editor.setField("publish")}
            disabled={busy}
          />

          <EditorActions
            busy={busy}
            label={submitLabel({
              uploading: editor.uploading,
              saving: editor.saving,
              isEdit: editor.isEdit,
              publish: fields.publish,
            })}
          />
        </form>
      </Card>
    </PanelPage>
  );
};

export default AdminCreateBlogView;
