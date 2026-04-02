export interface HazardReport {
  _id: string;
  title: string;
  description: string;
  hazardtype: string;
  city: string;
  country: string;
  latitude: string;
  longitude: string;
  images: string[];
  user: string;
  createdAt: string;
  updatedAt: string;
}