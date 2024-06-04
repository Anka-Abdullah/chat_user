import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Req,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  NotFoundException,
  BadRequestException,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import * as fs from 'fs';
import { promisify } from 'util';
import { unlink } from 'fs';
import { Response } from 'express';

const unlinkAsync = promisify(unlink);

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  async findAll(@Req() req) {
    return this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: CreateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.userService.delete(id);
  }

  @Post('image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: join(__dirname, '..','uploads'),
        filename: async (req, file, cb) => {
          const userSub = req['user'].sub;
          const fileExtension = extname(file.originalname);
          const fileName = `${userSub}${fileExtension}`;
          try {
            await unlinkAsync(fileName);
          } catch (error) {}
          cb(null, fileName);
        },
      }),
      fileFilter: (req, file, cb) => {
        console.log(join(__dirname, 'uploads'));
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          return cb(
            new BadRequestException('Only image files are allowed!'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  uploadPhoto(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is not an image.');
    }
    return {
      message: 'File uploaded successfully!',
      file: file.filename,
    };
  }

  @Get('images/:id')
  async getPhoto(@Param('id') id: string) {
    console.log(id);

    const possibleExtensions = ['.jpg', '.jpeg', '.png', '.gif'];

    for (const ext of possibleExtensions) {
      const filePath = `./uploads/${id}${ext}`;
      console.log(filePath);

      if (fs.existsSync(filePath)) {
        return fs.createReadStream(filePath);
      }
    }

    throw new NotFoundException('Photo not found');
  }

  @Get('image/:id')
  async serveImage(@Param('id') id: string, @Res() res: Response) {
    let imagePath = '', exist = false;
    const possibleExtensions = ['.jpg', '.jpeg', '.png', '.gif'];

    try {
      for (const ext of possibleExtensions) {
        const filePath = join(__dirname, '..', `./uploads/${id}${ext}`);

        if (fs.existsSync(filePath)) {
          exist = true;
          imagePath = filePath
        }
      }
      if (exist) {
        res.sendFile(imagePath);
      }
    } catch (err) {
      throw new NotFoundException('Image not found');
    }
  }

  @Delete('image/:id')
  async deletePhoto(@Param('id') fileName: string) {
    const possibleExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
    let deleted = false;

    for (const ext of possibleExtensions) {
      try {
        await unlinkAsync(`./uploads/${fileName}${ext}`);
        deleted = true;
        break;
      } catch (error) {}
    }
    if (!deleted) {
      throw new NotFoundException('Photo not found');
    }
    return { message: 'Photo deleted successfully' };
  }
}
