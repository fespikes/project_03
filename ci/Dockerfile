FROM 172.16.1.99/frontend/tdc-ui/build/ci-base-8.11:latest

ARG NG_CLI_VERSION=7.0.6
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
  && chmod a+rw $USER_HOME_DIR \
  && chown -R node /usr/local/lib /usr/local/include /usr/local/share /usr/local/bin /usr/src/app \
  && (su node -c "chmod +w /usr/src/app; chmod +wx /usr/local/bin/yarn;") \
  && (su node -c "npm config set registry $NPM_REGISTRY") \
  && (cd "/$USER_HOME_DIR"; su node -c "npm install -g @angular/cli@$NG_CLI_VERSION;") \
  && (cd "/$APP_DIR"; su node -c "yarn; yarn add node-sass;") \
  && (su node -c "yarn cache clean; npm cache clean --force") \
  && (cd "/$APP_DIR"; su node -c "npm install")

WORKDIR $APP_DIR
