export interface UserForm {
  email: string;
  password: string;
  name?: string;
  last_name?: string;
}

export interface UserLog {
  dataValues: {
    id: number;
    name: string;
    last_name: string;
    password: string;
    email: string;
    created_at: string;
    updated_at: string;
    google?: boolean;
  };
  token: string;
}
