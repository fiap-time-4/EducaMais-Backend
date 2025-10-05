# --- ESTÁGIO 1: Builder ---
# Instala dependências e compila o código
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json yarn.lock ./
COPY prisma ./prisma/
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn prisma generate
RUN yarn build

# --- ESTÁGIO 2: Production ---
# Cria a imagem final, otimizada para produção
FROM node:20-alpine
WORKDIR /app
COPY package.json yarn.lock ./
# Instala APENAS as dependências de produção
RUN yarn install --production --frozen-lockfile
# Copia os arquivos compilados do estágio 'builder'
COPY --from=builder /app/dist ./dist
# Copia o schema do Prisma e o script de espera
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/wait-for.sh ./
RUN chmod +x wait-for.sh
EXPOSE 3333
# Comando de produção: espera, roda migration de deploy e inicia com node
CMD ["./wait-for.sh", "db:5432", "--", "sh", "-c", "npx prisma migrate deploy && node dist/server.js"]