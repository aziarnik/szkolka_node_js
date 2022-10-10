import { Request, Response } from 'express';
import { ProjectBasicInfo } from '../contracts/project-basic-info';
import { exec } from 'child_process';
import { runInTransaction } from '../db/decorators/run-in-transaction';

export class VersionController {
  static async GetBasicProjectInfo(
    req: Request,
    res: Response<ProjectBasicInfo>
  ) {
    const lastCommitHashCode = await execAsync('git rev-parse HEAD');
    const projectVersion = process.env.npm_package_version ?? 'none';

    res.send({
      LastCommitHashCode: lastCommitHashCode,
      ProjectVersion: projectVersion
    });
  }

  @runInTransaction()
  static async GetTransaction(req: Request, res: Response) {
    req.dbConnection?.connection.query(`INSERT INTO public."FakeTable"(
      "Fake")
      VALUES ('Fake22'), ('Fake3');`);

    req.dbConnection?.connection.query(`INSERT INTO public."FakeTable"(
        "Fake")
        VALUES ('Fake4'), ('Fake5');`);
    const projectVersion = process.env.npm_package_version ?? 'none';

    res.send({
      ProjectVersion: projectVersion
    });
  }
}

function execAsync(command: string): Promise<string> {
  return new Promise(function (resolve, reject) {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }

      if (stderr) {
        reject(stderr);
        return;
      }

      resolve(stdout.trim());
    });
  });
}
