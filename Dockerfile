FROM FROM 675356752005.dkr.ecr.eu-west-1.amazonaws.com/suomen-vaylat-build:nginx-1.19.9-alpine

ARG BASE_PATH

RUN rm /etc/nginx/conf.d/default.conf
COPY ./nginx-conf/suomen-vaylat.conf /etc/nginx/conf.d/
COPY ./nginx-conf/nginx.conf /etc/nginx/
COPY ./build /www$BASE_PATH
