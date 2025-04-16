FROM node:lts-slim
WORKDIR /app
COPY . .
RUN yarn install --production --frozen-lockfile
RUN yarn run build
RUN yarn run seed
EXPOSE 4000
CMD [ "yarn", "run", "start" ]
