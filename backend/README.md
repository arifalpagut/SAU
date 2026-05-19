# ERP HR Backend

## Kurulum

```bash
npm install
cp .env.example .env
npm run dev
```

## Veritabani
PostgreSQL veritabani olustur:
- DB_NAME=erp_hr
- DB_USER=postgres
- DB_PASSWORD=postgres

## Seed Calistirma
```bash
node src/seed.js
```

## Varsayilan Kullanicilar
| E-posta             | Parola        | Rol         |
|---------------------|---------------|-------------|
| admin@erp.local     | Admin123!     | ADMIN       |
| hr@erp.local        | Hr123456!     | HR_MANAGER  |
| employee@erp.local  | Employee123!  | EMPLOYEE    |

## API Health Check
```
GET http://localhost:5000/health
```
