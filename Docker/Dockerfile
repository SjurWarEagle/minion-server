FROM node:15.2.1-stretch
RUN mkdir -p /project/

RUN apt update
RUN apt upgrade -y
RUN apt install apt-utils -y
RUN apt install xvfb x11-xserver-utils -y
RUN Xvfb :99 -screen 0 640x480x8 -nolisten tcp &
ENV DISPLAY :99

RUN git clone https://github.com/SjurWarEagle/minion-server
WORKDIR /minion-server
RUN npm install
RUN npm run build
ENTRYPOINT ["npm", "run", "start"]
