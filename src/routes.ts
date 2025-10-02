import { Router, Request, Response } from "express";
import { PostRoutes } from "./routes/postRoutes";
import { UserRoutes } from "./routes/userRoutes";

const routes = Router();

routes.get('/health', (req: Request, res: Response) => {
  const message = `Health Check OK, Backend is running on port ${process.env.PORT}!`;

  return res.json({ message });
});


routes.use('/posts', PostRoutes());
routes.use('/users', UserRoutes());

export default routes;