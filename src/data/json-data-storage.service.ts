import { promises as fs } from 'fs';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DataStorageService {
    private readonly dataPath: string;

    constructor() {
        const configuredDataPath = process.env.DATA_FILE_PATH;
        if (!configuredDataPath) {
            throw new Error('DATA_FILE_PATH environment variable is not set.');
        }
        this.dataPath = configuredDataPath;
    }

    async readRawData(): Promise<{ places: unknown[]; reviews: unknown[] }> {
        try {
            const data = await fs.readFile(this.dataPath, 'utf-8');
            return JSON.parse(data);
        }
        catch (error: any) {
            if (error.code === 'ENOENT') { //ENOENT is similar to "file not found"
                return { places: [], reviews: [] }; //returns empty arrays if the file doesn't exist yet
            }
            throw new Error(`Failed to read file: ${error.message}`);
        }
    }

    async writeRawData( data: { places: unknown[]; reviews: unknown[] }): Promise<void> {
        try {
            await fs.writeFile(this.dataPath, JSON.stringify(data, null, 2), 'utf-8');
        }
        catch (error: any) {
            throw new Error(`Error writing data to file: ${error.message}`);
        }
    }

    async readData(section: 'places' | 'reviews'): Promise<unknown[]> {
        const rawData = await this.readRawData();
        if (!rawData[section]) {
            throw new Error(`Section ${section} not found in data file.`);
        }
        return rawData[section];
    }

    async writeData(section: 'places' | 'reviews', data: unknown[]): Promise<void> {
        const rawData = await this.readRawData();
        rawData[section] = data;
        await this.writeRawData(rawData);
    }
}

