### Base builder
FROM AWS_ACCOUNT_ID.dkr.ecr.eu-west-1.amazonaws.com/suomen-vaylat-build:node-12-buster AS builder

COPY ./suomen-vaylat-app /suomen-vaylat

ARG CODEARTIFACT_AUTH_TOKEN
ENV CODEARTIFACT_AUTH_TOKEN=$CODEARTIFACT_AUTH_TOKEN
COPY ./npmrc /suomen-vaylat/.npmrc

### Local builder
FROM builder AS local-builder

ARG BASE_PATH

ENV PUBLIC_URL=/$BASE_PATH
ENV REACT_APP_PUBLISHED_MAP_URL=https://localhost:8443/sv-kartta/?uuid=0a13438a-4432-46bd-bab9-bf50b1d3fa08
ENV REACT_APP_PUBLISHED_MAP_DOMAIN=https://localhost:8443
ENV REACT_APP_PROXY_URL=https://localhost:8443/sv-kartta/
ENV REACT_APP_SITE_URL=https://localhost:8443/$BASE_PATH
ENV REACT_APP_ROUTER_PREFIX=/$BASE_PATH/

# Don't use codeartifact in local build
RUN rm /suomen-vaylat/.npmrc

RUN cd /suomen-vaylat && \
    npm ci && \
    npm run build

### Dev builder
FROM builder AS dev-builder

ARG BASE_PATH

ENV MAP_DOMAIN=https://d442co92ufwmq.cloudfront.net

ENV PUBLIC_URL=/$BASE_PATH
ENV REACT_APP_PUBLISHED_MAP_URL=${MAP_DOMAIN}/sv-kartta/?uuid=8b65cd2c-9f8c-474d-93db-56788131d3e2
ENV REACT_APP_PUBLISHED_MAP_DOMAIN=${MAP_DOMAIN}
ENV REACT_APP_PROXY_URL=${MAP_DOMAIN}/sv-kartta/
ENV REACT_APP_SITE_URL=https://paikkatietodev.testivaylapilvi.fi/$BASE_PATH
ENV REACT_APP_ROUTER_PREFIX=/$BASE_PATH/

RUN cd /suomen-vaylat && \
    npm ci && \
    npm run build

### Test builder
FROM builder AS test-builder

ARG BASE_PATH

ENV MAP_DOMAIN=https://d2d9dqqs66cm6.cloudfront.net

ENV PUBLIC_URL=/$BASE_PATH
ENV REACT_APP_PUBLISHED_MAP_URL=${MAP_DOMAIN}/sv-kartta/?uuid=32ec5134-3dae-403f-903b-57d035a16b6c
ENV REACT_APP_PUBLISHED_MAP_DOMAIN=${MAP_DOMAIN}
ENV REACT_APP_PROXY_URL=${MAP_DOMAIN}/sv-kartta/
ENV REACT_APP_SITE_URL=https://paikkatietotest.testivaylapilvi.fi/$BASE_PATH
ENV REACT_APP_ROUTER_PREFIX=/$BASE_PATH/

RUN cd /suomen-vaylat && \
    npm ci && \
    npm run build

### Production builder
FROM builder AS production-builder

ARG BASE_PATH

ENV MAP_DOMAIN=https://d1tpvkd70x5pxu.cloudfront.net

ENV PUBLIC_URL=/$BASE_PATH
ENV REACT_APP_PUBLISHED_MAP_URL=${MAP_DOMAIN}/sv-kartta/?uuid=e7dbca99-68bd-4392-8d1d-c2e5098edbe7
ENV REACT_APP_PUBLISHED_MAP_DOMAIN=${MAP_DOMAIN}
ENV REACT_APP_PROXY_URL=${MAP_DOMAIN}/sv-kartta/
ENV REACT_APP_SITE_URL=https://paikkatieto.vaylapilvi.fi/$BASE_PATH
ENV REACT_APP_ROUTER_PREFIX=/$BASE_PATH/

RUN cd /suomen-vaylat && \
    npm ci && \
    npm run build

### Base image
FROM AWS_ACCOUNT_ID.dkr.ecr.eu-west-1.amazonaws.com/suomen-vaylat-build:sv-base-image AS base

# Envs are used in Nginx template substitution at container startup
ARG BASE_PATH
ENV BASE_PATH=$BASE_PATH

RUN rm /etc/nginx/conf.d/default.conf
COPY ./nginx-conf/suomen-vaylat.conf /etc/nginx/templates/suomen-vaylat.conf.template
COPY ./nginx-conf/nginx.conf /etc/nginx/

### Local image
FROM base AS local

ARG BASE_PATH

COPY --from=local-builder /suomen-vaylat/build /www/$BASE_PATH

### Dev image
FROM base AS dev

ARG BASE_PATH

COPY --from=dev-builder /suomen-vaylat/build /www/$BASE_PATH

### Test image
FROM base AS test

ARG BASE_PATH

COPY --from=test-builder /suomen-vaylat/build /www/$BASE_PATH

### Production image
FROM base AS production

ARG BASE_PATH

COPY --from=production-builder /suomen-vaylat/build /www/$BASE_PATH
