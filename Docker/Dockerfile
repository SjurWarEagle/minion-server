FROM node:15.3.0-stretch
RUN mkdir -p /project/

RUN apt update
RUN apt upgrade -y
ADD files/fonts.conf /etc/fonts/fonts.conf

RUN git clone https://github.com/SjurWarEagle/minion-server
WORKDIR /project/minion-server
RUN npm install
RUN npm run build
ENTRYPOINT ["npm", "run", "start"]
