// Define a classe de erro personalizada para ser usada no controller
export class PostValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PostValidationError";
  }
}

// Define o tipo de dados para a criação de post (sem o campo 'autor')
export interface CreatePostData {
  titulo: string;
  conteudo: string;
}

// Define o tipo de dados para a atualização de post (sem o campo 'autor')
export interface UpdatePostData {
  titulo?: string;
  conteudo?: string;
}

// Função que valida os dados para criar um post
export function validateCreatePost(data: CreatePostData) {
  if (!data.titulo || data.titulo.trim() === "") {
    throw new PostValidationError("O título é obrigatório.");
  }
  if (!data.conteudo || data.conteudo.trim() === "") {
    throw new PostValidationError("O conteúdo é obrigatório.");
  }
  if (data.conteudo.trim().length < 10) {
    throw new PostValidationError(
      "O conteúdo deve ter no mínimo 10 caracteres."
    );
  }
  // A validação para 'autor' foi removida.
}

// Função que valida os dados para atualizar um post
export function validateUpdatePost(data: UpdatePostData) {
  if (data.titulo !== undefined && data.titulo.trim() === "") {
    throw new PostValidationError("O título não pode ser vazio.");
  }
  if (data.conteudo !== undefined && data.conteudo.trim() === "") {
    throw new PostValidationError("O conteúdo não pode ser vazio.");
  }
  // A validação para 'autor' foi removida.
}
