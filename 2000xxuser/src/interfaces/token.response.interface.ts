export interface tokenRMQResponse {
  status: number;
  token: string | null;
  message: string;
}

export interface tokenRMQVerifiedResponse {
  status: number;
  message: string;
  user: string;
  token: string;
}
