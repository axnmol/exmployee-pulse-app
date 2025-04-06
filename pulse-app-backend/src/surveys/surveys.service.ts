import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateSurveyDto } from './dto/create-survey.dto';

// Define Survey structure for in-memory store
export interface Survey {
  _id: string; // Use string for UUID
  userId: string; // Store the user's UUID
  response: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class SurveysService {
  // In-memory storage
  private readonly surveys: Survey[] = [];

  async create(createSurveyDto: CreateSurveyDto, userId: string): Promise<Survey> {
    const newSurvey: Survey = {
      _id: uuidv4(), // Generate UUID
      userId: userId,
      response: createSurveyDto.response,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.surveys.push(newSurvey);
    return newSurvey; // Return the created survey object
  }

  async findAllForUser(userId: string): Promise<Survey[]> {
    // Filter the array and sort (optional, can sort on frontend too)
    return this.surveys
      .filter(survey => survey.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()); // Sort newest first
  }

  async findAll(): Promise<Survey[]> {
    // Return a copy of the array, sorted
    // No need for .lean() or populate
    return [...this.surveys].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
}
