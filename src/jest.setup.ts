// jest.setup.ts
import { PrismaClient } from '@prisma/client'
import { mockDeep, mockReset } from 'jest-mock-extended'

// Mocka o módulo do nosso cliente Prisma customizado
jest.mock('./util/prisma', () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),
}))


// Garante que o mock seja limpo antes de cada teste
beforeEach(() => {
  mockReset(prisma)
})

// Exporta o prisma mockado para que possamos usá-lo nos nossos testes
export const prisma = jest.requireMock('./util/prisma').default