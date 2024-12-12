# Use linux/arm/v7 Alpine Chrome image
FROM ghcr.io/dnhuan/alpine-chrome:with-node

USER chrome
RUN yarn add vercel

WORKDIR /usr/src/app
COPY package.json .
COPY .yarnrc.yml .
RUN yarn install --ignore-engines

COPY . .

EXPOSE 3001

ENTRYPOINT ["sh","/usr/src/app/entrypoint.sh"]

