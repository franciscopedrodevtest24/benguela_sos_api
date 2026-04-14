import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import *as schemas  from "./schemas"

const db = drizzle(process.env.DATABASE_URL!,{
    schema:schemas
});

export {db}