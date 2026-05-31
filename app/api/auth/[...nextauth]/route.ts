import { handlers } from "@/lib/auth";

// Auth.js usa bcrypt/Prisma — força o runtime Node (não Edge).
export const runtime = "nodejs";

export const { GET, POST } = handlers;
