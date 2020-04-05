FROM node:12.16.1-stretch
RUN mkdir -p /project/

COPY Docker/aws-credentials $HOME/.aws/
COPY * /project/
#COPY *.yaml /project/
#COPY .serverless /project/
COPY src /project

WORKDIR /project/
RUN rm -rf node_modules
RUN npm install
#RUN npm run "serverless:deploy:clear"
RUN npm run "serverless:deploy:debug"
