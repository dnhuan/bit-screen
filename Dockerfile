FROM zenika/alpine-chrome:with-node

USER chrome
WORKDIR /usr/src/app
COPY package.json .
COPY .yarnrc.yml .
USER root
RUN yarn install --ignore-engines
USER chrome
COPY . .
EXPOSE 3001

ENTRYPOINT ["sh","/usr/src/app/entrypoint.sh"]

