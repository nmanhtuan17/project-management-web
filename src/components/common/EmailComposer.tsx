import { EditorContent, BubbleMenu } from '@tiptap/react';
import { Button } from "@/components/ui/button.tsx";
import {
  AlignCenterIcon,
  AlignLeftIcon, AlignRightIcon,
  BoldIcon, EllipsisVerticalIcon,
  ImageIcon, IndentDecreaseIcon, IndentIncreaseIcon,
  ItalicIcon, ListOrdered,
  RedoIcon, Trash2Icon,
  UnderlineIcon,
  UndoIcon
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select.tsx";
import { FontSizeIcon, Link1Icon, ListBulletIcon } from "@radix-ui/react-icons";
import { PaperClipIcon } from "@heroicons/react/16/solid";
import { cn } from "@/lib/utils.ts";
import { useState } from "react";
import useEditor from "@/lib/hooks/useEditor.tsx";
import { useAppSelector } from '@/redux/store';
import apiService from '@/services/api.service';
import { toast } from 'sonner';
import { EmailInput } from './EmailInput';

interface Props {
  replyTo?: string;
}

export function EmailComposer({ replyTo }: Props) {
  const [align, setAlign] = useState<string>("left");
  const [to, setTo] = useState<string>(replyTo ?? '')
  const [subject, setSubject] = useState<string>('')
  const { user } = useAppSelector(state => state.auth)

  const [
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
    }
  ] = useEditor({ placeholder: "Enter content..." });


  const sendMail = async () => {
    if (!user || !to || !subject) return;

    const res = await apiService.sendMail({
      From: user.internalEmail,
      To: to,
      Subject: subject,
      HtmlBody: editor.getHTML(),
      TextBody: editor.getText()
    })
    if (res.message === 'OK') {
      toast.success('Sent')
    }
  }

  if (!editor) {
    return null
  }

  return <div className={'w-full flex-1 flex flex-col justify-end p-2 divide-y'}>
    <div className={'flex flex-row gap-2 mb-2 items-center'}>
      <div className={'text-muted-foreground text-sm'}>
        To
      </div>
      <EmailInput onChange={(emails) => setTo(emails.join(', '))} />
    </div>
    <div className={'flex flex-row gap-2 pt-2'}>
      <input
        className={'flex-1 outline-none text-sm bg-transparent pb-2 !placeholder:text-muted-foreground'}
        placeholder={'Subject...'}
        onChange={(e) => setSubject(e.target.value)}
      />
    </div>
    <div className={'flex-1 pt-2 overflow-y-auto relative'}>
      <BubbleMenu editor={editor}>
        <div className={'flex flex-row'}>
          <div className={'flex flex-row divide-x'}>
            <Button
              className={cn('p-0 w-6 h-6 rounded-r-none hover:bg-primary', editor?.isActive('bold') ? 'text-blue-500 dark:text-blue-700' : '')}
              onClick={toggleBold}
            >
              <BoldIcon className={'w-3 h-3'} />
            </Button>
            <Button
              onClick={toggleItalic}
              className={cn('p-0 w-6 h-6 rounded-none hover:bg-primary', editor?.isActive('italic') ? 'text-blue-500 dark:text-blue-700' : '')}
            >
              <ItalicIcon className={'w-3 h-3'} />
            </Button>
            <Button
              onClick={toggleUnderline}
              className={cn('p-0 w-6 h-6 rounded-none hover:bg-primary', editor?.isActive('underline') ? 'text-blue-500 dark:text-blue-700' : '')}
            >
              <UnderlineIcon className={'w-3 h-3'} />
            </Button>
            <Button
              onClick={toggleOrderedList}
              className={cn('p-0 w-6 h-6 rounded-none hover:bg-primary', editor?.isActive('orderedList') ? 'text-blue-500 dark:text-blue-700' : '')}
            >
              <ListOrdered className={'w-4 h-4'} />
            </Button>
            <Button
              onClick={toggleBulletList}
              className={cn('p-0 w-6 h-6 rounded-none hover:bg-primary', editor?.isActive('bulletList') ? 'text-blue-500 dark:text-blue-700' : '')}
            >
              <ListBulletIcon className={'w-4 h-4'} />
            </Button>
            <Button
              onClick={toggleLink}
              className={cn('p-0 w-6 h-6 rounded-l-none hover:bg-primary', editor?.isActive('orderedList') ? 'text-blue-500 dark:text-blue-700' : '')}
            >
              <Link1Icon className={'w-4 h-4'} />
            </Button>
          </div>
        </div>
      </BubbleMenu>
      <EditorContent editor={editor} />
      <div className="sticky top-10 flex flex-col gap-2 my-2">
        {attachments.map((attachment, index) => {
          return (
            <div key={index} className="group bg-accent rounded-md p-2 cursor-pointer flex justify-between ">
              <span className="text-[14px] ">Test upload</span>
              <div className="flex text-muted-foreground items-center gap-2"><span className="text-[14px]">120KB</span>
                <Trash2Icon
                  className={'w-4 h-4 transition-all ease-in-out duration-200 overflow-hidden hidden group-hover:block'} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
    <div className={'flex flex-row divide-x'}>
      <div className={'flex flex-row pr-2'}>
        <Button
          onClick={undo}
          className={'w-6 h-6 p-0'} variant={'ghost'}>
          <UndoIcon className={'w-3 h-3'} />
        </Button>
        <Button
          onClick={redo}
          className={'w-6 h-6 p-0'} variant={'ghost'}>
          <RedoIcon className={'w-3 h-3'} />
        </Button>
      </div>
      <div className={'pl-2 pr-1'}>
        <Select
          defaultValue="12"
          onValueChange={(selected) => {
            console.log("selected", selected)
            editor.commands.setFontSize(selected);
          }}
        >
          <SelectTrigger className={'p-0 h-6 border-none shadow-none focus:ring-offset-0 focus:ring-0'}>
            <FontSizeIcon className={'w-3 h-3'} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">
              <p
                className={cn('text-xs')}
              >
                Small
              </p>
            </SelectItem>
            <SelectItem value="12">
              <p
                className={cn('text-sm')}
              >
                Normal
              </p>
            </SelectItem>
            <SelectItem value="16">
              <p
                className={cn('text-base')}>
                Large
              </p>
            </SelectItem>
            <SelectItem value="18">
              <p
                className={cn('text-xl')}>
                Huge
              </p>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className={'flex flex-row px-1'}>
        <Button
          className={cn('w-6 h-6 p-0', editor?.isActive('bold') ? 'text-blue-700 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-500' : '')}
          onClick={toggleBold}
          variant={'ghost'}>
          <BoldIcon className={'w-3 h-3'} />
        </Button>
        <Button
          onClick={toggleItalic}
          className={cn('w-6 h-6 p-0', editor?.isActive('italic') ? 'text-blue-700 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-500' : '')}
          variant={'ghost'}>
          <ItalicIcon className={'w-3 h-3'} />
        </Button>
        <Button
          onClick={toggleUnderline}
          className={cn('w-6 h-6 p-0', editor?.isActive('underline') ? 'text-blue-700 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-500' : '')}
          variant={'ghost'}>
          <UnderlineIcon className={'w-3 h-3'} />
        </Button>
      </div>
      <div className={'pl-1 flex flex-row flex-1'}>
        <div>
          <Select
            value={align}
            onValueChange={(selected) => {
              setTextAlign(selected);
              setAlign(selected);
            }}
          >
            <SelectTrigger className={'p-0 h-6 border-none shadow-none focus:ring-offset-0 focus:ring-0'}>
              {align === "left" ? <AlignLeftIcon className={'w-3 h-3'} /> : align === "right" ?
                <AlignRightIcon className={'w-3 h-3'} /> : <AlignCenterIcon className={'w-3 h-3'} />}
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='left' className='cursor-pointer'>
                <div className={'flex flex-row items-center gap-2'}>
                  <AlignLeftIcon className={'w-3 h-3'} /> Align left
                </div>
              </SelectItem>
              <SelectItem value='center' className='cursor-pointer'>
                <div className={'flex flex-row items-center gap-2'}>
                  <AlignCenterIcon className={'w-3 h-3'} /> Align center
                </div>
              </SelectItem><SelectItem value='right' className='cursor-pointer'>
                <div className={'flex flex-row items-center gap-2'}>
                  <AlignRightIcon className={'w-3 h-3'} /> Align right
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          className={cn('w-6 h-6 p-0', editor?.isActive('orderedList') ? 'text-blue-700 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-500' : '')}
          onClick={toggleOrderedList}
          variant={'ghost'}>
          <ListOrdered className={'w-4 h-4'} />
        </Button>
        <Button
          className={cn('w-6 h-6 p-0', editor?.isActive('bulletList') ? 'text-blue-700 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-500' : '')}
          onClick={toggleBulletList}
          variant={'ghost'}>
          <ListBulletIcon className={'w-4 h-4'} />
        </Button>
      </div>
    </div>
    <div className={'pt-2 flex flex-row'}>
      <Button
        disabled={!to || !subject}
        onClick={sendMail}
        className={'rounded-full h-7 px-4 py-0 shadow-none'}>
        <span>Send</span>
      </Button>
      <div className={'flex flex-row ml-2 gap-1'}>
        <Button onClick={uploadAttachments} className={'w-6 h-6 p-0'} variant={'ghost'}>
          <PaperClipIcon className={'w-4 h-4'} />
        </Button>
        <Button
          onClick={toggleLink}
          className={cn('w-6 h-6 p-0', editor.isActive('link') ? 'text-blue-700 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-500' : '')}
          variant={'ghost'}>
          <Link1Icon className={'w-4 h-4'} />
        </Button>
        <Button onClick={uploadImage} className={'w-6 h-6 p-0'} variant={'ghost'}>
          <ImageIcon className={'w-4 h-4'} />
        </Button>
      </div>
    </div>
  </div>
}