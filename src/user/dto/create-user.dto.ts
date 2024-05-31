export class CreateUserDto {
    readonly email: string;
    readonly password: string;
    readonly about?: string;
    readonly interest?: string[];
    readonly first_name: string;
    readonly last_name: string;
    readonly gender: 'male' | 'female';
    readonly birthday: Date;
    readonly Horoscope?: string;
    readonly zodiac?: string;
    readonly height?: number;
    readonly weight?: number;
    readonly image?: string;
  }
  