// me
export interface Admin {
  _id: string;
  firstName: string;
  lastName: string;
  img?: string;
  email: string;
  password: string;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

// notifications

export interface Notification {
  _id: string;
  title: string;
  message: string;
  link: string;
  img?: string;
  createdAt: string;
  updatedAt: string;
  users: Admin["_id"][];
}
