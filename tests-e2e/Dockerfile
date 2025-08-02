FROM mcr.microsoft.com/playwright:v1.50.0-jammy

WORKDIR /tests

COPY package*.json ./

RUN npm ci

COPY . .

CMD ["npx", "playwright", "test"] 