FROM node:16

WORKDIR app/

# Copy dependencies
COPY package*.json /app/

RUN npm install # Install dependencies

# Copy all source code to the working directory
COPY . /app/

# Build the Vue app for production
RUN npm run build

EXPOSE 8080

CMD ["npm", "run", "serve"]