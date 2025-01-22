import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Document from '@tiptap/extension-document';
import Text from '@tiptap/extension-text';
import TextAlign from '@tiptap/extension-text-align';
import { useEditor as useEditorTiptap } from '@tiptap/react';
import Link from '@tiptap/extension-link';
import { useCallback, useState } from "react";
import Placeholder from '@tiptap/extension-placeholder';
import { imageCommand, attachmentCommand, fontSizeCommand } from "@/lib/tiptap";
import TextStyle from '@tiptap/extension-text-style';

type UseEditor = {
  defaultValue?: string;
  placeholder?: string;
}
export default function useEditor({ defaultValue, placeholder }: UseEditor) {
  const [attachments, setAttachments] = useState<any[]>([]);

  const editor = useEditorTiptap({
    extensions: [
      Document,
      Text,
      Underline,
      TextStyle,
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Link.configure({
        openOnClick: true,
        autolink: true,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
        placeholder: placeholder || 'Write something...'
      }),
      attachmentCommand,
      imageCommand,
      fontSizeCommand
    ],
    content: defaultValue || "",
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none focus:ring-0 min-h-[200px] text-sm',
      },
    },
  });

  const toggleBold = () => {
    editor.chain().focus().toggleBold().run();
  };

  const toggleItalic = () => {
    editor.chain().focus().toggleItalic().run();
  };

  const toggleUnderline = () => {
    editor.chain().focus().toggleUnderline().run();
  };

  const toggleBulletList = () => {
    editor.chain().focus().toggleBulletList().run();
  };

  const toggleOrderedList = () => {
    editor.chain().focus().toggleOrderedList().run();
  };

  const setTextAlign = (align: string) => {
    editor.chain().focus().setTextAlign(align).run();
  };

  const toggleLink = useCallback(() => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);
    if (url === null) {
      return;
    }
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').toggleLink({ href: url }).run();
  }, [editor]);

  const undo = () => {
    editor.chain().focus().undo().run();
  };

  const redo = () => {
    editor.chain().focus().redo().run();
  };

  const uploadImage = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = reader.result as string;
          editor.chain().setImage({ src: base64 }).run();
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  }, [editor]);

  const uploadAttachments = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.doc,.docx,.txt,image/*';
    input.multiple = true;
    input.onchange = async () => {
      // const files = input.files;
      setAttachments(Array.from(input.files))
      // if (files) {
      //   const promises = Array.from(files).map(file =>
      //     new Promise<string>((resolve, reject) => {
      //       const reader = new FileReader();
      //       reader.onload = () => {
      //         resolve(reader.result as string);
      //       };
      //       reader.onerror = reject;
      //       reader.readAsDataURL(file);
      //     })
      //   );
      //   Promise.all(promises).then(base64Array => {
      //     const attachments = base64Array.map(src => ({ src }));
      //     setAttachments(attachments);
      //   }).catch(error => {
      //     console.error('Error reading file:', error);
      //   });
      // }
    };
    input.click();
  }, [editor]);

  return [
    { editor, attachments },
    {
      toggleBold,
      toggleItalic,
      toggleUnderline,
      toggleBulletList,
      toggleOrderedList,
      setTextAlign,
      toggleLink,
      undo,
      redo,
      uploadImage,
      uploadAttachments
    }] as const;
}