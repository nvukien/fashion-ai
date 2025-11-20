import { PresetOption } from './types';
import { Layout, Shirt, Wand2, ZoomIn, Settings } from 'lucide-react';

export const DEFAULT_PRESETS: PresetOption[] = [
  // --- STYLE (Phong cách) ---
  { 
    id: 'style-realism', 
    label: 'Siêu Thực (Ultra-Realistic)', 
    description: 'Ảnh đời thường, giống chụp bằng điện thoại, chân thực 100%.',
    promptDetail: 'raw amateur photography, shot on iPhone 15 Pro, authentic look, unfiltered, skin texture imperfections, natural messy hair, realistic lighting, candid snapshot, 4k, hyper-realistic, not AI generated look, hard flash, imperfect composition', 
    category: 'style' 
  },
  { 
    id: 'style-cartoon', 
    label: 'Hoạt Hình (Cartoon 3D)', 
    description: 'Phong cách 3D Pixar/Disney hoặc Siêu anh hùng cho trẻ em.',
    promptDetail: '3D disney pixar animation style, superhero comic cover art, vibrant colors, exaggerated features, smooth rendering, fantasy atmosphere, magical lighting, action-packed, cgi render, octane render, cute and heroic', 
    category: 'style' 
  },
  { 
    id: 'style-cinematic', 
    label: 'Điện Ảnh (Cinematic)', 
    description: 'Màu phim nhựa, tỉ lệ điện ảnh, ánh sáng kịch tính.',
    promptDetail: 'cinematic movie scene, anamorphic lens, teal and orange color grading, dramatic composition, film grain, motion picture look, atmospheric depth, blockbuster movie aesthetic, volumetric lighting', 
    category: 'style' 
  },
  { 
    id: 'style-minimalist', 
    label: 'Tối Giản (Minimalist)', 
    description: 'Sang trọng, đường nét sạch sẽ, ít chi tiết thừa.',
    promptDetail: 'high-end fashion photography, minimalist aesthetic, clean lines, neutral color palette, soft contrast, highly detailed texture, 8k resolution, vogue editorial style', 
    category: 'style' 
  },
  { 
    id: 'style-vintage', 
    label: 'Cổ Điển 90s (Vintage)', 
    description: 'Màu phim hoài cổ, hạt grain, style thập niên 90.',
    promptDetail: '90s fashion aesthetic, film grain, retro color grading, flash photography style, slightly desaturated, nostalgic mood, analog camera texture', 
    category: 'style' 
  },
  { 
    id: 'style-cyberpunk', 
    label: 'Tương Lai (Cyberpunk)', 
    description: 'Đèn neon, công nghệ cao, hiện đại và sắc nét.',
    promptDetail: 'futuristic fashion, neon accents, metallic textures, sharp focus, high tech urban vibe, glowing elements, chromatic aberration, cinematic sci-fi look', 
    category: 'style' 
  },
  { 
    id: 'style-bohemian', 
    label: 'Du Mục (Bohemian)', 
    description: 'Mơ mộng, phóng khoáng, tông màu ấm áp.',
    promptDetail: 'soft focus, dreamy atmosphere, warm earth tones, natural lighting, organic textures, romantic and free-spirited vibe, ethereal glow', 
    category: 'style' 
  },
  { 
    id: 'style-streetwear', 
    label: 'Đường Phố (Streetwear)', 
    description: 'Năng động, cá tính, màu sắc nổi bật, hypebeast.',
    promptDetail: 'sharp digital photography, high saturation, wide angle lens, dynamic perspective, vibrant colors, trendy streetwear culture aesthetic, hypebeast style', 
    category: 'style' 
  },

  // --- BACKGROUND (Bối cảnh) ---
  { 
    id: 'bg-bedroom', 
    label: 'Phòng Ngủ (Bedroom)', 
    description: 'Giường ngủ, chăn ga lụa, không gian riêng tư (với nội y/váy ngủ).',
    promptDetail: 'intimate luxury bedroom setting, messy bed with silk sheets, soft pillows, morning sunlight streaming in, cozy and private atmosphere, plush headboard, blurred background, boudoir context, soft textures', 
    category: 'background' 
  },
  { 
    id: 'bg-bathroom', 
    label: 'Phòng Tắm (Bathroom)', 
    description: 'Bồn tắm, gạch men, gương, không gian spa (với bikini).',
    promptDetail: 'luxury modern bathroom, marble walls, ceramic bathtub, large mirror with condensation, soft steam, spa-like atmosphere, clean and bright, wet surfaces, towel rack in background', 
    category: 'background' 
  },
  { 
    id: 'bg-office', 
    label: 'Văn Phòng (Office)', 
    description: 'Hiện đại, bàn làm việc, không gian công sở chuyên nghiệp.',
    promptDetail: 'modern corporate office environment, glass walls, office desk with laptop, blurred coworkers in background, bright daylight, professional business setting, skyscrapers visible through window', 
    category: 'background' 
  },
  { 
    id: 'bg-studio-inf', 
    label: 'Studio Trắng (White)', 
    description: 'Phông nền trắng vô cực, chuyên nghiệp.',
    promptDetail: 'professional cyclorama studio background, pure white infinity curve, zero distractions, commercial product photography standard, sharp subject isolation', 
    category: 'background' 
  },
  { 
    id: 'bg-luxury-home', 
    label: 'Penthouse Sang Trọng', 
    description: 'Nội thất cao cấp, hiện đại, cửa kính lớn.',
    promptDetail: 'modern luxury penthouse interior, blurred background, marble textures, expensive furniture, floor-to-ceiling windows, sophisticated atmosphere, depth of field', 
    category: 'background' 
  },
  { 
    id: 'bg-urban-city', 
    label: 'Phố Đô Thị (City)', 
    description: 'Đường phố sầm uất, hiện đại, năng động.',
    promptDetail: 'bustling city street background, blurred urban architecture, concrete textures, daylight, metropolitan vibe, fashion week street style context', 
    category: 'background' 
  },
  { 
    id: 'bg-nature-garden', 
    label: 'Sân Vườn (Garden)', 
    description: 'Thiên nhiên xanh mát, hoa lá, ánh sáng lốm đốm.',
    promptDetail: 'lush green garden, sunlight filtering through leaves (dappled light), blooming flowers, soft bokeh background, nature-centric and fresh atmosphere', 
    category: 'background' 
  },
  { 
    id: 'bg-beach-sunset', 
    label: 'Biển Hoàng Hôn (Beach)', 
    description: 'Bãi biển giờ vàng, lãng mạn, nghỉ dưỡng.',
    promptDetail: 'golden hour at the beach, soft sand, ocean waves in background, warm horizon light, vacation resort atmosphere, airy and breezy, romantic mood', 
    category: 'background' 
  },

  // --- POSE (Tư thế) ---
  { 
    id: 'pose-hot', 
    label: 'Táo Bạo 18+ (Sexy/Hot)', 
    description: 'Nóng bỏng, khiêu gợi, tạp chí đàn ông/nội y/bikini.',
    promptDetail: 'bold and provocative pose, maxim magazine style, boudoir photography, arching back, accentuating body curves, sultry and intense, lingerie model posture, glamour shot, high visual impact, confident body language', 
    category: 'pose' 
  },
  { 
    id: 'pose-secret', 
    label: 'Bí Ẩn (Hidden Face)', 
    description: 'Che mặt, quay lưng, giấu mặt kích thích tò mò.',
    promptDetail: 'anonymous pose, face obscured by shadow or hair, hand covering part of face, or looking away completely, mysterious vibe, focus entirely on the outfit and body language, identity hidden, artistic concealment', 
    category: 'pose' 
  },
  { 
    id: 'pose-sexy', 
    label: 'Gợi Cảm (Sensual)', 
    description: 'Quyến rũ, đường cong, thu hút, high fashion.',
    promptDetail: 'high fashion sensual pose, alluring body language, accentuating curves and silhouette, confident and intense gaze, glamour photography, elegant yet provocative, slightly arched back', 
    category: 'pose' 
  },
  { 
    id: 'pose-confident', 
    label: 'Đứng Tự Tin (Power)', 
    description: 'Dáng đứng quyền lực, tay chống hông.',
    promptDetail: 'full body shot, model standing confidently with legs shoulder-width apart, hands on hips or crossed, chin up, powerful and commanding presence, direct gaze', 
    category: 'pose' 
  },
  { 
    id: 'pose-walking', 
    label: 'Đang Bước Đi (Walking)', 
    description: 'Chuyển động tự nhiên, tóc bay.',
    promptDetail: 'captured in mid-stride walking towards camera, dynamic movement, hair flowing, clothes draping naturally in motion, candid street style look, energetic vibe', 
    category: 'pose' 
  },
  { 
    id: 'pose-sitting', 
    label: 'Ngồi Thư Giãn (Sitting)', 
    description: 'Ngồi ghế/sofa, dáng vẻ thoải mái.',
    promptDetail: 'sitting on a stool or chair, body leaning slightly forward, engaging with the camera, casual and approachable posture, hands resting naturally, relaxed mood', 
    category: 'pose' 
  },
  { 
    id: 'pose-leaning', 
    label: 'Dựa Tường (Leaning)', 
    description: 'Dựa lưng vào tường, thả lỏng, cool ngầu.',
    promptDetail: 'model leaning casually against a wall or surface, one leg slightly bent, relaxed shoulders, cool and nonchalant attitude, fashion editorial pose', 
    category: 'pose' 
  },
  { 
    id: 'pose-back', 
    label: 'Nhìn Qua Vai (Back)', 
    description: 'Quay lưng, ngoái lại nhìn, khoe lưng áo.',
    promptDetail: 'model turned away from camera looking back over the shoulder, highlighting the back design of the garment, artistic and mysterious angle, elegant neck line', 
    category: 'pose' 
  },

  // --- LIGHTING (Ánh sáng) ---
  { 
    id: 'light-natural', 
    label: 'Tự Nhiên (Natural)', 
    description: 'Ánh sáng ban ngày, trong trẻo, không đèn.',
    promptDetail: 'pure natural lighting, sunlight, organic shadows, unlit environment, airy and bright, window light source, daytime atmosphere, authentic look', 
    category: 'lighting' 
  },
  { 
    id: 'light-night', 
    label: 'Ban Đêm (Night)', 
    description: 'Đèn đường, flash đêm, mood tâm trạng.',
    promptDetail: 'night time photography, low light, flash photography style, bokeh from city lights in background, high ISO grain, moody and atmospheric, dark environment', 
    category: 'lighting' 
  },
  { 
    id: 'light-rembrandt', 
    label: 'Rembrandt (Nghệ Thuật)', 
    description: 'Tam giác sáng trên má, cổ điển, chiều sâu.',
    promptDetail: 'Rembrandt lighting style, artistic chiaroscuro, distinctive triangle of light on the cheek, dramatic side lighting, painterly quality, deep shadows and rich highlights', 
    category: 'lighting' 
  },
  { 
    id: 'light-softbox', 
    label: 'Studio Mềm (Soft)', 
    description: 'Ánh sáng đều, mịn màng, tôn da.',
    promptDetail: 'large softbox lighting, diffuse and even illumination, wrapping around the subject, minimal shadows, very flattering for skin and fabric, commercial look', 
    category: 'lighting' 
  },
  { 
    id: 'light-golden', 
    label: 'Giờ Vàng (Golden Hour)', 
    description: 'Nắng chiều ấm áp, ngược sáng nghệ thuật.',
    promptDetail: 'warm natural sunlight from the side, lens flare, golden orange tones, rim lighting highlighting the hair and silhouette, magical and cinematic atmosphere', 
    category: 'lighting' 
  },
  { 
    id: 'light-dramatic', 
    label: 'Kịch Tính (Dramatic)', 
    description: 'Tương phản cao, bóng đổ mạnh, ấn tượng.',
    promptDetail: 'high contrast lighting, chiaroscuro effect, deep shadows and bright highlights, cinematic drama, moody and intense, artistic portrait style', 
    category: 'lighting' 
  },
  { 
    id: 'light-neon', 
    label: 'Neon Màu (Gel)', 
    description: 'Ánh sáng xanh/hồng, hiện đại, tiệc tùng.',
    promptDetail: 'colored gel lighting, dual tone lighting (blue and pink/red), vibrant nightlife atmosphere, artistic and edgy shadows, cyberpunk aesthetic', 
    category: 'lighting' 
  },
  { 
    id: 'light-window', 
    label: 'Cửa Sổ (Window)', 
    description: 'Ánh sáng hắt qua cửa sổ, bóng đổ nhẹ.',
    promptDetail: 'soft natural light streaming through a window, directional but soft shadows, indoor setting, cozy and intimate atmosphere, realistic lighting', 
    category: 'lighting' 
  },

  // --- ANGLE (Góc chụp - 8 options) ---
  { 
    id: 'angle-profile', 
    label: 'Góc Nghiêng (Profile)', 
    description: 'Nhìn ngang, tôn đường nét khuôn mặt.',
    promptDetail: 'side profile shot, silhouette focus, highlighting the nose and jawline, artistic contour, looking sideways, distinct facial profile', 
    category: 'angle' 
  },
  { 
    id: 'angle-dutch', 
    label: 'Nghiêng Khung (Dutch Tilt)', 
    description: 'Khung hình nghiêng, năng động, phá cách.',
    promptDetail: 'Dutch angle shot, tilted camera horizon, dynamic and energetic composition, creating a sense of movement and unease, artistic perspective', 
    category: 'angle' 
  },
  { 
    id: 'angle-overhead', 
    label: 'Từ Đỉnh Đầu (Overhead)', 
    description: 'Chụp thẳng từ trên xuống, nghệ thuật.',
    promptDetail: 'direct overhead shot, bird\'s eye view looking straight down, geometric composition, unique perspective on the outfit layout', 
    category: 'angle' 
  },
  { 
    id: 'angle-low', 
    label: 'Hất Từ Dưới (Low Angle)', 
    description: 'Hack dáng, tăng chiều cao, quyền lực.',
    promptDetail: 'low angle shot, shot from below looking up at the model, hero shot perspective, elongating the legs, making the model look powerful and tall, dramatic perspective', 
    category: 'angle' 
  },
  { 
    id: 'angle-eye', 
    label: 'Ngang Tầm Mắt (Eye Level)', 
    description: 'Góc nhìn tự nhiên, chân thực, trực diện.',
    promptDetail: 'shot at eye level, straight-on angle, neutral perspective, realistic proportions, direct engagement with the viewer, standard fashion portrait', 
    category: 'angle' 
  },
  { 
    id: 'angle-high', 
    label: 'Từ Trên Xuống (High Angle)', 
    description: 'Góc nhìn nghệ thuật, làm mắt to hơn.',
    promptDetail: 'high angle shot, shot from above looking down, emphasizing the face and eyes, artistic composition, slimming effect on the body, editorial vibe', 
    category: 'angle' 
  },
  { 
    id: 'angle-closeup', 
    label: 'Cận Cảnh (Close Up)', 
    description: 'Tập trung vào chi tiết, trang điểm.',
    promptDetail: 'close-up shot, tight framing on the face and shoulders, macro details of fabric and makeup, sharp focus on eyes, bokeh background, intimacy', 
    category: 'angle' 
  },
  { 
    id: 'angle-wide', 
    label: 'Góc Rộng (Wide Shot)', 
    description: 'Lấy toàn bộ cơ thể và bối cảnh.',
    promptDetail: 'wide angle shot, full body visible with significant environmental context, scenic background, sense of scale, dynamic composition', 
    category: 'angle' 
  },

  // --- EXPRESSION (Biểu cảm - 8 options) ---
  { 
    id: 'exp-pout', 
    label: 'Chu Môi (Pouty)', 
    description: 'Môi hờn dỗi, dễ thương hoặc gợi cảm.',
    promptDetail: 'pouty lips, sultry and moody expression, slightly protruding lips, trendy instagram model look, soft gaze', 
    category: 'expression' 
  },
  { 
    id: 'exp-wink', 
    label: 'Nháy Mắt (Winking)', 
    description: 'Tinh nghịch, tán tỉnh, vui vẻ.',
    promptDetail: 'winking one eye, playful and flirty expression, cheeky smile, energetic and fun vibe, capturing a spontaneous moment', 
    category: 'expression' 
  },
  { 
    id: 'exp-surprised', 
    label: 'Ngạc Nhiên (Surprised)', 
    description: 'Mắt mở to, miệng chữ O, ấn tượng.',
    promptDetail: 'surprised expression, wide eyes, slightly open mouth, dynamic reaction, shocked but beautiful, dramatic emotional display', 
    category: 'expression' 
  },
  { 
    id: 'exp-cool', 
    label: 'Lạnh Lùng (Cool/Chic)', 
    description: 'Thần thái người mẫu, không cảm xúc.',
    promptDetail: 'expressionless face, cold and aloof gaze, poker face, high fashion model attitude, chic and sophisticated, slightly parted lips, intense staring', 
    category: 'expression' 
  },
  { 
    id: 'exp-happy', 
    label: 'Vui Tươi (Joyful)', 
    description: 'Cười tươi, năng lượng tích cực.',
    promptDetail: 'big genuine smile, laughing, joyful expression, sparkling eyes, approachable and friendly, positive energy, commercial lifestyle vibe', 
    category: 'expression' 
  },
  { 
    id: 'exp-seductive', 
    label: 'Quyến Rũ (Seductive)', 
    description: 'Ánh mắt thu hút, môi hở nhẹ.',
    promptDetail: 'seductive expression, smizing (smiling with eyes), bedroom eyes, slightly open mouth, alluring and mysterious look, soft facial tension', 
    category: 'expression' 
  },
  { 
    id: 'exp-fierce', 
    label: 'Sắc Sảo (Fierce)', 
    description: 'Mạnh mẽ, quyết liệt, ánh mắt sắc bén.',
    promptDetail: 'fierce expression, intense focus, furrowed brows, strong jawline, confident and dominating look, warrior-like intensity', 
    category: 'expression' 
  },
  { 
    id: 'exp-dreamy', 
    label: 'Mơ Màng (Dreamy)', 
    description: 'Nhẹ nhàng, mắt nhìn xa xăm.',
    promptDetail: 'dreamy expression, soft gaze looking away from camera, relaxed facial muscles, ethereal and romantic mood, peaceful and calm', 
    category: 'expression' 
  },
];

