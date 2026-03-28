export interface IProduct {
  id: string;
  code: string;
  name: string;
  quantity: number;
  unit: string;
}

export interface IExtraction {
  id: string;
  imageName: string;
  items: IProduct[];
  createdAt: string;
}

export interface IUploadedFile {
  file: File;
  preview: string;
}
