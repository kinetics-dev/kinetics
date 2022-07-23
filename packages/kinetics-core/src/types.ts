export interface User {
  uid: string;
  tenantId: string;
  email: string | null;
  phoneNumber: string | null;
  displayName: string | null;
  photoURL: string | null;
  account: {
    id: string;
    workspaceId: string;
    roles: Array<{
      id: string;
      name: string;
      description: string;
    }>;
  };
}

export interface ServiceError {
  statusCode: number;
  message: string;
  error?: string;
}

export type Config =
  | {
      clientId: string;
      clientSecret: string;
      workspace?: string;
    }
  | {
      apiKey: string;
      workspace?: string;
    };
