import postRoutes from './src/routes/postRoutes';
import { Router } from 'express';   

const router = Router();

// Use as rotas de posts
router.use(postRoutes);

export default router;