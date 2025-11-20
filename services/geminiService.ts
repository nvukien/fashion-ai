
import { GoogleGenAI, Modality } from "@google/genai";
import { ServiceResponse } from '../types';

const getAiClient = () => {
  // Fix: Use process.env.API_KEY strictly as per guidelines
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found in environment variables (process.env.API_KEY)");
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
    const model = 'gemini-2.5-flash-image'; // Best for editing and multi-modal understanding

    let systemInstruction = "";
    let finalPrompt = "";

    const presetText = presets.length > 0 ? `Style and Atmosphere details to apply: ${presets.join(", ")}.` : "";

    // CRITICAL PROMPT FOR STRICT MODE
    // Updated to include clothing and accessories preservation
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

    switch (mode) {
      case 'extract':
        systemInstruction = "You are a professional fashion photographer and editor. Your task is to isolate clothing items from images.";
        finalPrompt = `Extract the main clothing item (garment) from the provided image. Display it as a high-quality flat-lay fashion design product shot on a pure white background. Ensure textures and details are preserved. ${strictMode ? 'Maintain the exact shape, fabric details, and color of the original garment.' : ''} ${presetText} ${formatInstruction} ${userPrompt}`;
        break;
      
      case 'try-on':
        // For try-on, we typically expect 2 images: [Model, Garment] or [Reference, Target]
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

    // Add text prompt
    // Fix: gemini-2.5-flash-image does not support systemInstruction in config, so we append it to the prompt.
    const combinedPrompt = `${systemInstruction}\n\n${finalPrompt}`;
    parts.push({ text: combinedPrompt } as any);

    // Generate a random seed to ensure variation on regeneration
    const randomSeed = Math.floor(Math.random() * 2147483647);

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: parts,
      },
      config: {
        // Fix: Removed systemInstruction and seed as they are not supported in gemini-2.5-flash-image config
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
