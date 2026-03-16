import { UserRole } from "@prisma/client";

export type PublicUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  active: boolean;
};

export type AuthSession = {
  id: string;
  expiresAt: Date;
  user: PublicUser;
};
