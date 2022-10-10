import { Router } from 'express';
import { VersionController } from '../controllers/version-controller';

export const versionRoute = Router();

versionRoute.get('/version', VersionController.GetBasicProjectInfo);

versionRoute.get('/transation', VersionController.GetTransaction);
