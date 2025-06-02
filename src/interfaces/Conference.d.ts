import { Page } from "./Page";
import { User } from "../context/AuthContext";

export interface Conference {
    id: number;
    title: string;
    year: number;
    created_by: number;
    created_at: string;
    updated_at: string;
    creator?: User;
    pages?: Page[];
  }
  