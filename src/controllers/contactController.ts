import { Request, Response } from "express";

export default function contactController(req: Request, res: Response) {
  res.render("pages/contact.html");
}
