import { PrismaClient } from '@prisma/client'


let db;

if (!global._prisma) {
    global._prisma = new PrismaClient();
}

db = global._prisma;

export default db;
