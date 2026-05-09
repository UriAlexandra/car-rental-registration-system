export interface Vehicle {
  _id?: string; 
  vehicleCategory: 'CAR' | 'WATERCRAFT'; 
  type: string;
  manufacturer: string;
  licensePlate: string;
  chassisNumber: string;
  purchaseDate?: Date | string; 
  serialNumber: number;
  dailyRentalFee: number;
  perKmFee: number;
  status: 'AVAILABLE' | 'RENTED' | 'SCRAPPED'; 
}