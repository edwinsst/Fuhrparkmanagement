# Stage 1: Build the Angular application
FROM node:20 as builder

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .

RUN npm run build --prod
RUN ls -al /app/dist


# Stage 2: Create the runtime image
FROM nginx

WORKDIR /usr/share/nginx/html

# Copy the built Angular app from the builder stage
COPY --from=builder /app/dist/app .

EXPOSE 80

# Command to start Nginx
CMD ["nginx", "-g", "daemon off;"]
