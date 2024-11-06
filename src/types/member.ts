
export interface User {
  _id: string;
  avatar?: string;
  fullName: string;
  email: string;
  emailVerified: boolean;
  googleId?: string;
}