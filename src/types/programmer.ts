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
  skills: {
    id: number;
    name: string;
    description: string;
    status: boolean;
    created_at?: string;
    updated_at?: string;
  }[];
  cv: File | string;
}