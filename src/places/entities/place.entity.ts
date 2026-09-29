import { randomUUID } from 'crypto';
import { PlaceCategory } from '../../enums/place-category.enum.js';
import { PlaceStatus } from '../../enums/place-state.enum.js';

export class Place {
    id: string;
    name: string;
    description: string;
    category: PlaceCategory;
    address: string;
    services: string[];
    status: PlaceStatus
    averageRating: number | null;
    reviewCount: number;
    createdAt: Date;
    updatedAt: Date;

    constructor(name: string, description: string, category: PlaceCategory, address: string, services: string[] = [], status: PlaceStatus = PlaceStatus.ACTIVE) 
    {
        this.id = randomUUID();
        this.name = name;
        this.description = description;
        this.category = category;
        this.address = address;
        this.services = services;
        this.status = status;
        this.averageRating = null;
        this.reviewCount = 0;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
}
