import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const config = {
    connection_string: 'postgresql://neondb_owner:npg_zDO4MSK1ZBGv@ep-hidden-snow-a8uhssbd-pooler.eastus2.azure.neon.tech/neondb?sslmode=require&channel_binding=require',
    port: 5000,
}

export default config;