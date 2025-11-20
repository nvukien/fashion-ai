import { GoogleGenAI, Modality } from "@google/genai";
import { ServiceResponse } from '../types';

const getAiClient = () => {
  // STRICT REQUIREMENT: Access API Key exclusively via process.env.API_KEY
  // Thanks to vite.config.ts configuration, this works even in browser environment.
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    console.error("API Key is missing. Please check Environment Variables.");
    throw new Error("API Key not found. Please add VITE_API_KEY to your Vercel Environment Variables.");
  }
  return new GoogleGenAI({ apiKey });
};

// Helper to clean base64 string
const cleanBase64 = (b64: string) => b64.replace(/^data:image\/\w+;base64,/, "");

export const processImageWithGemini = async (
  mode: 'extract' | 'try-on' | 'edit' | 'upscale',
  images: { base64: string; mimeType: string }[],
  userPrompt: string,
  presets: string[], // Array of preset strings
  strictMode: boolean = false, // New strict mode parameter
  aspectRatioPrompt: string = '', // New aspect ratio instruction
  resolutionPrompt: string = '' // New resolution instruction
): Promise<ServiceResponse> => {
  try {
    const ai = getAiClient();
    // Use the specific model for image generation/editing tasks
    const model = 'gemini-2.5-flash-image'; 

    let systemInstruction = "";
    let finalPrompt = "";

    const presetText = presets.length > 0 ? `Style and Atmosphere details to apply: ${presets.join(", ")}.` : "";

    // CRITICAL PROMPT FOR STRICT MODE
    const strictInstruction = strictMode 
      ? ` IMPORTANT - HIGH FIDELITY CONSTRAINT: You must PRESERVE the EXACT facial identity, facial structure, head shape, body proportions, and skin details of the person in the reference image. 
          Do NOT alter the face, eyes, nose, mouth, or jawline. The person in the output MUST look 100% identical to the reference.
          
          CRITICAL: You must ALSO PRESERVE the ORIGINAL CLOTHING, OUTFIT, and ACCESSORIES (jewelry, hats, glasses, etc.) EXACTLY as they appear in the reference image.
          Do NOT change the color, texture, or style of the clothes unless the prompt explicitly asks to change the clothing (e.g., "wearing a red dress", "virtual try-on", "change outfit").
          If the user prompt does not strictly request a clothing change, do NOT modify the outfit or accessories in any way.
          
          Do NOT hallucinate new features. Keep the subject's appearance frozen unless directed otherwise.` 
      : "";

    // combine aspect and resolution info
    const formatInstruction = `Output Settings: Generate the image with ${aspectRatioPrompt} and ${resolutionPrompt}.`;
    
    // Add random seed for variation on regenerate (simulated by appending random text if needed, 
    // but Gemini supports seed in config. However, specifically for gemini-2.5-flash-image, 
    // prompt variation is the most reliable way to force changes).
    const randomSeed = Math.floor(Math.random() * 1000000);

    switch (mode) {
      case 'extract':
        systemInstruction = "You are a professional fashion photographer and editor. Your task is to isolate clothing items from images.";
        finalPrompt = `Extract the main clothing item (garment) from the provided image. Display it as a high-quality flat-lay fashion design product shot on a pure white background. Ensure textures and details are preserved. ${strictMode ? 'Maintain the exact shape, fabric details, and color of the original garment.' : ''} ${presetText} ${formatInstruction} ${userPrompt}`;
        break;
      
      case 'try-on':
        systemInstruction = "You are an expert AI fashion stylist and photo manipulator. You specialize in realistic virtual try-on.";
        finalPrompt = `Create a photorealistic image. Take the person from the first image and dress them in the clothing shown in the second image. ${strictInstruction} Maintain the fabric physics and drape naturally. ${presetText} ${formatInstruction} ${userPrompt}`;
        break;

      case 'edit':
        systemInstruction = "You are a professional photo editor using generative AI. You can modify backgrounds, poses, and details while preserving the subject identity.";
        finalPrompt = `Edit the provided image according to this instruction: ${userPrompt}. ${presetText}. ${strictInstruction} ${formatInstruction} Ensure high photorealism.`;
        break;

      case 'upscale':
        systemInstruction = "You are an expert in image restoration and super-resolution.";
        finalPrompt = `Redraw this image in extremely high resolution (4k), sharpening all details, improving textures, and correcting any artifacts. Do not change the content, just enhance the quality significantly. ${strictInstruction} ${presetText} ${formatInstruction}`;
        break;
    }

    const parts = images.map(img => ({
      inlineData: {
        data: cleanBase64(img.base64),
        mimeType: img.mimeType
      }
    }));

    // gemini-2.5-flash-image does not support systemInstruction in config, so we append it to the prompt.
    const combinedPrompt = `${systemInstruction}\n\n${finalPrompt}\n\n[Variation Seed: ${randomSeed}]`;
    parts.push({ text: combinedPrompt } as any);

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: parts,
      },
      config: {
        // Only responseModalities is supported for this model currently
        responseModalities: [Modality.IMAGE],
      }
    });

    const generatedPart = response.candidates?.[0]?.content?.parts?.[0];
    
    if (generatedPart && generatedPart.inlineData && generatedPart.inlineData.data) {
        return {
            success: true,
            imageUrl: `data:image/png;base64,${generatedPart.inlineData.data}`,
            generatedPrompt: finalPrompt
        };
    } else {
        return {
            success: false,
            error: "No image generated in response."
        }
    }

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return {
      success: false,
      error: error.message || "Unknown error occurred during generation"
    };
  }
};