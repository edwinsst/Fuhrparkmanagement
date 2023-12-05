/* tslint:disable */
/* eslint-disable */
export interface Car {
  available?: boolean;
  createdDate?: string;
  deletedDate?: string;
  fuelType: 'PETROL' | 'DIESEL' | 'ELECTRIC';
  id?: number;
  licensePlate: string;
  location: string;
  modelName: string;
  range: number;
  seats: number;
}