export const NAV_ITEMS = [
  { id: 'extract', label: 'Tách Trang Phục', icon: Shirt, description: 'Tạo ảnh mẫu thiết kế flat-lay' },
  { id: 'try-on', label: 'Thử Đồ (Try-On)', icon: Layout, description: 'Ghép người mẫu và trang phục' },
  { id: 'edit', label: 'Chỉnh Sửa AI', icon: Wand2, description: 'Thay đổi bối cảnh, tư thế' },
  { id: 'upscale', label: 'Upscale & Nét', icon: ZoomIn, description: 'Tăng độ phân giải ảnh' },
  { id: 'admin', label: 'Cài Đặt Admin', icon: Settings, description: 'Quản lý cấu hình' },
];

// --- Aspect Ratio & Resolution Options ---

export const ASPECT_RATIOS = [
  { id: '1:1', label: 'Vuông (1:1) - Instagram/Avatar', prompt: 'composition with square aspect ratio 1:1' },
  { id: '9:16', label: 'Dọc (9:16) - TikTok/Reels/Story', prompt: 'composition with vertical portrait aspect ratio 9:16' },
  { id: '16:9', label: 'Ngang (16:9) - YouTube/Web', prompt: 'composition with wide cinematic aspect ratio 16:9' },
  { id: '4:5', label: 'Chân dung (4:5) - FB/Insta Post', prompt: 'composition with vertical aspect ratio 4:5' },
  { id: '3:4', label: 'Dọc (3:4) - Photo Standard', prompt: 'composition with vertical aspect ratio 3:4' },
];

export const RESOLUTIONS = [
  { id: 'standard', label: 'Tiêu chuẩn (Standard)', prompt: 'standard resolution, clear details' },
  { id: 'high', label: 'Cao (High Quality)', prompt: 'high resolution, 4k, highly detailed textures, sharp focus' },
  { id: 'ultra', label: 'Siêu nét (Ultra HD)', prompt: '8k ultra hd, masterpiece, hyper-realistic, intricate details, professional photography' },
];