import express from 'express'
import routes from './routes'
import cors from 'cors'

const app = express()
export { app }; // Exporta a instância do app para os testes

app.use(cors({
  origin: "*"
}));
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