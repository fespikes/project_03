FROM 172.16.1.99/frontend/tdc-ui/build/ci-base:latest

ARG NG_CLI_VERSION=1.5.0
ARG USER_HOME_DIR="/tmp"
ARG APP_DIR="/usr/src/app"
ARG NPM_REGISTRY="http://172.16.1.161:30033/repository/npm-group/"

# 在用户目录拉node依赖会出现权限报错
ENV HOME "$USER_HOME_DIR"

# ENV NPM_CONFIG_LOGLEVEL warn

COPY ./package.json "/$APP_DIR/package.json"

# npm 5 uses different userid when installing packages, as workaround su to node when installing
# see https://github.com/npm/npm/issues/16766
RUN set -xe \
    && npm config set registry $NPM_REGISTRY \
    && (cd "/$USER_HOME_DIR"; npm install -g @angular/cli@$NG_CLI_VERSION;) \
    && (cd "/$APP_DIR"; yarn; yarn add node-sass) \
    && (yarn cache clean; npm cache clean --force)

WORKDIR $APP_DIR
