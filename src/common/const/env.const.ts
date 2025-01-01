const port = 'PORT';

const databaseUrl = 'DATABASE_URL';
const databaseType = 'DATABASE_TYPE';
const databaseUser = 'DATABASE_USER';
const databasePassword = 'DATABASE_PASSWORD';
const databaseHost = 'DATABASE_HOST';
const databasePort = 'DATABASE_PORT';
const databaseDatabaseName = 'DATABASE_DATABASE_NAME';

const sentryDsn = 'SENTRY_DSN';

const saltOrRounds = 'SALT_OR_ROUNDS';
const jwtSecret = 'JWT_SECRET';

const mailTransportHost = 'MAIL_TRANSPORT_HOST';
const mailTransportAuthUser = 'MAIL_TRANSPORT_AUTH_USER';
const mailTransportAuthPass = 'MAIL_TRANSPORT_AUTH_PASS';
const mailDefaultsFrom = 'MAIL_DEFAULTS_FROM';
const mailTemplateDir = 'MAIL_TEMPLATE_DIR';

export const envKey = {
  port,

  databaseUrl,
  databaseType,
  databaseUser,
  databasePassword,
  databaseHost,
  databasePort,
  databaseDatabaseName,

  sentryDsn,

  saltOrRounds,
  jwtSecret,

  mailTransportHost,
  mailTransportAuthUser,
  mailTransportAuthPass,
  mailDefaultsFrom,
  mailTemplateDir,
};
