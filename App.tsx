
import React, { useState, useEffect } from 'react';
import { 
  Layout, Shirt, Wand2, ZoomIn, Settings, 
  Menu, X, ChevronRight, Sparkles, Save, Plus, Trash2, ShieldCheck,
  Lock, LogOut, KeyRound, RefreshCw, Monitor, Crop, Copy, Check, Maximize2
} from 'lucide-react';
import { ImageUpload } from './components/ImageUpload';
import { Spinner } from './components/Spinner';
import { processImageWithGemini } from './services/geminiService';
import { NAV_ITEMS, DEFAULT_PRESETS, ASPECT_RATIOS, RESOLUTIONS } from './constants';
import { AppMode, ImageAsset, PresetOption } from './types';

// Bạn có thể thay đổi mã mặc định ở đây
const DEFAULT_ACCESS_CODE = "150113"; 

const App: React.FC = () => {
  // --- Auth State ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessCodeInput, setAccessCodeInput] = useState('');
  const [authError, setAuthError] = useState('');

  // --- App State ---
  const [mode, setMode] = useState<AppMode>(AppMode.EXTRACT);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Assets
  const [inputImage1, setInputImage1] = useState<ImageAsset | null>(null);
  const [inputImage2, setInputImage2] = useState<ImageAsset | null>(null); // For Try-On
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [resultPrompt, setResultPrompt] = useState<string>('');
  const [copySuccess, setCopySuccess] = useState(false);
  
  // Preview State
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  // Processing State
  const [isProcessing, setIsProcessing] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [selectedPresets, setSelectedPresets] = useState<string[]>([]);
  const [activePresetCategory, setActivePresetCategory] = useState<'style' | 'background' | 'pose' | 'lighting' | 'angle' | 'expression'>('style');
  const [strictMode, setStrictMode] = useState(false);
  
  // Output Settings
  const [aspectRatio, setAspectRatio] = useState(ASPECT_RATIOS[0].id);
  const [resolution, setResolution] = useState(RESOLUTIONS[1].id); // Default High
  
  // Admin / Settings State
  const [customPresets, setCustomPresets] = useState<PresetOption[]>(() => {
    const saved = localStorage.getItem('fashionAI_presets');
    return saved ? JSON.parse(saved) : DEFAULT_PRESETS;
  });
  
  // Admin Form State
  const [newPresetName, setNewPresetName] = useState('');
  const [newPresetDescription, setNewPresetDescription] = useState('');
  const [newPresetPrompt, setNewPresetPrompt] = useState('');
  const [newPresetCategory, setNewPresetCategory] = useState<PresetOption['category']>('style');

  // --- Effects ---
  
  // Check Auth on Mount
  useEffect(() => {
    const savedAuth = localStorage.getItem('fashionAI_auth');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('fashionAI_presets', JSON.stringify(customPresets));
  }, [customPresets]);

  // Reset state when changing modes
  useEffect(() => {
    setGeneratedImage(null);
    setResultPrompt('');
    setPrompt('');
    setSelectedPresets([]);
    setStrictMode(false);
    if (mode !== AppMode.TRY_ON) {
        setInputImage2(null);
    }
  }, [mode]);

  // --- Auth Handlers ---

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // FIX: Use type casting (import.meta as any) to bypass TS error "Property 'env' does not exist on type 'ImportMeta'"
    // This checks VITE_ACCESS_CODE (Vercel), then process.env.ACCESS_CODE, then falls back to default.
    const correctCode = (import.meta as any).env?.VITE_ACCESS_CODE || process.env.ACCESS_CODE || DEFAULT_ACCESS_CODE;
    
    if (accessCodeInput === correctCode) {
      setIsAuthenticated(true);
      localStorage.setItem('fashionAI_auth', 'true');
      setAuthError('');
    } else {
      setAuthError('Mã truy cập không đúng. Vui lòng thử lại.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('fashionAI_auth');
    setAccessCodeInput('');
  };

  // --- App Handlers ---
  
  const handleImageSelect = (slot: 1 | 2) => (file: File, base64: string) => {
    const asset: ImageAsset = {
      id: Math.random().toString(36).substring(7),
      file,
      previewUrl: base64,
      base64,
      type: slot === 1 ? 'reference' : 'garment' // simplistic assignment
    };
    if (slot === 1) setInputImage1(asset);
    else setInputImage2(asset);
  };

  const handleGenerate = async () => {
    if (!inputImage1) return;
    if (mode === AppMode.TRY_ON && !inputImage2) {
        alert("Please upload both a model/person image and a clothing image.");
        return;
    }

    setIsProcessing(true);
    setCopySuccess(false);
    
    const imagesToProcess = [inputImage1];
    if (mode === AppMode.TRY_ON && inputImage2) {
        imagesToProcess.push(inputImage2);
    }

    // Gather actual prompt text from preset IDs
    const activePresetDetails = customPresets
        .filter(p => selectedPresets.includes(p.id))
        .map(p => p.promptDetail);
        
    // Get Aspect Ratio and Resolution Prompts
    const selectedRatio = ASPECT_RATIOS.find(r => r.id === aspectRatio)?.prompt || '';
    const selectedRes = RESOLUTIONS.find(r => r.id === resolution)?.prompt || '';

    const result = await processImageWithGemini(
        mode as any,
        imagesToProcess.map(img => ({ base64: img.base64, mimeType: img.file.type })),
        prompt,
        activePresetDetails,
        strictMode,
        selectedRatio,
        selectedRes
    );

    if (result.success && result.imageUrl) {
        setGeneratedImage(result.imageUrl);
        setResultPrompt(result.generatedPrompt || '');
    } else {
        alert(result.error || "Failed to generate image. Please try again.");
    }
    
    setIsProcessing(false);
  };

  const togglePreset = (id: string) => {
    setSelectedPresets(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const addCustomPreset = () => {
    if (!newPresetName || !newPresetPrompt) return;
    const newPreset: PresetOption = {
        id: `custom-${Date.now()}`,
        label: newPresetName,
        description: newPresetDescription,
        promptDetail: newPresetPrompt,
        category: newPresetCategory
    };
    setCustomPresets([...customPresets, newPreset]);
    setNewPresetName('');
    setNewPresetDescription('');
    setNewPresetPrompt('');
  };

  const removePreset = (id: string) => {
    setCustomPresets(customPresets.filter(p => p.id !== id));
  };

  const resetToDefaults = () => {
    if(confirm('Bạn có chắc muốn khôi phục danh sách mặc định?')) {
        setCustomPresets(DEFAULT_PRESETS);
    }
  };

  const downloadImage = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `fashion-ai-${mode}-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  
  const copyPromptToClipboard = () => {
    if (resultPrompt) {
        navigator.clipboard.writeText(resultPrompt);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  // --- Render Views ---

  const renderLoginScreen = () => (
    <div className="flex flex-col items-center justify-center h-screen w-full bg-slate-950 relative overflow-hidden">
       {/* Background Effects */}
       <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-900/20 rounded-full blur-3xl"></div>
       <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-3xl"></div>

       <div className="z-10 w-full max-w-md p-8 bg-slate-900/80 backdrop-blur border border-slate-700 rounded-2xl shadow-2xl">
          <div className="flex flex-col items-center mb-8">
             <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 mb-4">
                <Lock className="text-white w-8 h-8" />
             </div>
             <h1 className="text-2xl font-bold text-white">FashionAI Studio</h1>
             <p className="text-slate-400 text-sm mt-2">Vui lòng nhập mã truy cập để tiếp tục</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
             <div>
               <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                   <KeyRound className="text-slate-500 w-5 h-5" />
                 </div>
                 <input 
                    type="password"
                    value={accessCodeInput}
                    onChange={(e) => setAccessCodeInput(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                    placeholder="Nhập Access Code..."
                    autoFocus
                 />
               </div>
               {authError && <p className="text-red-400 text-xs mt-2 ml-1">{authError}</p>}
             </div>

             <button 
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all hover:shadow-lg hover:shadow-indigo-500/30"
             >
                Truy Cập Ứng Dụng
             </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-xs text-slate-600">
              Liên hệ Admin để được cấp quyền truy cập.
            </p>
          </div>
       </div>
    </div>
  );

  const renderSidebar = () => (
    <div className="h-full flex flex-col py-6 px-4 space-y-2 bg-slate-900 border-r border-slate-800">
        <div className="flex items-center space-x-3 px-2 mb-8">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Sparkles className="text-white w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                FashionAI
            </h1>
        </div>
        
        <nav className="flex-1 space-y-1">
            {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = mode === item.id;
                return (
                    <button
                        key={item.id}
                        onClick={() => {
                            setMode(item.id as AppMode);
                            setMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
                            isActive 
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' 
                            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                        }`}
                    >
                        <Icon size={20} className={isActive ? 'text-white' : 'text-slate-500 group-hover:text-indigo-400'} />
                        <span className="font-medium">{item.label}</span>
                    </button>
                );
            })}
        </nav>

        <div className="pt-4 border-t border-slate-800 mt-2">
             <button 
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-3 py-3 rounded-xl text-slate-400 hover:bg-red-900/20 hover:text-red-400 transition-all"
             >
                <LogOut size={20} />
                <span className="font-medium">Đăng Xuất</span>
             </button>
        </div>

        <div className="px-3 py-4 mt-2 bg-slate-800/50 rounded-xl border border-slate-700/50">
            <p className="text-xs text-slate-500 mb-2">Powered by Gemini 2.5</p>
            <div className="w-full h-1 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full w-2/3 bg-indigo-500"></div>
            </div>
        </div>
    </div>
  );

  // --- Main Views ---

  const renderAdminPanel = () => (
    <div className="p-6 max-w-4xl mx-auto animate-fadeIn pb-20 overflow-y-auto h-full">
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
                <Settings className="mr-2 text-indigo-400" /> Admin Dashboard
            </h2>
            <button 
                onClick={resetToDefaults}
                className="text-xs text-slate-400 hover:text-white border border-slate-700 px-3 py-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
                Khôi phục mặc định
            </button>
        </div>
        
        <div className="grid gap-8">
            {/* Add New Preset */}
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Thêm Tùy Chọn Nhanh (Quick Preset)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">Tên hiển thị (Label)</label>
                        <input 
                            type="text" 
                            value={newPresetName}
                            onChange={(e) => setNewPresetName(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-indigo-500 outline-none placeholder-slate-600"
                            placeholder="Ví dụ: Cyberpunk City"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">Danh mục</label>
                        <select 
                            value={newPresetCategory}
                            onChange={(e) => setNewPresetCategory(e.target.value as any)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-indigo-500 outline-none"
                        >
                            <option value="style">Phong cách (Style)</option>
                            <option value="background">Bối cảnh (Background)</option>
                            <option value="pose">Tư thế (Pose)</option>
                            <option value="lighting">Ánh sáng (Lighting)</option>
                            <option value="angle">Góc chụp (Camera Angle)</option>
                            <option value="expression">Biểu cảm (Expression)</option>
                        </select>
                    </div>
                </div>
                
                <div className="mb-4">
                     <label className="block text-sm text-slate-400 mb-1">Mô tả ngắn / Diễn giải (Hiển thị dưới nút)</label>
                     <input 
                        type="text" 
                        value={newPresetDescription}
                        onChange={(e) => setNewPresetDescription(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-indigo-500 outline-none placeholder-slate-600"
                        placeholder="Ví dụ: Đèn neon, hiện đại, công nghệ cao..."
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm text-slate-400 mb-1">Prompt chi tiết cho AI (Tiếng Anh)</label>
                    <textarea 
                        value={newPresetPrompt}
                        onChange={(e) => setNewPresetPrompt(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-indigo-500 outline-none h-24 placeholder-slate-600"
                        placeholder="Describe the visual effect for the AI in detail..."
                    />
                </div>
                <button 
                    onClick={addCustomPreset}
                    className="flex items-center justify-center w-full md:w-auto px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium"
                >
                    <Plus size={18} className="mr-2" /> Thêm Preset
                </button>
            </div>

            {/* List Existing Presets */}
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Danh Sách Options Hiện Tại</h3>
                <div className="space-y-3">
                    {customPresets.map(preset => (
                        <div key={preset.id} className="flex items-center justify-between bg-slate-900/50 p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors">
                            <div className="flex-1 mr-4">
                                <div className="flex items-center space-x-2 mb-1">
                                    <span className="font-bold text-white">{preset.label}</span>
                                    <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 bg-slate-800 rounded-full text-slate-400">{preset.category}</span>
                                </div>
                                {preset.description && (
                                    <p className="text-sm text-indigo-300 mb-1">{preset.description}</p>
                                )}
                                <p className="text-xs text-slate-500 truncate max-w-md font-mono">{preset.promptDetail}</p>
                            </div>
                            <button 
                                onClick={() => removePreset(preset.id)}
                                className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
                                title="Xóa"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
  );

  const renderWorkspace = () => {
    const activeNavItem = NAV_ITEMS.find(i => i.id === mode);
    
    // Filter presets by active category
    const visiblePresets = customPresets.filter(p => p.category === activePresetCategory);

    return (
        <div className="flex flex-col h-full overflow-y-auto p-4 md:p-8 pb-20">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white">{activeNavItem?.label}</h2>
                    <p className="text-slate-400">{activeNavItem?.description}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
                {/* Left Column: Inputs */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6 shadow-xl">
                        <h3 className="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wider">Ảnh Đầu Vào</h3>
                        
                        <div className="space-y-4">
                            <ImageUpload 
                                label={mode === AppMode.TRY_ON ? "Người Mẫu (Person)" : "Ảnh Gốc"}
                                currentImage={inputImage1}
                                onImageSelect={handleImageSelect(1)}
                                onRemove={() => setInputImage1(null)}
                            />
                            
                            {mode === AppMode.TRY_ON && (
                                <ImageUpload 
                                    label="Trang Phục (Garment)"
                                    currentImage={inputImage2}
                                    onImageSelect={handleImageSelect(2)}
                                    onRemove={() => setInputImage2(null)}
                                />
                            )}
                        </div>
                    </div>

                    <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6 shadow-xl">
                        <h3 className="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wider">Tùy Chọn Nhanh</h3>
                        
                        {/* Category Tabs */}
                        <div className="flex flex-wrap gap-2 mb-4 border-b border-slate-700 pb-2">
                            {[
                                { id: 'style', label: 'Phong cách' },
                                { id: 'background', label: 'Bối cảnh' },
                                { id: 'pose', label: 'Tư thế' },
                                { id: 'lighting', label: 'Ánh sáng' },
                                { id: 'angle', label: 'Góc chụp' },
                                { id: 'expression', label: 'Biểu cảm' }
                            ].map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => setActivePresetCategory(cat.id as any)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-all ${
                                        activePresetCategory === cat.id
                                        ? 'bg-indigo-500 text-white'
                                        : 'text-slate-400 hover:bg-slate-700 hover:text-white'
                                    }`}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                            {visiblePresets.map((preset) => (
                                <button
                                    key={preset.id}
                                    onClick={() => togglePreset(preset.id)}
                                    className={`text-left px-4 py-3 rounded-xl text-sm transition-all relative overflow-hidden flex flex-col items-start border ${
                                        selectedPresets.includes(preset.id)
                                        ? 'bg-indigo-600/20 text-white shadow-lg shadow-indigo-900/40 border-indigo-500'
                                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-600 hover:text-slate-200'
                                    }`}
                                >
                                    <span className="font-bold relative z-10">{preset.label}</span>
                                    {preset.description && (
                                        <span className={`text-xs mt-1 relative z-10 ${selectedPresets.includes(preset.id) ? 'text-indigo-200' : 'text-slate-500'}`}>
                                            {preset.description}
                                        </span>
                                    )}
                                    
                                    {selectedPresets.includes(preset.id) && (
                                        <div className="absolute inset-0 bg-indigo-600/10 pointer-events-none"></div>
                                    )}
                                </button>
                            ))}
                            {visiblePresets.length === 0 && (
                                <p className="text-slate-500 col-span-2 text-center text-sm py-4">Chưa có tùy chọn nào trong mục này.</p>
                            )}
                        </div>

                        <div className="space-y-2 mb-4">
                            <label className="text-sm text-slate-400">Mô tả chi tiết (Prompt bổ sung)</label>
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder={mode === AppMode.EDIT ? "Mô tả chi tiết cần chỉnh sửa..." : "Thêm chi tiết bổ sung..."}
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-white placeholder:text-slate-600 focus:border-indigo-500 outline-none min-h-[80px] resize-none"
                            />
                        </div>

                        {/* --- NEW: Aspect Ratio & Resolution Selectors --- */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                           <div>
                              <label className="flex items-center text-sm text-slate-400 mb-2">
                                 <Crop size={14} className="mr-2" /> Tỉ lệ khung hình
                              </label>
                              <select 
                                value={aspectRatio}
                                onChange={(e) => setAspectRatio(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-3 text-white focus:border-indigo-500 outline-none text-sm appearance-none cursor-pointer"
                              >
                                 {ASPECT_RATIOS.map(r => (
                                    <option key={r.id} value={r.id}>{r.label}</option>
                                 ))}
                              </select>
                           </div>
                           <div>
                              <label className="flex items-center text-sm text-slate-400 mb-2">
                                 <Monitor size={14} className="mr-2" /> Chất lượng & Độ nét
                              </label>
                              <select 
                                value={resolution}
                                onChange={(e) => setResolution(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-3 text-white focus:border-indigo-500 outline-none text-sm appearance-none cursor-pointer"
                              >
                                 {RESOLUTIONS.map(r => (
                                    <option key={r.id} value={r.id}>{r.label}</option>
                                 ))}
                              </select>
                           </div>
                        </div>

                         {/* Strict Mode Checkbox */}
                        <div 
                            className={`flex items-center p-3 rounded-xl border cursor-pointer transition-all ${
                                strictMode 
                                ? 'bg-indigo-900/30 border-indigo-500/50' 
                                : 'bg-slate-900/30 border-slate-700 hover:border-slate-600'
                            }`}
                            onClick={() => setStrictMode(!strictMode)}
                        >
                            <div className={`w-6 h-6 rounded flex items-center justify-center mr-3 border transition-colors ${
                                strictMode 
                                ? 'bg-indigo-600 border-indigo-600 text-white' 
                                : 'bg-slate-800 border-slate-600'
                            }`}>
                                {strictMode && <ShieldCheck size={14} />}
                            </div>
                            <div className="flex flex-col">
                                <span className={`font-medium text-sm ${strictMode ? 'text-white' : 'text-slate-300'}`}>
                                    Tuân thủ tuyệt đối ảnh tham chiếu
                                </span>
                                <span className="text-xs text-slate-500">
                                    Giữ nguyên 100% gương mặt, đặc điểm cơ thể, trang phục và phụ kiện
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={handleGenerate}
                            disabled={!inputImage1 || isProcessing}
                            className={`w-full mt-4 py-4 rounded-xl font-bold text-lg flex items-center justify-center transition-all ${
                                !inputImage1 || isProcessing
                                ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                                : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30 hover:scale-[1.02]'
                            }`}
                        >
                            {isProcessing ? (
                                <>
                                    <Spinner /> <span className="ml-2">Đang Xử Lý...</span>
                                </>
                            ) : (
                                <>
                                    <Sparkles className="mr-2" /> Tạo Ảnh (Generate)
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Right Column: Output */}
                <div className="lg:col-span-7 h-full min-h-[500px] flex flex-col gap-4">
                     {/* Result Container */}
                     <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6 shadow-xl flex flex-col flex-1 min-h-[400px]">
                        <h3 className="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wider flex justify-between items-center">
                            <span>Kết Quả</span>
                            {generatedImage && (
                                <div className="flex items-center space-x-3">
                                     <button 
                                        onClick={handleGenerate}
                                        disabled={isProcessing}
                                        className={`flex items-center px-3 py-1.5 rounded-lg text-xs font-bold uppercase border border-slate-600 hover:border-slate-500 hover:bg-slate-800 transition-all ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'text-slate-300 hover:text-white'}`}
                                    >
                                        <RefreshCw size={14} className={`mr-2 ${isProcessing ? 'animate-spin' : ''}`} /> 
                                        {isProcessing ? 'Đang tạo...' : 'Tạo Lại'}
                                    </button>
                                    <button 
                                        onClick={downloadImage} 
                                        className="flex items-center px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase transition-all shadow-lg shadow-indigo-900/20"
                                    >
                                        <Save size={14} className="mr-2" /> Lưu Ảnh
                                    </button>
                                </div>
                            )}
                        </h3>
                        
                        <div className="flex-1 bg-slate-900/50 rounded-xl border border-slate-800 flex items-center justify-center overflow-hidden relative group min-h-[300px]">
                            {generatedImage ? (
                                <>
                                    <img 
                                        src={generatedImage} 
                                        alt="AI Generated" 
                                        onClick={() => setIsPreviewOpen(true)}
                                        className="w-full h-full object-contain animate-fadeIn cursor-zoom-in"
                                    />
                                    {/* Zoom hint on hover */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-black/20">
                                         <div className="bg-black/50 p-2 rounded-full text-white backdrop-blur-sm">
                                             <Maximize2 size={24} />
                                         </div>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center p-8">
                                    {isProcessing ? (
                                        <div className="flex flex-col items-center space-y-4">
                                            <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
                                            <p className="text-slate-400 animate-pulse">AI đang xử lý...</p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center text-slate-600">
                                            <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                                                <Sparkles size={32} className="text-slate-700" />
                                            </div>
                                            <p className="font-medium">Kết quả sẽ hiển thị tại đây</p>
                                            <p className="text-sm mt-2 max-w-xs">Chọn ảnh, chọn Options và nhấn 'Tạo Ảnh'.</p>
                                        </div>
                                    )}
                                </div>
                            )}
                            
                             {/* Overlay for regeneration state */}
                             {generatedImage && isProcessing && (
                                <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm flex flex-col items-center justify-center z-10 pointer-events-none">
                                    <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-3"></div>
                                    <p className="text-indigo-300 text-sm font-medium animate-pulse">Đang tạo lại...</p>
                                </div>
                             )}
                        </div>
                     </div>

                     {/* Debug / Prompt Display Container - Only show when there is a prompt */}
                     {resultPrompt && (
                         <div className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-xl p-4 animate-fadeIn">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Prompt tham khảo (Debug Info)</h4>
                                <button 
                                    onClick={copyPromptToClipboard}
                                    className={`flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
                                        copySuccess ? 'text-green-400 bg-green-900/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                    }`}
                                >
                                    {copySuccess ? <Check size={12} /> : <Copy size={12} />}
                                    <span>{copySuccess ? 'Đã Copy' : 'Copy'}</span>
                                </button>
                            </div>
                            <div className="bg-black/30 p-3 rounded-lg border border-slate-800/50">
                                <p className="text-xs text-slate-300 font-mono leading-relaxed break-words whitespace-pre-wrap max-h-32 overflow-y-auto">
                                    {resultPrompt}
                                </p>
                            </div>
                         </div>
                     )}
                </div>
            </div>
        </div>
    );
  };

  // --- Logic Switcher: Login vs App ---
  if (!isAuthenticated) {
    return renderLoginScreen();
  }

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 font-sans overflow-hidden">
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 md:hidden" onClick={() => setMobileMenuOpen(false)}></div>
      )}

      {/* Sidebar */}
      <aside className={`fixed md:relative z-50 w-72 h-full transform transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        {renderSidebar()}
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full relative overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4">
             <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                    <Sparkles className="text-white w-4 h-4" />
                </div>
                <span className="font-bold text-white">FashionAI</span>
            </div>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-slate-300">
                {mobileMenuOpen ? <X /> : <Menu />}
            </button>
        </header>

        {/* View Routing */}
        <div className="flex-1 overflow-hidden relative">
             {/* Background Decoration */}
             <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] bg-indigo-900/20 rounded-full blur-3xl"></div>
                <div className="absolute top-[40%] -left-[10%] w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-3xl"></div>
             </div>

             {mode === AppMode.ADMIN ? renderAdminPanel() : renderWorkspace()}
        </div>

        {/* Fullscreen Preview Modal */}
        {isPreviewOpen && generatedImage && (
            <div 
                className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 animate-fadeIn backdrop-blur-sm"
                onClick={() => setIsPreviewOpen(false)}
            >
                <button 
                    onClick={() => setIsPreviewOpen(false)}
                    className="absolute top-6 right-6 p-2 bg-slate-800/50 hover:bg-slate-700 rounded-full text-white transition-all z-50 group"
                >
                    <X size={32} className="group-hover:scale-110 transition-transform" />
                </button>
                <img 
                    src={generatedImage} 
                    alt="Full Preview" 
                    className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                    onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image itself
                />
            </div>
        )}
      </main>
    </div>
  );
};

export default App;
