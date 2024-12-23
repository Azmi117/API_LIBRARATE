# Gunakan image Node.js sebagai base image
FROM node:20.18.0

# Install PostgreSQL client (psql)
RUN apt-get update && apt-get install -y postgresql-client

# Tentukan password untuk psql
ENV PGPASSWORD=azmi123

# Tentukan working directory di dalam container
WORKDIR /app

# Salin package.json dan package-lock.json ke dalam container
COPY package*.json ./

# Instal dependencies
RUN npm install

# Salin semua kode aplikasi ke dalam container
COPY . .

# Expose port yang digunakan oleh aplikasi
EXPOSE 8080

# Menjalankan setup dan aplikasi di lingkungan pengembangan
CMD ["sh", "-c", "npm run setup && npm start"]
