import { useGetIdentity } from "@refinedev/core";

import type { Role } from "@/graphql/schema.types";
import { isDemoAccount } from "@/utilities/helpers";
import { isManagerRole } from "@/utilities/role-options";

export type ScopedIdentity = {
  id: string;
  email: string;
  name?: string;
  role?: Role | null;
};

export type AccessScope = {
  identity?: ScopedIdentity;
  identityId?: string;
  isLoading: boolean;
  isDemo: boolean;
  isManager: boolean;
  seesAllRecords: boolean;
};

export const useAccessScope = (): AccessScope => {
  const { data: identity, isLoading } = useGetIdentity<ScopedIdentity>();

  const isDemo = isDemoAccount(identity?.email);
  const isManager = isManagerRole(identity?.role);

  return {
    identity,
    identityId: identity?.id,
    isLoading,
    isDemo,
    isManager,
    seesAllRecords: isDemo || isManager,
  };
};

export type RecordAccess = "loading" | "granted" | "denied";

export const resolveRecordAccess = (args: {
  identityLoading: boolean;
  recordLoading: boolean;
  recordError: boolean;
  hasRecord: boolean;
  isOwner: boolean;
  seesAllRecords: boolean;
}): RecordAccess => {
  if (args.identityLoading || args.recordLoading) return "loading";
  if (args.recordError || !args.hasRecord) return "denied";
  return args.seesAllRecords || args.isOwner ? "granted" : "denied";
};
