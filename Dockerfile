FROM node:20-alpine AS builder
RUN apk add git
WORKDIR /usr/src/app
COPY . ./
RUN yarn install
RUN npm run build

FROM nginx:alpine
COPY build/default.conf /etc/nginx/conf.d/default.conf
COPY build/start-nginx.sh /usr/bin/start-nginx.sh
COPY --from=builder /usr/src/app/dist/spa /usr/share/nginx/html
RUN chmod +x /usr/bin/start-nginx.sh

COPY ./env.sh /usr/share/nginx/html
COPY .env /usr/share/nginx/html
RUN apk add --no-cache bash
RUN chmod +x /usr/share/nginx/html/env.sh

WORKDIR /usr/share/nginx/html
ENTRYPOINT ["/bin/bash", "-c", "start-nginx.sh" ]
