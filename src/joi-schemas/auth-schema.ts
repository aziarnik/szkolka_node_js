import Joi from 'joi';
import { LoginDto } from '../contracts/auth/login-dto';
import { RegisterDto } from '../contracts/auth/register-dto';

export const authRegisterSchema = Joi.object<RegisterDto>({
  password: Joi.string().required().pattern(new RegExp('^[a-zA-Z0-9]{8,30}$')),
  confirmPassword: Joi.ref('password'),
  userName: Joi.string().email()
});

export const authLoginSchema = Joi.object<LoginDto>({
  password: Joi.string().required().pattern(new RegExp('^[a-zA-Z0-9]{8,30}$')),
  userName: Joi.string().email()
});
