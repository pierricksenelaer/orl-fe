type User = {
  id: string;
  name: string;
  password: string;
  email: string;
  role?: string;
  isAdmin: boolean;
  skills?: any;
  avatar?: Buffer;
  company?: string;
  createdAt: Date;
  updatedAt: Date;
};
