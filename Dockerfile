# Use Zenika's Alpine Chrome image
FROM zenika/alpine-chrome:latest

USER root
RUN apk add --no-cache nodejs npm
RUN npm install -g yarn vercel
USER chrome

WORKDIR /usr/src/app
COPY package.json .
COPY .yarnrc.yml .
RUN yarn install --ignore-engines

COPY . .

EXPOSE 3000
EXPOSE 9222

ENTRYPOINT ["sh","/usr/src/app/entrypoint.sh"]

