import { createAuth } from "@edgecoms/auth";

/**
 * Edge Mail's Better Auth instance: the same user table and admin accounts as
 * the partner platform, served from this host. Sign-up is off, because every
 * user here already exists, and a sign-up would mint a partner row.
 */
export const mailAuth = createAuth({ disableSignUp: true });
