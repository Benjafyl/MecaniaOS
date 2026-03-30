import { UserRole } from "@prisma/client";

export type PublicUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  active: boolean;
  clientId?: string | null;
};

export type AuthSession = {
  id: string;
  expiresAt: Date;
  user: PublicUser;
};
