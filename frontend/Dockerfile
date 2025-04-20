FROM node:lts-slim
RUN useradd -ms /bin/sh -u 1001 app
USER app
WORKDIR /app
COPY . .
RUN yarn install --frozen-lockfile
COPY --chown=app:app . /app
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}
RUN yarn run build
EXPOSE 4173
CMD [ "yarn", "run", "preview" ]
