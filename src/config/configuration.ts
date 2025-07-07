// src/config/configuration.ts
export default () => ({
  port: parseInt(process.env.PORT??'3000', 10),
  jwt: {
    secret: process.env.JWT_SECRET,
    accessSecret: process.env.JWT_ACCESS_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    accessTokenExpirationTime:
      process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME || '1h',
    refreshTokenExpirationTime:
      process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME || '7d',
  },
});
