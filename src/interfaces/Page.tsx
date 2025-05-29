export interface Page {
    id: number;
    title: string;
    slug?: string | null;
    content: string;
    conference_id: number;
    created_by: number;
    created_at: string;
    updated_at: string;
  }