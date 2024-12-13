# Usar imagen oficial de Node.js
FROM node:20-alpine

# Crear directorio de trabajo
WORKDIR /app

# Copiar archivos del proyecto
COPY package*.json ./
COPY tsconfig*.json ./
COPY src ./src

# Instalar dependencias
RUN npm install

# Compilar TypeScript
RUN npm run build

# Exponer el puerto
EXPOSE 3001

# Comando de inicio
CMD ["npm", "run", "start:prod"]
