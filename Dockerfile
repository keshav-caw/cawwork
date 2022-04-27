# Add the Node.js Docker image.
FROM node:14
# Create a directory that runs the app on Docker.
WORKDIR /app
# Add a COPY command to copy the project files to the Docker /app directory.
# COPY package.json and package-lock.json files
COPY package.json ./

COPY prismix.config.json ./

# generated prisma files
COPY apps/fhynix-core-apis/src/app/common/DataStore/prisma/ ./prisma/

# COPY ENV variable
COPY .env ./

# COPY tsconfig.json file
COPY ./apps/fhynix-core-apis/tsconfig.json ./

RUN apt-get -qy update && apt-get -qy install openssl

# Install package.json dependencies.
RUN npm install

# COPY
COPY . .

# Generate Prisma client.
RUN npx prisma generate --schema="./apps/fhynix-core-apis/src/app/common/DataStore/prisma/schema.prisma"
# Run and expose the server on Docker.
# Run and expose the server on port 3000
EXPOSE 3000
# 276422486208.dkr.ecr.ap-south-1.amazonaws.com/fhynix-api

# A command to start the server
CMD npm start