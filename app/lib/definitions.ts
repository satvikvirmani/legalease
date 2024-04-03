export type Consumer = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type ConsumerW = {
  id: string;
  name: string;
  email: string;
  typeofuser: string;
  password: string;
};

export type Provider = {
  id: string;
  name: string;
  email: string;
  password: string;
  title: string;
  age: string;
  interesteddomains: string;
  expertise: string;
  description: string;
  phone: string;
};

export type Request = {
  id: string;
  consumerid: string;
  consumername: string;
  providerid: string;
  providername: string;
  description: string;
  status: 'pending' | 'accepted' | 'rejected';
  date: Date;
};