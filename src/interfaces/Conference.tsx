import { Page } from "./Page";
import { User } from "./User";

export interface Conference {
    id: number;
    title: string;
    year: number;
    created_by: number;
    created_at: string;
    updated_at: string;
    // Optional relations
    creator?: User;
    pages?: Page[];
  }
  