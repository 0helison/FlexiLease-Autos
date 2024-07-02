export default {
  jwt: {
    secret: process.env.JWT_SECRET || 'Secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '12h',
  },
};
