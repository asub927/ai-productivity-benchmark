# Stage 1: Build the application
FROM node:20-alpine as build

WORKDIR /app

# Accept build argument for backend API URL
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN echo "Building with VITE_API_URL=$VITE_API_URL"

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
