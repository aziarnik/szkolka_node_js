import { Router } from 'express';
import { VersionController } from '../controllers/version-controller';
import { asyncHandler } from '../middlewares/async-handler';

export const versionRoute = Router();

versionRoute.get(
  '/version',
  asyncHandler(VersionController.GetBasicProjectInfo)
);
