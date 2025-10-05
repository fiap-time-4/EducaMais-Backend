import {
  validateCreatePost,
  validateUpdatePost,
  PostValidationError,
} from "../../src/validation/postValidation";

describe("validation/postValidation.ts", () => {
  describe("validateCreatePost", () => {
    it("passes with valid data (conteudo >= 10)", () => {
      expect(() =>
        validateCreatePost({
          titulo: "Ok",
          conteudo: "1234567890",
          autor: "Victor",
        })
      ).not.toThrow();
    });
    it("fails when titulo is empty", () => {
      expect(() =>
        validateCreatePost({ titulo: "  ", conteudo: "1234567890", autor: "b" })
      ).toThrow(PostValidationError);
    });
    it("fails when conteudo < 10", () => {
      expect(() =>
        validateCreatePost({ titulo: "t", conteudo: "short", autor: "b" })
      ).toThrow(PostValidationError);
    });
    it("fails when autor is empty", () => {
      expect(() =>
        validateCreatePost({
          titulo: "t",
          conteudo: "1234567890",
          autor: "   ",
        })
      ).toThrow(PostValidationError);
    });
  });

  describe("validateUpdatePost", () => {
    it("passes when provided fields are valid", () => {
      expect(() =>
        validateUpdatePost({
          titulo: "Novo",
          conteudo: "1234567890",
          autor: "Alguem",
        })
      ).not.toThrow();
    });
    it("passes when nothing provided", () => {
      expect(() => validateUpdatePost({})).not.toThrow();
    });
    it("fails when provided titulo is empty", () => {
      expect(() => validateUpdatePost({ titulo: "   " })).toThrow(
        PostValidationError
      );
    });
    it("fails when provided conteudo < 10", () => {
      expect(() => validateUpdatePost({ conteudo: "short" })).toThrow(
        PostValidationError
      );
    });
    it("fails when provided autor is empty", () => {
      expect(() => validateUpdatePost({ autor: "   " })).toThrow(
        PostValidationError
      );
    });
  });

  describe("boundaries", () => {
    it("create: título > 200", () => {
      const long = "a".repeat(201);
      expect(() =>
        validateCreatePost({ titulo: long, conteudo: "1234567890", autor: "a" })
      ).toThrow(PostValidationError);
    });
    it("create: conteudo > 5000", () => {
      const long = "a".repeat(5001);
      expect(() =>
        validateCreatePost({ titulo: "t", conteudo: long, autor: "a" })
      ).toThrow(PostValidationError);
    });
    it("create: autor > 100", () => {
      const long = "a".repeat(101);
      expect(() =>
        validateCreatePost({ titulo: "t", conteudo: "1234567890", autor: long })
      ).toThrow(PostValidationError);
    });

    it("update: título > 200", () => {
      expect(() => validateUpdatePost({ titulo: "a".repeat(201) })).toThrow(
        PostValidationError
      );
    });
    it("update: conteudo > 5000", () => {
      expect(() => validateUpdatePost({ conteudo: "a".repeat(5001) })).toThrow(
        PostValidationError
      );
    });
    it("update: autor > 100", () => {
      expect(() => validateUpdatePost({ autor: "a".repeat(101) })).toThrow(
        PostValidationError
      );
    });
  });
});
