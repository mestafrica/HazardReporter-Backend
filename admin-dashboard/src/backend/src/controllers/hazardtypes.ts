import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import HazardType from '../models/hazardtypes';
import { hazardtypeSchema } from '../validators/hazardtypes';

const NAMESPACE = 'HazardType';

const createHazardType = async (req: Request, res: Response, next: NextFunction) => {

    const { name } = req.body;

    const _hazardType = new HazardType({
        _id: new mongoose.Types.ObjectId(),
        name
    });
    try {
     // Validate the data provided to create a hazardtype
     const { error, value } = hazardtypeSchema.validate(req.body);
     if (error) {
         console.error('Validation Error:', error.details[0].message);
         return res.status(400).send(error.details[0].message);
     }

     const name = value.name;
     console.log('Validation successful. Checking if a hazard type is created:', name);

        const hazardType = await _hazardType.save();
        return res.status(400).json({
            message: 'Hazard Type created successfully',     hazardType
        });
    } catch (error) {
        next(error); 
    }
};



const getAllHazardTypes = async (req: Request, res: Response, next: NextFunction) => {
    try {
         // Validate the data provided to get all hazardtypes
     const { error, value } = hazardtypeSchema.validate(req.body);
     if (error) {
         console.error('Validation Error:', error.details[0].message);
         return res.status(400).send(error.details[0].message);
     }

     const name = value.name;
     console.log('Validation successful. Checking to get all hazard types:', name);
        const hazardTypes = await HazardType.find().exec();

        return res.status(200).json({
            message: 'All the Hazard Types',  hazardTypes,
            count: hazardTypes.length
        });
    } catch (error) {
           next(error); 
    }
};


const getHazardTypeById = async (req: Request, res: Response, next: NextFunction) => {
    const hazardTypeId = req.params.id;

    try {
         // Validate the data provided for one hazardtype
     const { error, value } = hazardtypeSchema.validate(req.body);
     if (error) {
         console.error('Validation Error:', error.details[0].message);
         return res.status(400).send(error.details[0].message);
     }

     const name = value.name;
     console.log('Validation successful. Checking to get one hazard type:', name);
        const hazardType = await HazardType.findById(hazardTypeId).exec();

        if (hazardType) {
            return res.status(200).json({
              message: 'Your Specific Hazard Type',hazardType
            });
        } else {
            return res.status(404).json({
                message: 'Hazard Type not found'
            });
        }
    } catch (error) {
        next(error)
    }
};

const updateHazardType = async (req: Request, res: Response, next: NextFunction) => {
    const hazardTypeId = req.params.id;

    try {
         // Validate the data to update a hazardtype
     const { error, value } = hazardtypeSchema.validate(req.body);
     if (error) {
         console.error('Validation Error:', error.details[0].message);
         return res.status(400).send(error.details[0].message);
     }

     const name = value.name;
     console.log('Validation successful. Checking to update a hazard type:', name);
        const hazardType = await HazardType.findById(hazardTypeId).exec();

        if (hazardType) {
            hazardType.set(req.body);

            const result = await hazardType.save();

            return res.status(200).json({
                message: 'Your Specific Hazard Type',                hazardType: result
            });
        } else {
            return res.status(404).json({
                message: 'HazardType not found'
            });
        }
    } catch (error) {
        next(error)
    }
};


const deleteHazardType = async (req: Request, res: Response, next: NextFunction) => {
    const hazardTypeId = req.params.id;

    try {
         // Validate the data to delete a hazardtype
     const { error, value } = hazardtypeSchema.validate(req.params.id);
     if (error) {
         console.error('Validation Error:', error.details[0].message);
         return res.status(400).send(error.details[0].message);
     }

     const name = value.name;
     console.log('Validation successful. Checking to delete a hazard type:', name);
        const hazardType = await HazardType.findByIdAndDelete(hazardTypeId).exec();

        if (hazardType) {
            return res.status(200).json({
                message: 'Hazard Type Deleted'
            });
        } else {
            return res.status(404).json({
                message: 'Hazard Type not found'
            });
        }
    } catch (error) {
         next(error)
    }
};

export default { createHazardType, getAllHazardTypes, getHazardTypeById, updateHazardType, deleteHazardType };

