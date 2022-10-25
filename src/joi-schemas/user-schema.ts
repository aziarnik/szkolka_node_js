import Joi from 'joi';
import { User } from '../db/entities/user';
import { Role } from '../enums/user-role';

export const editUserSchema = Joi.object<User>({
  password: Joi.string().required().pattern(new RegExp('^[a-zA-Z0-9]{8,30}$')),
  user_name: Joi.string().required().email(),
  role: Joi.number().required().valid(Role.Admin, Role.User),
  id: Joi.number().required().sign('positive'),
  xmin: Joi.number().required()
});
