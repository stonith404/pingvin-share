export default interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
}

export interface CurrentUser extends User {}
