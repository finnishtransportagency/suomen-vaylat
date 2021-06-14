FROM 675356752005.dkr.ecr.eu-west-1.amazonaws.com/suomen-vaylat-build:node-12-buster as builder

ARG REACT_APP_PUBLISHED_MAP_URL
ARG REACT_APP_PUBLISHED_MAP_DOMAIN
ARG PUBLIC_URL

COPY ./suomen-vaylat-app /suomen-vaylat
RUN cd /suomen-vaylat && \
    npm ci && \
    npm run build

FROM 675356752005.dkr.ecr.eu-west-1.amazonaws.com/suomen-vaylat-build:nginx-1.19.9-alpine

ARG BASE_PATH

RUN rm /etc/nginx/conf.d/default.conf
COPY ./nginx-conf/suomen-vaylat.conf /etc/nginx/conf.d/
COPY ./nginx-conf/nginx.conf /etc/nginx/
COPY --from=builder /suomen-vaylat/build /www/$BASE_PATH
