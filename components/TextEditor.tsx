import StarterKit from '@tiptap/starter-kit'
import TipTapsLinks from '@tiptap/extension-link'
import { useEditor, EditorContent, EditorContentProps, JSONContent } from '@tiptap/react'

export type TextEditorProps = Omit<EditorContentProps, "editor"> & {
  onChange?: (jsonContent: JSONContent) => void
  initialContent: JSONContent,
}

export default function TextEditor({ readOnly = false, onChange, initialContent, ...props }: TextEditorProps) {
  const editor = useEditor({
    content: initialContent,
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON())
    },
    extensions: [StarterKit, TipTapsLinks],
    editorProps: {
      editable: () => !readOnly,
      attributes: {
        class: 'prose px-2 py-4 rounded w-full max-w-none prose:max-w-none textarea textarea-bordered max-h-64 overflow-y-auto',
      }
    }
  })

  return (
    // @ts-ignore
    <EditorContent {...props} editor={editor} />
  )
}
