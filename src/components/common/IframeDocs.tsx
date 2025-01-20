import { useEffect, useRef } from "react";
// import { EmailAttachment } from "@/types/mailing.ts";
import { useAppSelector } from "@/redux/store.ts";
import { ThemeMode } from "@/enums";

interface IframeProps {
  content: string;
  // attachments: EmailAttachment[];
}

export default function IframeDocs(props: IframeProps) {
  const { content } = props;
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { theme } = useAppSelector(state => state.app);

  useEffect(() => {
    if (iframeRef.current) {
      const iframeDocument = iframeRef.current.contentWindow?.document;
      if (iframeDocument) {
        const iframeBody = iframeDocument.body;
        iframeBody.classList.add(theme === ThemeMode.LIGHT ? "light-theme" : "dark-theme");
      }
    }
  }, [theme]);

  return (
    <iframe
      ref={iframeRef}
      srcDoc={
        `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter&family=Lexend+Deca:wght@300;400;500;600;700;900&display=swap">
          <style>
            body {padding: 0; margin: 0; font-family: "Lexend Deca", sans-serif; font-size: 12px;}
            p, h1, h2, h3, h4, h5 {
              margin-block: 4px;
            }
            ul, ol{
              padding-left: 24px;
              margin: 0;
            }
            li {
              padding-block: 2px;
            }
            ::-webkit-scrollbar {
              width: 5px;
              height: 5px;
            }
            ::-webkit-scrollbar-track {
              border-radius: 10px;
            }               
            ::-webkit-scrollbar-thumb {
              background-color: rgba(229, 231, 232, 0.80);
              border-radius: 10px;
            }
            .light-theme * {
              color: #000 !important;
            }
            .dark-theme * {
              color: #fff !important;
            }
          </style>`
        + (content || '')
      }
      style={{ display: 'block', width: '100%', border: "none", height: '100%' }}
      // onLoad={() => {
      //   if (iframeRef.current) {
      //     const iframeDocument = iframeRef.current.contentWindow?.document;
      //     if (iframeDocument) {
      //       const images = iframeDocument.querySelectorAll('img');
      //       for (let img of images) {
      //         if (img.src.startsWith('cid:')) {
      //           const imageCid = img.src.split(':').pop();
      //           const attachment = props.attachments.find(a => a.cid === imageCid);
      //           if (attachment) {
      //             img.src = attachment.url;
      //           }
      //         }
      //       }
      //     }
      //   }
      // }}
    />
  )
}
