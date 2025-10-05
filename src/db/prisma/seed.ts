import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando o processo de seeding...');

  // 1. Dados do usuário padrão
  const userEmail = 'professor@exemplo.com';
  const plainPassword = '123456';

  // 2. Criptografar a senha
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

  // 3. Criar ou atualizar o usuário
  // Usamos `upsert` para evitar erros se o usuário já existir.
  // Ele cria se não existir, ou atualiza se já existir. É idempotente.
  const user = await prisma.user.upsert({
    where: { email: userEmail },
    update: {}, // Não faz nada se o usuário já existir
    create: {
      email: userEmail,
      name: 'Professor Padrão',
      password: hashedPassword
    },
  });

  console.log(`Usuário padrão criado/confirmado: ${user.email}`);
  console.log('Seeding concluído com sucesso!');
}

// Executa a função principal e garante que a conexão com o banco seja fechada
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });