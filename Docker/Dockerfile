FROM node:12.16.1-stretch
RUN mkdir -p /project/

RUN git clone https://github.com/SjurWarEagle/minion-server
WORKDIR /minion-server
RUN npm install
RUN npm run build
