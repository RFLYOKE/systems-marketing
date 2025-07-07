export interface Programmer {
  id: number;
  name: string;
  email: string;
  whatsapp: string;
  education: string;
  address: string;
  gender: string;
  birth_place: string;
  birth_date: string;
  university: string;
  skills: number[];
  cv: File | string;
  status: boolean;
}