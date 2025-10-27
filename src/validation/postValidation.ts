export interface CreatePostData {
  titulo: string;
  conteudo: string;
  autorId: string; 
}

export interface UpdatePostData {
  titulo?: string;
  conteudo?: string;
}

export class PostValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PostValidationError';
  }
}

export const validateCreatePost = (data: CreatePostData): void => {
  if (!data.titulo || data.titulo.trim().length === 0) {
    throw new PostValidationError('Título é obrigatório');
  }
  if (data.titulo.trim().length > 200) {
    throw new PostValidationError('Título deve ter no máximo 200 caracteres');
  }

  if (!data.conteudo || data.conteudo.trim().length < 10) {
    throw new PostValidationError('Conteúdo deve ter pelo menos 10 caracteres');
  }
  if (data.conteudo.trim().length > 5000) {
    throw new PostValidationError('Conteúdo deve ter no máximo 5000 caracteres');
  }

};

export const validateUpdatePost = (data: UpdatePostData): void => {
  if (data.titulo !== undefined) {
    if (!data.titulo || data.titulo.trim().length === 0) {
      throw new PostValidationError('Título não pode ser vazio');
    }
    if (data.titulo.trim().length > 200) {
      throw new PostValidationError('Título deve ter no máximo 200 caracteres');
    }
  }

  if (data.conteudo !== undefined) {
    if (!data.conteudo || data.conteudo.trim().length < 10) {
      throw new PostValidationError('Conteúdo deve ter pelo menos 10 caracteres');
    }
    if (data.conteudo.trim().length > 5000) {
      throw new PostValidationError('Conteúdo deve ter no máximo 5000 caracteres');
    }
  }
};