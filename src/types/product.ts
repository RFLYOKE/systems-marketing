export interface Product {
  id: number;
  category: string;
  title: string;
  description: string;
  technology: string;
  programmers: {
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
  }[];
  image: File;
}
