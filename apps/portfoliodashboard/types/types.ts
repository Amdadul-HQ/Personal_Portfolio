/* eslint-disable @typescript-eslint/no-explicit-any */
export type TReactChildrenType ={children:React.ReactNode}  

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  iat?: number;
  exp?: number;
}
// Types based on the Prisma schema
export type User = {
  name: string;
  email: string;
  events: IEvent[];
  id: string;
  invitations: any[];
  participations: any[];
  payments: any[];
  createdAt: string;
  reviews: any[];
  role: "USER" | "ADMIN";
  updatedAt: string;
};

export type IEvent = {
  id: string
  title: string
  description: string
  dateTime: Date
  eventImgUrl: string
  venue: string
  isPublic: boolean
  isPaid: boolean
  fee: number | null
}

