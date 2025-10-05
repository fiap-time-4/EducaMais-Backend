import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Podemos criar uma interface personalizada para estender o tipo Request do Express
// e informar ao TypeScript que nossas requisições autenticadas terão uma propriedade `user`.
interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    // ... iat e exp são adicionados pelo jwt
  };
}

export const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  // 1. Obter o token do cabeçalho de autorização
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "Acesso negado. Nenhum token fornecido.",
    });
  }

  // 2. Verificar se o token está no formato "Bearer <token>"
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({
      success: false,
      message:
        'Token em formato inválido. O formato esperado é "Bearer <token>".',
    });
  }
  const token = parts[1];

  // 3. Validar o token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

    // 4. Anexar os dados do usuário (payload do token) ao objeto de requisição
    req.user = decoded as AuthenticatedRequest["user"];

    // 5. Chamar a próxima função na cadeia (o controller)
    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Token inválido ou expirado.",
    });
  }
};
