# FROM archlinux:latest
# RUN pacman -Syy
# COPY . /app
# ENTRYPOINT ["node", "/app/build/server.js"]
# CMD ["node", "/app/build/server.js"]

FROM node:latest
WORKDIR /app
COPY package*.json ./
RUN npm i
EXPOSE 8888
COPY . .
RUN npm run build
RUN npx prisma db push
CMD [ "npm", "start" ]
