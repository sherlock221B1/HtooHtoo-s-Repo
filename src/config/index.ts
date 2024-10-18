interface Config {
  googleClientId: string;
  googleClientSecret: string;
  orderAppUrl: string;
  vercelBlobToken: string;
  testEnvVar: string;
}

export const config: Config = {
  googleClientId: process.env.GOOGLE_CLIENT_ID || "",
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
  orderAppUrl: process.env.NEXT_PUBLIC_ORDER_APP_URL || "",
  vercelBlobToken: process.env.BLOB_READ_WRITE_TOKEN || "",
  testEnvVar: process.env.TEST_ENV_VAR || "",
};
