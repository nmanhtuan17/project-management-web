import { ProjectMember } from "@/types/project";

export enum EmailLabel {
  INBOX = 'inbox',
  SENT = 'sent',
  IMPORTANT = 'important',
  DRAFTS = 'drafts',
  TRASH = 'trash'
}

export const MessageStreams = {
  inbox: 'inbounds',
  sent: 'outbounds'
}

export enum EmailAddressType {
  PERSONAL = 'personal',
  GROUP = 'group',
}

export enum EmailSendingType {
  SEND = 'sent',
  REPLY = 'reply',
  REPLY_ALL = 'replyAll',
  FORWARD = 'forward',
}

export interface EmailAttachment {
  url: string;
  cid: string;
  contentType: string;
  expiration: string;
  name: string;
  size: number;
}

export enum EmailStatus {
  DELIVERED = 'Delivered',
  OPENED = 'Opened',
  PROCESSED = 'Processed'
}


export interface Email {
  _id: string;
  MessageStream: string;
  MessageID: string;
  From: string;
  FromFull: {
    Email: string,
    Name: string,
    MailboxHash: string
  }[]
  To: string | string[];
  ToFull: {
    Email: string,
    Name: string,
    MailboxHash: string
  }[]
  OriginalRecipient: string;
  Recipients?: string[]
  Cc?: string[];
  CcFull?: {
    Email: string,
    Name: string,
    MailboxHash: string
  }[]
  Bcc?: string[];
  BccFull?: {
    Email: string,
    Name: string,
    MailboxHash: string
  }[]
  Subject: string;
  HtmlBody: string;
  TextBody: string;
  Headers: string[];
  StrippedTextReply?: string;
  ReplyTo?: string;
  Date: Date;
  ReceivedAt?: string;
  Status: EmailStatus;
  Attachments: EmailAttachment[];
}

export interface EmailQueries {
  address: string,
  labels: string[],
  page?: number,
  limit?: number,
  sortBy?: string,
  sortType?: 'asc' | 'desc'
}

export interface EmailAddress {
  _id: string;
  alias: string;
  domain: string;
  member: string;
  createdAt: string;
  updatedAt: string;
}