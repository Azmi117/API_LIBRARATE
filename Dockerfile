# Gunakan image Node.js sebagai base image
FROM node:20.18.0

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

# Tentukan perintah untuk menjalankan aplikasi
CMD ["node", "app.js"]
