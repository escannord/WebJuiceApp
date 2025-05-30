export interface User {
  id: string;
  email: string;
  name: string;
  roles?: string[];
  rememberMe?: boolean;
  lastLogin?: Date;
}