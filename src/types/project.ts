import { type Label } from "./annotation";

export interface Project {
  id: string;
  name: string;
  labels: Label[];
  createdAt: string;
}
