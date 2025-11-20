
export enum AppMode {
  EXTRACT = 'extract',
  TRY_ON = 'try-on',
  EDIT = 'edit',
  UPSCALE = 'upscale',
  ADMIN = 'admin'
}

export interface PresetOption {
  id: string;
  label: string;
  description?: string; // Short explanation for the UI
  promptDetail: string;
  category: 'style' | 'background' | 'lighting' | 'pose' | 'angle' | 'expression';
}

export interface GeneratedImage {
  url: string;
  prompt: string;
  timestamp: number;
}

export interface ImageAsset {
  id: string;
  file: File;
  previewUrl: string;
  base64: string;
  type: 'reference' | 'target' | 'garment';
}

// Type for the response from our service layer
export interface ServiceResponse {
  success: boolean;
  imageUrl?: string; // Base64 data URI
  generatedPrompt?: string; // The actual prompt sent to AI
  error?: string;
}
