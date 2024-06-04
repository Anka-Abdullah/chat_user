import { MongooseModuleOptions } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';


export const getDatabaseConfig = async (configService: ConfigService): Promise<MongooseModuleOptions> => {
  try {
    const uri = configService.get<string>('DATABASE_URI');
    if (!uri) {
      throw new Error('DATABASE_URI is not defined in .env file');
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000)); 

    console.log('Successfully connected to the database');
    return { uri };
  } catch (error) {
    console.error('Failed to connect to the database', error.stack);
    throw error;
  }
};
