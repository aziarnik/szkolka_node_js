import { Request, Response } from 'express';
import { runInTransaction } from '../db/decorators/run-in-transaction';
import { User } from '../db/entities/user';
import { IDbConnection } from '../db/interfaces/i-db-connection';
import { UserRepository } from '../db/repositories/user-repository';
import { editUserSchema } from '../joi-schemas/user-schema';
import { applyPatch, Operation } from 'fast-json-patch';
import { RegisterDto } from '../contracts/auth/register-dto';
import { authRegisterSchema } from '../joi-schemas/auth-schema';
import { PasswordManagementHelper } from '../helpers/password-management-helper';
import { Role } from '../enums/user-role';
import { RequestHandlerHelper } from '../helpers/request-handler-helper';

export class UserController {
  private readonly userRepository: UserRepository;

  constructor(connection: IDbConnection) {
    this.userRepository = new UserRepository(connection);
  }

  @runInTransaction()
  async getAllUsers(req: Request, res: Response<User[]>) {
    const result = await this.userRepository.getAll();
    res.send(result);
  }

  @runInTransaction()
  async updateUser(req: Request<any, any, Operation[]>, res: Response) {
    const userId = RequestHandlerHelper.getIdFromQueryParams(req);
    const user = await this.userRepository.firstById(userId);
    const updatedUser = new User(
      applyPatch(user, req.body, undefined, false).newDocument
    );
    await editUserSchema.validateAsync(updatedUser);
    await updatedUser.additionalWork(user);
    await this.userRepository.basicUpdate(updatedUser);
    res.send({ message: 'OK' });
  }

  @runInTransaction()
  async softDeleteUser(req: Request, res: Response) {
    await this.userRepository.delete(
      RequestHandlerHelper.getIdFromQueryParams(req)
    );
    res.send({ message: 'OK' });
  }

  @runInTransaction()
  async registerUser(
    req: Request<unknown, unknown, RegisterDto>,
    res: Response
  ) {
    await authRegisterSchema.validateAsync(req.body);
    const hashedPassword = await PasswordManagementHelper.hashPassword(
      req.body.password
    );
    const user = new User({
      user_name: req.body.userName,
      password: hashedPassword,
      role: Role.User
    } as User);
    await this.userRepository.add(user);

    res.status(200).json('User registered');
  }
}
