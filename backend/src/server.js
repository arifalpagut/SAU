require('dotenv').config();

const app = require('./app');
const { sequelize } = require('./models');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await sequelize.authenticate();
    logger.info('PostgreSQL bağlantısı başarılı');

    if (process.env.DB_SYNC === 'true') {
      await sequelize.sync({ alter: false });
      logger.info('Veritabanı senkronizasyonu tamamlandı');
    }

    app.listen(PORT, () => {
      logger.info(`Sunucu çalışıyor: http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error({ err: error }, 'Sunucu başlatılamadı');
    process.exit(1);
  }
}

startServer();
