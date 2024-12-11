export interface additionalData {
  key: string;
  value: string;
}

export interface CallStartingType {
  from_number: string;
  to_number: string;
  full_name: string;
  agent_id: string;
  email: string;
  country: string;
  additional_data?: additionalData[];
}
