/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Res,
  Header,
  StreamableFile,
} from '@nestjs/common';
import { SurveysService } from './surveys.service';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Response } from 'express';
import { Parser } from 'json2csv';
import { Readable } from 'stream';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';

@Controller('surveys') // Base path /surveys
@UseGuards(JwtAuthGuard) // Protect all routes in this controller by default
export class SurveysController {
  constructor(private readonly surveysService: SurveysService) {}

  // POST /surveys - Submit a survey (Employee or Admin can submit)
  @Post()
  create(@Body() createSurveyDto: CreateSurveyDto, @Request() req) {
    // req.user is populated by JwtAuthGuard -> { userId: string, email: string }
    const userId = req.user.userId;
    return this.surveysService.create(createSurveyDto, userId);
  }

  // GET /surveys - Get own past surveys (Employee or Admin)
  @Get()
  findOwn(@Request() req) {
    const userId = req.user.userId;
    return this.surveysService.findAllForUser(userId);
  }

  // --- Admin Routes --- //

  // GET /surveys/all - Get all surveys (Admin Only)
  @Get('all')
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  findAll() {
    return this.surveysService.findAll();
  }

  // GET /surveys/export/json - Export all as JSON (Admin Only)
  @Get('export/json')
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  @Header('Content-Type', 'application/json')
  @Header('Content-Disposition', 'attachment; filename="surveys.json"')
  async exportJson() {
    const surveys = await this.surveysService.findAll();
    // Convert to a StreamableFile for efficient streaming
    const jsonString = JSON.stringify(surveys, null, 2);
    const readStream = Readable.from(jsonString);
    return new StreamableFile(readStream);
  }

  // GET /surveys/export/csv - Export all as CSV (Admin Only)
  @Get('export/csv')
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  @Header('Content-Type', 'text/csv')
  @Header('Content-Disposition', 'attachment; filename="surveys.csv"')
  async exportCsv(@Res({ passthrough: true }) res: Response) {
    // Use passthrough for StreamableFile
    const surveys = await this.surveysService.findAll();
    if (!surveys || surveys.length === 0) {
      // Handle empty data case - maybe return empty file or error
      res.send('');
      return;
    }
    // Define fields - adjust based on actual data structure after .lean()
    // Since we used .lean(), surveys are plain objects.
    // We might need to flatten or select specific fields, especially the userId.
    const fields = [
      { label: 'Survey ID', value: '_id' },
      { label: 'User ID', value: 'userId' }, // This will be the ObjectId string
      // { label: 'User Email', value: 'userId.email'}, // If populated
      { label: 'Response', value: 'response' },
      { label: 'Submission Date', value: 'createdAt' },
    ];
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(surveys);

    const readStream = Readable.from(csv);
    return new StreamableFile(readStream);
  }
}
