export interface UserData {
    name: string,
    cpf: string,
    phone?: string,
    password: string
}

export interface loginData {
    validator: string,
    password: string
}


export interface UserResponse {
  token:string
  user: {
    _id: string;
    name: string;
    cpf: string;
    phone?: string;
    role: "admin" | "user";
    createdAt?: string;
    updatedAt?: string;
  }
}