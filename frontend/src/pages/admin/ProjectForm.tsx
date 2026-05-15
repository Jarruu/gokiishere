import React, { useState, useEffect, useRef, useActionState, useTransition } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Upload, Plus, Image as ImageIcon, Loader2, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from "motion/react";
import { Button } from '../../components/ui/Button';
import { BrutalistCard } from '../../components/ui/BrutalistCard';
import { useAuth } from '../../lib/auth';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Dropdown } from '../../components/ui/Dropdown';
import { createProject, updateProject, invalidateCache } from '../../lib/api';
import { cn } from '../../lib/utils';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';

const ProjectForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();
  const [isFetching, setIsFetching] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { token } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    category: 'WEB',
    image: '',
    description: '',
    fullContent: '',
    techStack: '',
    completedIn: new Date().getFullYear().toString()
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    if (isEdit) {
      fetchProject();
    }
  }, [id]);

  // Update preview when formData.image changes (e.g. from fetchProject)
  useEffect(() => {
    if (formData.image) {
      setImagePreview(formData.image);
    }
  }, [formData.image]);

  // Cleanup local preview URLs
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const fetchProject = async () => {
    setIsFetching(true);
    try {
      const response = await fetch(`http://localhost:5000/api/projects/${id}`);
      const data = await response.json();
      setFormData({
        ...data,
        techStack: data.techStack.join(', ')
      });
    } catch (error) {
      console.error('Error fetching project:', error);
    } finally {
      setIsFetching(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!supabase) {
        throw new Error('Supabase is not configured. Please check your .env file.');
      }
      
      if (!e.target.files || e.target.files.length === 0) {
        return;
      }

      const file = e.target.files[0];
      
      // Show local preview immediately
      const localUrl = URL.createObjectURL(file);
      setImagePreview(localUrl);
      setUploading(true);
      const uploadToastId = toast.loading('UPLOADING ASSETS...');

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `project-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('projects')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('projects')
        .getPublicUrl(filePath);

      setFormData({ ...formData, image: data.publicUrl });
      setImagePreview(data.publicUrl);
      toast.success('IMAGE UPLOADED SUCCESSFULLY', { id: uploadToastId });
    } catch (error: any) {
      toast.error(`UPLOAD FAILED: ${error.message}`);
      setImagePreview(formData.image || null);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setFormData({ ...formData, image: '' });
    setImagePreview(null);
    toast.info('IMAGE REMOVED FROM FORM');
  };

  // React 19 useActionState for form submission
  const [state, formAction, isPending] = useActionState(async (prevState: any, formDataObj: FormData) => {
    if (!formData.image) {
      toast.error('PLEASE UPLOAD AN IMAGE FIRST');
      return { error: 'Missing image' };
    }

    const processToastId = toast.loading(isEdit ? 'UPDATING PROJECT...' : 'PUBLISHING PROJECT...');

    const payload = {
      ...formData,
      techStack: formData.techStack.split(',').map(s => s.trim()).filter(s => s !== '')
    };

    try {
      if (isEdit) {
        await updateProject(id!, payload);
      } else {
        await createProject(payload);
      }
      
      toast.success(isEdit ? 'PROJECT UPDATED SUCCESSFULLY' : 'PROJECT PUBLISHED SUCCESSFULLY', { id: processToastId });
      navigate('/admin/dashboard');
      return { success: true };
    } catch (error: any) {
      toast.error(error.message || 'ERROR SAVING PROJECT', { id: processToastId });
      return { error: error.message };
    }
  }, null);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => (currentYear - 5 + i).toString()).map(y => ({ label: y, value: y }));

  const categories = [
    { label: "Web Development", value: "WEB" },
    { label: "App Development", value: "APP" },
    { label: "Machine Learning", value: "MACHINE_LEARNING" },
    { label: "Verilog & FSM", value: "VERILOG_FSM" },
    { label: "Arduino & IoT", value: "ARDUINO_IOT" },
    { label: "Algorithm & Flowchart", value: "ALGORITHM_FLOWCHART" },
    { label: "Others", value: "OTHERS" },
  ];

  if (isFetching) {
    return (
      <div className="min-h-screen p-6 md:p-12 lg:p-16 bg-brand-red/5">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 w-48 bg-black/10 mb-8"></div>
            <div className="h-[600px] w-full bg-black/10 border-4 border-black"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-12 lg:p-16 bg-brand-red/5">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="inline-flex items-center gap-2 font-black uppercase mb-8 hover:text-brand-red transition-colors"
        >
          <ArrowLeft size={20} /> Back to Dashboard
        </button>

        <BrutalistCard className="p-8 bg-brand-yellow">
          <div className="mb-10">
            <h1 className="text-4xl font-black uppercase tracking-tighter">
              {isEdit ? 'Edit' : 'Create New'} <span className="text-brand-red">Project</span>
            </h1>
            <p className="font-bold opacity-60">Fill in the technical specifications below</p>
          </div>

          <form action={formAction} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="md:col-span-2">
              <Input 
                label="Project Title"
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="e.g. Advanced AI Dashboard"
              />
            </div>

            <Dropdown 
              label="Category"
              value={formData.category}
              options={categories}
              onChange={(val) => setFormData({...formData, category: val})}
            />

            <Dropdown 
              label="Completed In"
              value={formData.completedIn}
              options={years}
              onChange={(val) => setFormData({...formData, completedIn: val})}
            />

            <div className="md:col-span-2">
              <label className="block text-xs font-black uppercase tracking-widest mb-2">Project Image</label>
              <div className={cn(
                "relative border-2 border-black p-4 bg-brand-red/5 flex flex-col items-center justify-center min-h-[250px] transition-all hover:bg-brand-red/10 overflow-hidden",
                imagePreview && 'border-dashed'
              )}>
                {imagePreview && !uploading && (
                  <div className="absolute inset-0 w-full h-full z-0">
                    <img src={imagePreview} alt="Background Preview" className="w-full h-full object-cover opacity-20 blur-[2px]" />
                  </div>
                )}
                
                <div className="relative z-20 flex flex-col items-center justify-center w-full h-full">
                  {imagePreview ? (
                    <div className="flex flex-col items-center gap-4 w-full max-w-md">
                      <div className="relative w-full aspect-video border-2 border-black overflow-hidden bg-brand-yellow shadow-[8px_8px_0px_0px_var(--color-brand-red)]">
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                        {uploading && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm">
                            <Loader2 className="animate-spin text-brand-yellow" size={32} />
                          </div>
                        )}
                        {!uploading && (
                          <button 
                            type="button"
                            onClick={handleRemoveImage}
                            className="absolute top-2 right-2 bg-brand-red text-brand-yellow p-1 border-2 border-black font-bold hover:bg-black transition-colors"
                            title="Remove Image"
                          >
                            <Plus className="rotate-45" size={16} />
                          </button>
                        )}
                      </div>
                      
                      {!uploading && (
                        <div className="relative group">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          />
                          <Button type="button" variant="secondary" className="text-xs py-2 px-4 shadow-[4px_4px_0px_0px_var(--color-brand-red)] group-hover:shadow-none group-hover:translate-x-[2px] group-hover:translate-y-[2px]">
                            Change Image
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        disabled={uploading}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      {uploading ? (
                        <div className="flex flex-col items-center gap-2">
                          <Loader2 className="animate-spin text-brand-red" size={48} />
                          <span className="font-bold uppercase text-sm">Uploading Technical Assets...</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-3">
                          <div className="p-4 bg-brand-yellow border-2 border-black shadow-[4px_4px_0px_0px_var(--color-brand-red)]">
                            <ImageIcon size={40} />
                          </div>
                          <div className="text-center">
                            <span className="block font-black uppercase text-sm">Drop project screenshot here</span>
                            <span className="text-[10px] font-bold opacity-60 uppercase tracking-widest">Recommended: 16:9 Aspect Ratio</span>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <Input 
                label="Short Description"
                type="text"
                required
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="A brief overview of the project..."
              />
            </div>

            <div className="md:col-span-2">
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-1">
                  <Textarea 
                    label="Full Content (Detailed Explanation)"
                    required
                    rows={12}
                    value={formData.fullContent}
                    onChange={(e) => setFormData({...formData, fullContent: e.target.value})}
                    placeholder="Explain the project in detail, challenges, and solutions... (Supports multiple lines, tabs, and spaces)"
                    className="font-mono text-sm"
                  />
                  <p className="mt-2 text-[10px] font-bold opacity-40 uppercase tracking-widest">
                    Tip: Use the TAB key for indentation. Pressing ENTER will preserve line breaks in the detail view.
                  </p>
                </div>
                
                <div className="flex-1">
                  <label className="block text-xs font-black uppercase tracking-widest mb-2 opacity-40 italic">Live Preview (Content View)</label>
                  <div className="w-full h-full min-h-[250px] lg:min-h-[314px] p-6 border-2 border-black border-dashed bg-black/5 overflow-y-auto">
                    {formData.fullContent ? (
                      <div className="font-bold opacity-80 leading-relaxed text-sm whitespace-pre-wrap font-sans">
                        {formData.fullContent}
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center text-xs font-black uppercase opacity-20 italic">
                        Input text to preview formatting...
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <Input 
                label="Tech Stack (comma separated)"
                type="text"
                required
                value={formData.techStack}
                onChange={(e) => setFormData({...formData, techStack: e.target.value})}
                placeholder="React, TypeScript, Node.js, ..."
              />
            </div>

            <div className="md:col-span-2 pt-4">
              <Button
                type="submit"
                variant="primary"
                className="w-full py-6 text-xl"
                disabled={isPending || uploading}
              >
                {isPending ? 'Processing...' : (isEdit ? 'UPDATE PROJECT' : 'PUBLISH PROJECT')}
              </Button>
            </div>
          </form>
        </BrutalistCard>
      </div>
    </div>
  );
};

export default ProjectForm;
