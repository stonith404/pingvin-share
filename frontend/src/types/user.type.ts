export default interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  isAdmin: boolean;
}

export interface CurrentUser extends User {}
