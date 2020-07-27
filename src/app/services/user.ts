export interface Roles {
  subscriber?: boolean;
  admin?: boolean;
}

export interface User {
    uid: string;
    email: string;
    photoURL?: string;
    displayName?: string;
    emailVerified: boolean;
    roles: Roles;
  }