FROM zenika/alpine-chrome:with-node

USER root
WORKDIR /usr/src/app
COPY package.json .
COPY .yarnrc.yml .
RUN yarn install --ignore-engines
RUN mkdir -p node_modules/.cache && chmod -R 777 node_modules/.cache
COPY . .
EXPOSE 3001

ENTRYPOINT ["sh","/usr/src/app/entrypoint.sh"]

