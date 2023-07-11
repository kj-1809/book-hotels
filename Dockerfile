FROM node:20-alpine3.17

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

ENV DATABASE_URL='mysql://ltczvzkapl9isqzm44kr:pscale_pw_Vly9mkKCZWsxuXK5cyymvGJZDbSSu0JlBxNt6HPOAz1@aws.connect.psdb.cloud/book-hotels-db?sslaccept=strict'

ENV NEXTAUTH_URL="http://localhost:3000"
ENV GOOGLE_CLIENT_ID = "699812604005-l4o16s0mhuvck12eqsl58qhhphfbh317.apps.googleusercontent.com"
ENV GOOGLE_CLIENT_SECRET = "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"
ENV NEXTAUTH_SECRET="aBQQ55lgx7W25eRQOWdIA0DbxiKWzIkGWcKAFQ3Id9AKLA9Ucpc9SbMLiFFvIOncLSkhR075ymZgeokMRa7bgg"
ENV UPLOADTHING_SECRET='sk_live_6423fb86ee85cb42f58d251a9758ec63515779d3eda2371acbd8ef0487b4bc3a'
ENV UPSTASH_REDIS_REST_URL="https://eu2-in-raptor-32654.upstash.io"
ENV UPSTASH_REDIS_REST_TOKEN="AX-OACQgM2EzMWQ4OTEtZDQwZC00YjIzLTkxNjUtNDA5MTI2N2U5YjVmNzU3N2U2MWQ0NTJkNGNmZTkyOGUyNTI0NWQxYWY4YmQ="

CMD [ "npm" , "run" , "dev" ]