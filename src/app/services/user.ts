export interface Roles {
  customer?: boolean;
  admin?: boolean;
}

export interface User {
    uid: string;
    email: string;
    displayName?: string;
    emailVerified: boolean;
    roles: Roles;
  }