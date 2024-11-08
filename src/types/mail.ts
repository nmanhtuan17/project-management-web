import {ProjectMember} from "@/types/project";

export enum EmailLabel {
  INBOX = 'inbox',
  SENT = 'sent',
  IMPORTANT = 'important',
  DRAFTS = 'drafts',
  TRASH = 'trash'
}

export enum EmailType {
  OUTGOING = 'outgoing',
  INCOMING = 'incoming'
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

export interface Email {
  _id: string;
  labels?: string[];
  type: EmailType;
  messageId: string;
  from: string;
  to: string;
  sender: string;
  recipient: string;
  cc: string[];
  bcc: string[];
  subject: string;
  body: string;
  headers: string[];
  strippedText: string;
  replyTo?: string;
  seen?: boolean;
  dkimSignature?: string;
  contentType?: string;
  raw: any;
  claimed?: boolean;
  member?: ProjectMember | string;
  read?: boolean;
  createdAt: Date;
  attachments: EmailAttachment[];
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