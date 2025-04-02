# --- Build Stage ---
    FROM node:18 AS build-stage
    WORKDIR /app/my-frontend
    COPY ./package.json ./package-lock.json ./
    RUN npm install
    COPY ./ ./
    
    # Pass environment variable during build
    ARG VITE_API_URL
    ENV VITE_API_URL=$VITE_API_URL
    
    RUN npm run build
    
    # --- Serve Static Files with Nginx ---
    FROM nginx:alpine
    COPY --from=build-stage /app/my-frontend/dist /usr/share/nginx/html
    COPY nginx.conf /etc/nginx/conf.d/default.conf
    EXPOSE 80
    