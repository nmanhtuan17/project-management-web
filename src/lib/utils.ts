import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import {Md5} from "ts-md5";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getGravatar = (email: string) => {
  if (!email) return '';
  return `https://gravatar.com/avatar/${Md5.hashStr(email)}`;
}
