import express from 'express'
import routes from './routes'
import cors from 'cors'

import { toNodeHandler } from "better-auth/node";
import { auth } from "./util/auth";

const app = express()
export { app }; // Exporta a instância do app para os testes

app.use(cors({
  origin: [process.env.FRONTEND_ORIGIN || "*", "http://localhost:3000"],
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Set-Cookie']
}));

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());
app.use(routes);

const PORT = process.env.PORT || 3333;

// O servidor só "escuta" a porta se não estiver no ambiente de teste
if (process.env.NODE_ENV !== 'test') {
  // Usa a variável PORT, garantindo que use 3333 se process.env.PORT não estiver definido
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}