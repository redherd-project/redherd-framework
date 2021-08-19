FROM node:latest

RUN apt update && \
    apt install lsof -y

# WeTTY installation
RUN yarn global add wetty@2.0.2

# App directory creation
RUN mkdir -p /home/node/{app,share} && chown -R node:node /home/node/{app,share}
WORKDIR /home/node/app
COPY . /home/node/app
RUN npm install
#COPY package-lock.json package.json /home/node/app/
#RUN npm --global config set user root && \
#    npm --global install express

# Additional binaries installation
RUN mv ./etc/* /usr/bin/ && \
    rm -rf ./etc
#COPY /etc/* /usr/bin/

# SSH configuration
RUN echo "    StrictHostKeyChecking no" >> /etc/ssh/ssh_config && \
    echo "    ConnectTimeout 5" >> /etc/ssh/ssh_config && \
    echo "    LogLevel ERROR" >> /etc/ssh/ssh_config && \
    echo "    UserKnownHostsFile=/dev/null" >> /etc/ssh/ssh_config && \
    sed -i 's/HashKnownHosts\ yes/HashKnownHosts\ no/g' /etc/ssh/ssh_config 

EXPOSE 3000/tcp
EXPOSE 3001/tcp

CMD [ "node", "app.js" ]
