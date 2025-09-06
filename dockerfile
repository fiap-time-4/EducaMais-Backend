FROM node:20

RUN apt-get update && apt-get install -y netcat-openbsd

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN chmod +x wait-for.sh

EXPOSE 3333
EXPOSE 5555

RUN npx prisma migrate deploy
CMD ["./wait-for.sh", "db:5432", "--", "npm", "run", "start"]