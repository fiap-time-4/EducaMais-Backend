export interface CreatePostData {
  titulo: string;
  conteudo: string;
  autor: string;
}

export interface UpdatePostData {
  titulo?: string;
  conteudo?: string;
  autor?: string;
}

export class PostValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PostValidationError';
  }
}

export const validateCreatePost = (data: CreatePostData): void => {
  // Validar título obrigatório
  if (!data.titulo || data.titulo.trim().length === 0) {
    throw new PostValidationError('Título é obrigatório');
  }

  // Validar conteúdo com mínimo de caracteres
  if (!data.conteudo || data.conteudo.trim().length < 10) {
    throw new PostValidationError('Conteúdo deve ter pelo menos 10 caracteres');
  }

  // Validar autor válido (string obrigatória)
  if (!data.autor || data.autor.trim().length === 0) {
    throw new PostValidationError('Autor é obrigatório');
  }

  // Validar tamanhos máximos
  if (data.titulo.trim().length > 200) {
    throw new PostValidationError('Título deve ter no máximo 200 caracteres');
  }

  if (data.conteudo.trim().length > 5000) {
    throw new PostValidationError('Conteúdo deve ter no máximo 5000 caracteres');
  }

  if (data.autor.trim().length > 100) {
    throw new PostValidationError('Nome do autor deve ter no máximo 100 caracteres');
  }
};

export const validateUpdatePost = (data: UpdatePostData): void => {
  // Se título for fornecido, deve ser válido
  if (data.titulo !== undefined) {
    if (!data.titulo || data.titulo.trim().length === 0) {
      throw new PostValidationError('Título não pode ser vazio');
    }
    if (data.titulo.trim().length > 200) {
      throw new PostValidationError('Título deve ter no máximo 200 caracteres');
    }
  }

  // Se conteúdo for fornecido, deve ser válido
  if (data.conteudo !== undefined) {
    if (!data.conteudo || data.conteudo.trim().length < 10) {
      throw new PostValidationError('Conteúdo deve ter pelo menos 10 caracteres');
    }
    if (data.conteudo.trim().length > 5000) {
      throw new PostValidationError('Conteúdo deve ter no máximo 5000 caracteres');
    }
  }

  // Se autor for fornecido, deve ser válido
  if (data.autor !== undefined) {
    if (!data.autor || data.autor.trim().length === 0) {
      throw new PostValidationError('Autor não pode ser vazio');
    }
    if (data.autor.trim().length > 100) {
      throw new PostValidationError('Nome do autor deve ter no máximo 100 caracteres');
    }
  }
};