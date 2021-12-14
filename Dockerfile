#Image de base
FROM ubuntu

RUN apt-get update && apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_16.x | bash -
RUN apt-get update && apt-get install -y nodejs
RUN node -v

RUN apt-get install -y vim

RUN #apt-get update && apt-get install -y mysql-server

#Copie de la liste des dépendances
COPY package.json /app/package.json

#Installation / Compiliation des dépendances
RUN cd /app && npm install

#Copie du code applicatif
COPY . /app/

WORKDIR /app

ENV MYSQL_ROOT_PASSWORD=root

#CMD ["npm", "start"]
