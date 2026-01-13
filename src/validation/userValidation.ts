export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  appRole?: 'ADMIN' | 'TEACHER' | 'STUDENT';
  role?: "user" | "admin";

}

export interface UpdateUserData {
  name?: string;
  email?: string;
  password?: string;
  appRole?: 'ADMIN' | 'TEACHER' | 'STUDENT';
  role?: "user" | "admin";

}

export class UserValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UserValidationError';
  }
}

export const validateCreateUser = (data: CreateUserData): void => {
  if (!data.name || data.name.trim().length === 0) {
    throw new UserValidationError('Nome é obrigatório');
  }
  if (data.name.trim().length > 100) {
    throw new UserValidationError('Nome deve ter no máximo 100 caracteres');
  }

  if (!data.email || data.email.trim().length === 0) {
    throw new UserValidationError('Email é obrigatório');
  }
  if (!data.password || data.password.trim().length === 0) {
    throw new UserValidationError('Senha é obrigatório');
  }
  if (data.password.trim().length < 6) {
    throw new UserValidationError('Senha deve ter no mínimo 5 caracteres');
  }

};

export const validateUpdateUser = (data: UpdateUserData): void => {
  if (data.name !== undefined) {
    if (!data.name || data.name.trim().length === 0) {
      throw new UserValidationError('Nome não pode ser vazio');
    }
    if (data.name.trim().length > 100) {
      throw new UserValidationError('Nome deve ter no máximo 100 caracteres');
    }
  }

  if (data.password !== undefined) {
    if (!data.password || data.password.trim().length < 6) {
      throw new UserValidationError('Senha deve ter pelo menos 5 caracteres');
    }
  }
};