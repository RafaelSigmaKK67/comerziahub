import type { UserRole } from "@prisma/client";

/** Rota inicial (home) de cada papel após o login. */
export const ROLE_HOME: Record<UserRole, string> = {
  ADMIN: "/admin",
  MODERATOR: "/admin/social",
  STORE_OWNER: "/dashboard",
  STORE_EMPLOYEE: "/dashboard",
  SELLER: "/dashboard",
  CUSTOMER: "/account",
  COURIER: "/courier",
};

/** Mapa de prefixos protegidos -> papéis autorizados. */
export const ROUTE_ACCESS: { prefix: string; roles: UserRole[] }[] = [
  { prefix: "/admin", roles: ["ADMIN", "MODERATOR"] },
  {
    prefix: "/dashboard",
    roles: ["STORE_OWNER", "STORE_EMPLOYEE", "SELLER", "ADMIN"],
  },
  { prefix: "/courier", roles: ["COURIER", "ADMIN"] },
  {
    prefix: "/account",
    roles: [
      "CUSTOMER",
      "STORE_OWNER",
      "STORE_EMPLOYEE",
      "SELLER",
      "COURIER",
      "MODERATOR",
      "ADMIN",
    ],
  },
];

export function matchRoute(path: string) {
  return ROUTE_ACCESS.find(
    (r) => path === r.prefix || path.startsWith(`${r.prefix}/`),
  );
}

export function canAccess(path: string, role?: UserRole | null) {
  const rule = matchRoute(path);
  if (!rule) return true; // rota pública
  if (!role) return false;
  return rule.roles.includes(role);
}

export function homeFor(role?: UserRole | null) {
  return role ? ROLE_HOME[role] : "/";
}

export function isStoreRole(role?: UserRole | null) {
  return (
    role === "STORE_OWNER" || role === "STORE_EMPLOYEE" || role === "SELLER"
  );
}
