import {mergeAttributes, Node} from "@tiptap/core";
import {Extension} from "@tiptap/react";

import '@tiptap/core';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    image: {
      setImage: (options: { src: string; alt?: string; title?: string }) => ReturnType,
    },
    fontSize: {
      setFontSize: (fontSize: string) => ReturnType,
    },
  }
}

export const imageCommand = Node.create({
  name: 'image',
  group: 'block',
  selectable: true,
  draggable: true,
  addAttributes() {
    return {
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      title: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'img[src]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['img', mergeAttributes(HTMLAttributes)];
  },

  addCommands() {
    return {
      setImage: (options: { src: string; alt?: string; title?: string }) => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: options,
        });
      },
    };
  },
});

export const attachmentCommand = Node.create({
  name: 'attachment',
  group: 'block',
  selectable: true,
  draggable: true,
  addAttributes() {
    return {
      src: {
        default: null,
      },
      fileName: {
        default: null,
      },
      fileSize: {
        default: null,
      },
    };
  },
  parseHTML() {
    return [
      {
        tag: 'div[data-type="attachment"]',
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ['div', { 'data-type': 'attachment' }, ['span', HTMLAttributes.fileName]];
  },
});

export const fontSizeCommand = Extension.create({
  name: 'fontSize',
  addOptions() {
    return {
      types: ['textStyle'],
    };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: element => element.style.fontSize.replace(/['"]+/g, ''),
            renderHTML: attributes => {
              if (!attributes.fontSize) {
                return {};
              }
              return {
                style: `font-size: ${attributes.fontSize}`,
            };
            },
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setFontSize: (fontSize: string) => ({ chain }) => {
        return chain()
          .setMark('textStyle', { fontSize: fontSize + "px" })
          .run();
      },
    };
  },
});