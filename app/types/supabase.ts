export interface IExtractionRow {
  id: string;
  user_id: string;
  image_name: string;
  created_at: string;
}

export interface IProductRow {
  id: string;
  extraction_id: string;
  code: string;
  name: string;
  quantity: number;
  unit: string;
  created_at: string;
}
