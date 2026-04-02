export type Hazard = {
  id: number;
  title: string;
  user?: {
    _id?: string;
    firstName?: string;
    lastName?: string;
    userName?: string;
  };
  images: string[];
  location: {
    latitude: number;
    longitude: number;
  };
  hazardType: string;
  description?: string;
  createdAt?: string;
};


