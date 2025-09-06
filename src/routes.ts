import { Router, Request, Response } from "express";

const routes = Router();

routes.get('/health', (req: Request, res: Response) => {
  const message = `Health Check OK, Backend is running on port ${process.env.PORT}!`;

  return res.json({ message });
});

export default routes;