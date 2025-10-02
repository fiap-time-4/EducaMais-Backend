import express from 'express'
import routes from './routes'
import cors from 'cors'

const app = express()

app.use(cors({
  origin: "*"
}));
app.use(express.json());
app.use(routes);

const PORT = process.env.PORT || 3333;

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});