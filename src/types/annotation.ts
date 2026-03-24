export interface Label {
    id: string;
    name: string;
    color: string;
  }
  
  export interface BBox {
    id: string;
    labelId: string;
    x: number;
    y: number;
    width: number;
    height: number;
  }
  
  export interface Annotation {
    imageFile: File;
    imageUrl: string;
    bboxes: BBox[];
    naturalWidth: number;
    naturalHeight: number;
  }
  