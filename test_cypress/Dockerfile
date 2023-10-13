FROM cypress/factory


WORKDIR /tests
COPY . .

RUN npm install --save-dev
RUN ./node_modules/.bin/cypress install
CMD ["npm", "run", "cy:parallel"]