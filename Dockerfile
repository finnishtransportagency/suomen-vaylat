### Base builder
FROM AWS_ACCOUNT_ID.dkr.ecr.eu-west-1.amazonaws.com/suomen-vaylat-build:node-12-buster AS builder

COPY ./suomen-vaylat-app /suomen-vaylat

ARG CODEARTIFACT_AUTH_TOKEN
ENV CODEARTIFACT_AUTH_TOKEN=$CODEARTIFACT_AUTH_TOKEN
COPY ./npmrc /suomen-vaylat/.npmrc

### Local builder
FROM builder AS local-builder

ARG PUBLIC_URL

ENV REACT_APP_PUBLISHED_MAP_URL=https://172.21.0.201/sv-kartta/?uuid=0a13438a-4432-46bd-bab9-bf50b1d3fa08
ENV REACT_APP_PUBLISHED_MAP_DOMAIN=https://172.21.0.201
ENV REACT_APP_PROXY_URL=https://172.21.0.201/sv-kartta/
ENV REACT_APP_SITE_URL=http://172.21.0.220/suomen-vaylat
ENV REACT_APP_ROUTER_PREFIX=/suomen-vaylat/

# Don't use codeartifact in local build
RUN rm /suomen-vaylat/.npmrc

RUN cd /suomen-vaylat && \
    npm ci && \
    npm run build

### Dev builder
FROM builder AS dev-builder

ARG PUBLIC_URL

ENV REACT_APP_PUBLISHED_MAP_URL=https://paikkatietodev.testivaylapilvi.fi/sv-kartta/?uuid=8b65cd2c-9f8c-474d-93db-56788131d3e2
ENV REACT_APP_PUBLISHED_MAP_DOMAIN=https://paikkatietodev.testivaylapilvi.fi
ENV REACT_APP_PROXY_URL=https://paikkatietodev.testivaylapilvi.fi/sv-kartta/
ENV REACT_APP_SITE_URL=https://paikkatietodev.testivaylapilvi.fi/suomen-vaylat
ENV REACT_APP_ROUTER_PREFIX=/suomen-vaylat/

RUN cd /suomen-vaylat && \
    npm ci && \
    npm run build

### Test builder
FROM builder AS test-builder

ARG PUBLIC_URL

ENV REACT_APP_PUBLISHED_MAP_URL=https://paikkatietotest.testivaylapilvi.fi/sv-kartta/?uuid=32ec5134-3dae-403f-903b-57d035a16b6c
ENV REACT_APP_PUBLISHED_MAP_DOMAIN=https://paikkatietotest.testivaylapilvi.fi
ENV REACT_APP_PROXY_URL=https://paikkatietotest.testivaylapilvi.fi/sv-kartta/
ENV REACT_APP_SITE_URL=https://paikkatietotest.testivaylapilvi.fi/suomen-vaylat
ENV REACT_APP_ROUTER_PREFIX=/suomen-vaylat/

RUN cd /suomen-vaylat && \
    npm ci && \
    npm run build

### Production builder
FROM builder AS production-builder

ARG PUBLIC_URL

ENV REACT_APP_PUBLISHED_MAP_URL=https://paikkatieto.vaylapilvi.fi/sv-kartta/?uuid=e7dbca99-68bd-4392-8d1d-c2e5098edbe7
ENV REACT_APP_PUBLISHED_MAP_DOMAIN=https://paikkatieto.vaylapilvi.fi
ENV REACT_APP_PROXY_URL=https://paikkatieto.vaylapilvi.fi/sv-kartta/
ENV REACT_APP_SITE_URL=https://paikkatieto.vaylapilvi.fi/suomen-vaylat
ENV REACT_APP_ROUTER_PREFIX=/suomen-vaylat/

RUN cd /suomen-vaylat && \
    npm ci && \
    npm run build

### Base image
FROM AWS_ACCOUNT_ID.dkr.ecr.eu-west-1.amazonaws.com/suomen-vaylat-build:nginx-1.19.9-alpine AS base

RUN rm /etc/nginx/conf.d/default.conf
COPY ./nginx-conf/suomen-vaylat.conf /etc/nginx/conf.d/
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

### Test image
FROM base AS production

ARG BASE_PATH

COPY --from=production-builder /suomen-vaylat/build /www/$BASE_PATH
