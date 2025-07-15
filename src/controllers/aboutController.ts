import { Request, Response } from "express";

export default function aboutController(req: Request, res: Response) {
  res.render("pages/about.html");
}
