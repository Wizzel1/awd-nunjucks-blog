
import { Request, Response, NextFunction } from "express";
import { tryCatch } from "../utils/tryCatch";
import { join } from "path";
import * as fsExtra from "fs-extra";

export async function logger(req: Request, res: Response, next: NextFunction) {
  const log = {
    date: new Date().toISOString(),
    ip: req.ip,
    status: res.statusCode,
    method: req.method,
    url: req.url,
  };

  const logPath = join(__dirname, "..", "..", "logs", "log.txt");
  await fsExtra.ensureFile(logPath);

  const { error, data } = await tryCatch(
    fsExtra.appendFile(logPath, JSON.stringify(log) + ",\n")
  );

  if (error) {
    console.error(error);
  } else {
    console.log(data);
    next();
  }
}
