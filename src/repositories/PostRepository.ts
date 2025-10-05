import { Prisma } from "@prisma/client";
import prisma from "../util/prisma";
import { CreatePostData, UpdatePostData } from "../validation/postValidation";

export class PostRepository {
  static async create(data: {
    titulo: string;
    conteudo: string;
    authorId: number;
  }) {
    return prisma.post.create({ data });
  }

  static async findAll(skip: number, take: number) {
    return prisma.post.findMany({
      skip,
      take,
      orderBy: { createdAt: "desc" },
      include: {
        author: { select: { id: true, name: true, email: true } },
      },
    });
  }

  static async countAll() {
    return prisma.post.count();
  }

  static async search(
    where: Prisma.PostWhereInput,
    skip: number,
    take: number
  ) {
    return prisma.post.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: "desc" },
      include: {
        author: { select: { id: true, name: true, email: true } },
      },
    });
  }

  static async countSearch(where: Prisma.PostWhereInput) {
    return prisma.post.count({ where });
  }

  static async findById(id: number) {
    return prisma.post.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, name: true, email: true } },
      },
    });
  }

  static async update(id: number, data: UpdatePostData) {
    return prisma.post.update({
      where: { id },
      data,
    });
  }

  static async delete(id: number) {
    return prisma.post.delete({
      where: { id },
    });
  }
}
