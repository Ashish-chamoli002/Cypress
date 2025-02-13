FROM cypress/base:12.19.0
RUN mkdir /app
WORKDIR /app
COPY . /app
RUN npm install
RUN $(npm bin)/cypress verify
RUN ["npm", "run", "cypress:run"]
RUN ["npm", "run", "mochawesome"]
RUN ["npm", "run", "junit:merge"]
