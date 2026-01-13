import { Request, Response, NextFunction } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../util/auth";

export async function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session || !session.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    req.user = {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      role: session.user.appRole,
    };
    req.session = session as any;

    next();
  } catch (err) {
    console.error("auth middleware error:", err);
    return res.status(500).json({ error: "Internal auth error" });
  }
}

export async function ensureAuthenticatedAsAdminOrTeacher(req: Request, res: Response, next: NextFunction) {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session || !session.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    if (session.user.appRole !== "ADMIN" && session.user.appRole !== "TEACHER") {
      return res.status(403).json({ error: "Forbidden" });
    }

    req.user = {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      role: session.user.appRole,
      
    };
    req.session = session as any;

    next();
  } catch (err) {
    console.error("auth middleware error:", err);
    return res.status(500).json({ error: "Internal auth error" });
  }
}

export async function ensureAuthenticatedAsAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session || !session.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    if (session.user.appRole !== "ADMIN") {
      return res.status(403).json({ error: "Forbidden" });
    }

    req.user = {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      role: session.user.appRole,
    };
    req.session = session as any;

    next();
  } catch (err) {
    console.error("auth middleware error:", err);
    return res.status(500).json({ error: "Internal auth error" });
  }
}