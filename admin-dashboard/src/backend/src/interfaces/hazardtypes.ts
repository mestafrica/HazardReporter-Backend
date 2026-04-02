import { Document } from 'mongoose';

export default interface IHazardType extends Document{
    name:string;
}