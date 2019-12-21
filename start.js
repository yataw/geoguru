const { execSync  } = require('child_process');

const defaultBackendPort = 9000;
const defaultEnv = {
    PORT: defaultBackendPort,
    REACT_DEV_PORT: 5000,
    NODE_ENV: 'development',
    REACT_APP_DEV_BACKEND_PORT: defaultBackendPort
};
for (let [key, value] of Object.entries(defaultEnv))
    process.env[key] = process.env[key] || value;


const isProduction = process.env.NODE_ENV === 'production';
const command = isProduction ? 'npm run start:prod' : 'npm run start:dev';

execSync(command, {stdio: 'inherit'});
