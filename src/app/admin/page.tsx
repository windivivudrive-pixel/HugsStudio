"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import dynamic from "next/dynamic";
import { createProject, createNews, uploadSingleFileAction, validateAdminLogin, getAdminProjects, getAdminNews, deleteProject, deleteNews, updateProject, updateNews } from "./actions";
import { databases, APPWRITE_CONFIG } from "@/lib/appwrite";
import { Query } from "appwrite";
import { Loader2, AlertCircle, LogOut, Edit2, Trash2, ExternalLink } from "lucide-react";
import SeoAnalyzer from "@/components/SeoAnalyzer";
import imageCompression from "browser-image-compression";

// Dynamically import react-quill-new to avoid SSR issues
const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import("react-quill-new");
    return function comp({ forwardedRef, ...props }: any) {
      return <RQ ref={forwardedRef} {...props} />;
    };
  },
  { ssr: false }
);

import "react-quill-new/dist/quill.snow.css";


export default function AdminPage() {
  const [user, setUser] = useState<any>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [activeTab, setActiveTab] = useState<"projects" | "news">("projects");
  const [showForm, setShowForm] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error" | null, message: string }>({ type: null, message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [categories, setCategories] = useState<{ id: string, name: string }[]>([]);
  const [fullDescription, setFullDescription] = useState("");
  const [newsContent, setNewsContent] = useState("");

  const [projectsList, setProjectsList] = useState<any[]>([]);
  const [newsList, setNewsList] = useState<any[]>([]);
  const [isLoadingLists, setIsLoadingLists] = useState(false);
  const [editingDoc, setEditingDoc] = useState<any>(null);

  // States for real-time SEO analysis
  const [currentTitle, setCurrentTitle] = useState("");
  const [currentDescription, setCurrentDescription] = useState("");

  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [existingGallery, setExistingGallery] = useState<string[]>([]);

  const projectQuillRef = useRef<any>(null);
  const newsQuillRef = useRef<any>(null);

  const loadLists = async () => {
    if (!user) return;
    setIsLoadingLists(true);
    try {
      if (activeTab === "projects") {
        const res = await getAdminProjects();
        if (res.success) setProjectsList(res.projects || []);
        else setStatus({ type: "error", message: "Không thể lấy danh sách dự án: " + res.error });
      } else if (activeTab === "news") {
        const res = await getAdminNews();
        if (res.success) setNewsList(res.news || []);
        else setStatus({ type: "error", message: "Không thể lấy danh sách tin tức: " + res.error });
      }
    } catch (err: any) {
      setStatus({ type: "error", message: "Lỗi hệ thống khi tải danh sách: " + err.message });
    } finally {
      setIsLoadingLists(false);
    }
  };

  useEffect(() => {
    if (!showForm && !editingDoc) {
      loadLists();
    }
  }, [activeTab, user, showForm, editingDoc]);

  const handleEditProject = (doc: any) => {
    setEditingDoc(doc);
    setShowForm(true);
    setFullDescription(doc.fullDescription || "");
    setCurrentTitle(doc.title || "");
    setCurrentDescription(doc.description || "");
    setGalleryFiles([]);
    setExistingGallery(doc.gallery || []);
    setStatus({ type: null, message: "" });
  };

  const handleEditNews = (doc: any) => {
    setEditingDoc(doc);
    setShowForm(true);
    setNewsContent(doc.content || "");
    setCurrentTitle(doc.title || "");
    setStatus({ type: null, message: "" });
  };

  const handleDeleteProject = async (id: string) => {
    if (!window.confirm("Bạn có chắc muốn xoá dự án này không?")) return;
    const res = await deleteProject(id);
    if (res.success) loadLists();
    else alert("Xoá thất bại: " + res.error);
  };

  const handleDeleteNews = async (id: string) => {
    if (!window.confirm("Bạn có chắc muốn xoá tin tức này không?")) return;
    const res = await deleteNews(id);
    if (res.success) loadLists();
    else alert("Xoá thất bại: " + res.error);
  };

  // Helper to upload image to R2 and return URL
  const uploadImageToR2 = async (file: File) => {
    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(file, options);
      const formData = new FormData();
      formData.append("file", compressedFile, file.name || "image.png");
      const res = await uploadSingleFileAction(formData);
      if (res.success && res.url) return res.url;
      throw new Error(res.error || "Upload failed");
    } catch (err: any) {
      console.error("Image upload/compression failed:", err);
      throw err;
    }
  };

  // Custom Image Handler for Quill toolbar
  const imageHandler = (quillRef: any) => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (file) {
        try {
          const url = await uploadImageToR2(file);
          const quill = quillRef.current.getEditor();
          const range = quill.getSelection();
          quill.insertEmbed(range.index, "image", url);
        } catch (e) {
          console.error("Image upload failed:", e);
          alert("Lỗi upload hình ảnh!");
        }
      }
    };
  };

  const quillModules = useMemo(() => ({
    toolbar: {
      container: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ color: [] }, { background: [] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
        [{ align: [] }],
        ["link", "image", "video"],
        ["clean"],
      ],
      handlers: {
        image: function() {
           // We need a standard way but since it's inside useMemo, 
           // we'll handle it via refs in actual component
        }
      }
    },
  }), []);

  // Use a hacky way to override the handlers after mount due to dynamic import
  useEffect(() => {
    if (projectQuillRef.current) {
        const toolbar = projectQuillRef.current.getEditor().getModule('toolbar');
        toolbar.addHandler('image', () => imageHandler(projectQuillRef));
    }
    if (newsQuillRef.current) {
        const toolbar = newsQuillRef.current.getEditor().getModule('toolbar');
        toolbar.addHandler('image', () => imageHandler(newsQuillRef));
    }
  }, [activeTab]);

  // Handle Paste events for images
  useEffect(() => {
    const handlePaste = async (e: ClipboardEvent, quillRef: any) => {
        const items = e.clipboardData?.items;
        if (!items) return;

        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf("image") !== -1) {
                const file = items[i].getAsFile();
                if (file) {
                  // Prevent default paste to handle ourselves
                  e.preventDefault();
                  try {
                    const url = await uploadImageToR2(file);
                    const quill = quillRef.current.getEditor();
                    const range = quill.getSelection() || { index: quill.getLength() };
                    quill.insertEmbed(range.index, "image", url);
                  } catch (err) {
                    console.error("Paste upload failed:", err);
                  }
                }
            }
        }
    };

    // Attach to root elements on next tick
    const timer = setTimeout(() => {
        if (projectQuillRef.current) {
            projectQuillRef.current.getEditor().root.addEventListener('paste', (e: ClipboardEvent) => handlePaste(e, projectQuillRef));
        }
        if (newsQuillRef.current) {
            newsQuillRef.current.getEditor().root.addEventListener('paste', (e: ClipboardEvent) => handlePaste(e, newsQuillRef));
        }
    }, 1000);

    return () => clearTimeout(timer);
  }, [activeTab]);

  const fetchCategories = async () => {
    try {
      const response = await databases.listDocuments(
        APPWRITE_CONFIG.DATABASE_ID,
        'categories',
        [Query.limit(100)]
      );
      setCategories(response.documents.map(doc => ({ id: doc.$id, name: doc.name })));
    } catch (e) {
      console.error("Failed to fetch categories:", e);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("hugs_admin_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      fetchCategories();
    }
    setIsCheckingAuth(false);
  }, []);


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError("");
    try {
      const result = await validateAdminLogin(loginUsername, loginPassword);
      
      if (!result.success || !result.user) {
        throw new Error(result.error || "Đăng nhập thất bại");
      }

      // Store in localStorage for persistence
      localStorage.setItem("hugs_admin_user", JSON.stringify(result.user));
      setUser(result.user);
      fetchCategories();
    } catch (err: any) {
      setLoginError(err.message || "Đăng nhập thất bại");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem("hugs_admin_user");
      setUser(null);
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  async function handleProjectSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setIsSubmitting(true);
    setStatus({ type: null, message: "" });
    try {
      const formData = new FormData(form);
      
      const imageFile = formData.get("image") as File;
      if (imageFile && imageFile.size > 0) {
        try {
          const options = { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true };
          const compressedFile = await imageCompression(imageFile, options);
          formData.set("image", compressedFile, imageFile.name);
        } catch (error) {
          console.error("Error compressing cover image:", error);
        }
      }

      // Upload gallery files
      const uploadedGalleryUrls = [];
      if (galleryFiles.length > 0) {
        setStatus({ type: "success", message: `Đang tải lên ${galleryFiles.length} hình ảnh gallery...` });
        try {
          const urls = await Promise.all(galleryFiles.map(file => uploadImageToR2(file)));
          uploadedGalleryUrls.push(...urls);
        } catch (err) {
          console.error("Error uploading gallery images:", err);
          setStatus({ type: "error", message: "Lỗi khi upload hình ảnh gallery!" });
          setIsSubmitting(false);
          return;
        }
      }
      
      const finalGallery = [...existingGallery, ...uploadedGalleryUrls];
      if (finalGallery.length > 0) {
        formData.set("gallery", JSON.stringify(finalGallery));
      }

      formData.set("fullDescription", fullDescription);
      
      let result;
      if (editingDoc) {
         result = await updateProject(editingDoc.$id, formData);
      } else {
         result = await createProject(formData);
      }
      
      if (result.success) {
          setStatus({ type: "success", message: editingDoc ? "🎉 Project updated successfully!" : "🎉 Project created successfully!" });
          if (!editingDoc) {
            form.reset();
            setFullDescription("");
            setCurrentTitle("");
            setCurrentDescription("");
            setGalleryFiles([]);
            setExistingGallery([]);
          }
          // Reset form view after success
          setTimeout(() => {
            setEditingDoc(null);
            setShowForm(false);
            setGalleryFiles([]);
            setExistingGallery([]);
          }, 1500);
      } else {
          setStatus({ type: "error", message: result.error || "Failed to process project." });
      }
    } catch (e: any) {
      setStatus({ type: "error", message: e.message || "An unexpected error occurred." });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleNewsSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setIsSubmitting(true);
    setStatus({ type: null, message: "" });
    try {
      const formData = new FormData(form);

      const imageFile = formData.get("image") as File;
      if (imageFile && imageFile.size > 0) {
        try {
          const options = { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true };
          const compressedFile = await imageCompression(imageFile, options);
          formData.set("image", compressedFile, imageFile.name);
        } catch (error) {
          console.error("Error compressing cover image:", error);
        }
      }

      formData.set("content", newsContent);
      
      let result;
      if (editingDoc) {
         result = await updateNews(editingDoc.$id, formData);
      } else {
         result = await createNews(formData);
      }
      
      if (result.success) {
          setStatus({ type: "success", message: editingDoc ? "🎉 News updated successfully!" : "🎉 News created successfully!" });
          if (!editingDoc) {
            form.reset();
            setNewsContent("");
            setCurrentTitle("");
          }
          // Reset form view after success
          setTimeout(() => {
            setEditingDoc(null);
            setShowForm(false);
          }, 1500);
      } else {
          setStatus({ type: "error", message: result.error || "Failed to process news." });
      }
    } catch (e: any) {
      setStatus({ type: "error", message: e.message || "An unexpected error occurred." });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[#0c0c0c] flex items-center justify-center">
        <div className="text-white/50 flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin" />
          <p>Đang kiểm tra quyền truy cập...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0c0c0c] text-white p-6 md:p-12 font-body flex items-center justify-center">
        <div className="max-w-md w-full bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-md">
          <div className="text-center mb-8">
            <h1 className="font-heading text-3xl font-bold text-white mb-2">Đăng Nhập Quản Trị</h1>
            <p className="text-white/60 text-sm">Vui lòng đăng nhập để vào HUGs STUDIO Admin</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Tên Đăng Nhập (Username)</label>
              <input 
                type="text" 
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors"
                autoComplete="username"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Mật Khẩu</label>
              <input 
                type="password" 
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors"
                autoComplete="current-password"
                required
              />
            </div>

            {loginError && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-sm flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoggingIn}
              className="w-full bg-white text-black hover:bg-white/90 disabled:opacity-50 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
            >
              {isLoggingIn ? <Loader2 className="w-5 h-5 animate-spin" /> : "Đăng Nhập"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0c0c0c] text-white pt-32 pb-24 px-6 relative z-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">HUGs Admin</h1>
            <p className="text-white/60 text-lg font-body">Quản lý nội dung cho Portfolio & Blog.</p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all text-sm group"
          >
            <LogOut className="w-4 h-4 text-white/50 group-hover:text-white transition-colors" />
            <span className="text-white/50 group-hover:text-white transition-colors">Đăng xuất</span>
          </button>
        </div>
        
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-white/10 pb-4">
          <button
            onClick={() => { setActiveTab("projects"); setShowForm(false); setEditingDoc(null); setStatus({ type: null, message: "" }); setGalleryFiles([]); setExistingGallery([]); }}
            className={`px-6 py-2 font-heading tracking-wide transition-colors ${activeTab === "projects" ? "text-white border-b-2 border-white" : "text-ash hover:text-white"}`}
          >
            Dự án
          </button>
          <button
            onClick={() => { setActiveTab("news"); setShowForm(false); setEditingDoc(null); setStatus({ type: null, message: "" }); setGalleryFiles([]); setExistingGallery([]); }}
            className={`px-6 py-2 font-heading tracking-wide transition-colors ${activeTab === "news" ? "text-white border-b-2 border-white" : "text-ash hover:text-white"}`}
          >
            Tin tức
          </button>
        </div>

        {/* Status Message */}
        {status.message && (
          <div className={`p-4 rounded-xl mb-8 ${status.type === "success" ? "bg-green-500/20 text-green-200 border border-green-500/30" : "bg-red-500/20 text-red-200 border border-red-500/30"}`}>
            {status.message}
          </div>
        )}

        {/* Projects View */}
        {activeTab === "projects" && (
          <div className="space-y-6">
            {!showForm && !editingDoc ? (
              <>
                <div className="flex justify-between items-center bg-white/5 p-6 rounded-2xl border border-white/10 mb-4 text-white">
                   <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                        <Edit2 className="w-5 h-5 text-white/50" />
                     </div>
                     <h2 className="text-xl font-heading font-semibold">Danh sách Dự án</h2>
                   </div>
                   <button 
                    onClick={() => { 
                      setShowForm(true); 
                      setEditingDoc(null); 
                      setStatus({ type: null, message: "" }); 
                      setGalleryFiles([]); 
                      setExistingGallery([]);
                      setFullDescription("");
                      setCurrentTitle("");
                      setCurrentDescription("");
                    }}
                    className="px-5 py-2.5 bg-white text-black rounded-full font-heading font-bold hover:bg-white-dim transition-all flex items-center gap-2"
                   >
                    + Thêm Dự án Mới
                   </button>
                </div>

                {isLoadingLists ? (
                  <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-white/50" /></div>
                ) : projectsList.length === 0 ? (
                  <div className="text-center p-8 text-white/50 bg-white/5 rounded-2xl border border-white/10">Chưa có dự án nào.</div>
                ) : (
                  <div className="grid gap-4">
                    {projectsList.map((project) => (
                      <div key={project.$id} className="flex flex-col sm:flex-row items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl gap-4">
                        <div className="flex items-center gap-4 w-full sm:w-auto">
                          {project.image && <img src={project.image} alt="" className="w-16 h-16 object-cover rounded-lg shrink-0" />}
                          <div className="min-w-0">
                            <h3 className="font-heading font-semibold text-lg line-clamp-1">{project.title}</h3>
                            <p className="text-sm text-white/50">{project.category} • {project.year}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <a href={`/project/${project.slug}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/50 hover:text-white transition-colors" title="View live">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                          <button onClick={() => handleEditProject(project)} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/50 hover:text-white transition-colors" title="Edit">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDeleteProject(project.$id)} className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-red-500 transition-colors" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="space-y-6">
                <button 
                  onClick={() => { setShowForm(false); setEditingDoc(null); setStatus({ type: null, message: "" }); }}
                  className="mb-4 text-white/50 hover:text-white transition-colors flex items-center gap-2"
                >
                  ← Quay lại danh sách
                </button>
                <form key={editingDoc?.$id || "new-project"} onSubmit={handleProjectSubmit} className="space-y-6 bg-white/5 p-8 rounded-2xl border border-white/10">
                  {editingDoc ? (
                    <h2 className="text-xl font-heading mb-4 text-white/80 border-b border-white/10 pb-2">Đang chỉnh sửa dự án: {editingDoc.title}</h2>
                  ) : (
                    <h2 className="text-xl font-heading mb-4 text-white/80 border-b border-white/10 pb-2">Thêm dự án mới</h2>
                  )}
                  
                  <div className="flex flex-col xl:flex-row gap-8">
                    <div className="flex-1 space-y-6">
                      <input type="hidden" name="existingImage" value={editingDoc?.image || ""} />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                          <label className="text-sm font-medium text-ash">Title</label>
                          <input required type="text" name="title" value={currentTitle} onChange={e => setCurrentTitle(e.target.value)} placeholder="Project Title" className="bg-[#141414] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-white/40" />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-sm font-medium text-ash">Category</label>
                          <select required name="category" defaultValue={editingDoc?.category} className="bg-[#141414] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-white/40">
                            <option value="">Select a category</option>
                            {categories.map(cat => (
                              <option key={cat.id} value={cat.name}>{cat.name}</option>
                            ))}
                          </select>
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-sm font-medium text-ash">Year</label>
                          <input required type="text" name="year" defaultValue={editingDoc?.year} placeholder="e.g. 2024" className="bg-[#141414] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-white/40" />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-sm font-medium text-ash">Cover Image (Upload to Cloudflare R2)</label>
                          {editingDoc?.image && <div className="mb-2"><img src={editingDoc.image} alt="Current" className="w-16 h-16 object-cover rounded" /></div>}
                          <input type="file" required={!editingDoc} name="image" accept="image/*" className="bg-[#141414] border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-white/40 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-white file:text-black hover:file:bg-gray-200" />
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2">
                          <label className="text-sm font-medium text-ash">Short Description (Meta Description)</label>
                          <textarea required name="description" value={currentDescription} onChange={e => setCurrentDescription(e.target.value)} rows={2} className="bg-[#141414] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-white/40 resize-none"></textarea>
                      </div>
                      
                      <div className="flex flex-col gap-2 text-white relative z-0">
                          <label className="text-sm font-medium text-ash">Project Gallery Images (Multiple)</label>
                          <div className="bg-[#141414] border border-dashed border-white/20 hover:border-white/40 transition-colors rounded-xl p-6 relative flex flex-col items-center justify-center min-h-[150px]">
                            <p className="text-white/50 text-center mb-4">Drag and drop images here, or click to select files</p>
                            <input 
                              type="file" 
                              multiple 
                              accept="image/*" 
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              onChange={(e) => {
                                if (e.target.files) {
                                  setGalleryFiles(prev => [...prev, ...Array.from(e.target.files as FileList)]);
                                }
                              }} 
                            />
                            
                            {/* Existing Images */}
                            {existingGallery.length > 0 && (
                                <div className="w-full mb-4">
                                  <h4 className="text-xs font-semibold text-white/40 mb-2 uppercase tracking-wide">Existing Images</h4>
                                  <div className="flex flex-wrap gap-3">
                                    {existingGallery.map((url, i) => (
                                      <div key={`existing-${i}`} className="relative group w-20 h-20 rounded-md overflow-hidden bg-black/50 border border-white/10">
                                        <img src={url} alt="" className="w-full h-full object-cover" />
                                        <button 
                                          type="button" 
                                          onClick={(e) => { e.preventDefault(); setExistingGallery(prev => prev.filter((_, idx) => idx !== i)); }}
                                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                          <Trash2 className="w-3 h-3" />
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                            )}

                            {/* Pending Images */}
                            {galleryFiles.length > 0 && (
                                <div className="w-full max-h-48 overflow-y-auto mt-2">
                                  <h4 className="text-xs font-semibold text-blue-400 mb-2 uppercase tracking-wide">Pending Uploads ({galleryFiles.length})</h4>
                                  <div className="flex flex-wrap gap-3">
                                    {galleryFiles.map((file, i) => (
                                      <div key={`pending-${i}`} className="relative group w-20 h-20 rounded-md overflow-hidden bg-black/50 border border-blue-500/30">
                                        <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                                        <button 
                                          type="button" 
                                          onClick={(e) => { e.preventDefault(); setGalleryFiles(prev => prev.filter((_, idx) => idx !== i)); }}
                                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-100"
                                        >
                                          <Trash2 className="w-3 h-3" />
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                            )}
                          </div>
                      </div>

                      <div className="flex flex-col gap-2 text-black relative z-0">
                          <label className="text-sm font-medium text-white/60">Full Content</label>
                          <div className="bg-white rounded-lg overflow-hidden">
                            <ReactQuill 
                              theme="snow" 
                              value={fullDescription} 
                              onChange={setFullDescription} 
                              forwardedRef={projectQuillRef}
                              modules={quillModules}
                              className="h-[400px] pb-10"
                            />
                          </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                        <div className="flex flex-col gap-2">
                          <label className="text-sm font-medium text-ash">Tags (comma separated)</label>
                          <input type="text" name="tags" defaultValue={editingDoc?.tags} placeholder="UI/UX, Danh thiếp" className="bg-[#141414] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-white/40" />
                        </div>
                      </div>

                      <div className="flex items-center gap-3 mt-4 bg-[#141414] p-4 rounded-xl border border-white/10">
                        <input type="checkbox" id="isFavorite" name="isFavorite" defaultChecked={editingDoc?.isFavorite} className="w-5 h-5 accent-white rounded" />
                        <label htmlFor="isFavorite" className="text-white font-medium cursor-pointer">
                          🌟 Make Favorite (Show on Homepage showcase)
                        </label>
                      </div>

                      <button disabled={isSubmitting} type="submit" className="w-full bg-white text-black font-heading font-semibold py-4 rounded-xl hover:bg-white-dim transition-colors mt-4 disabled:opacity-50">
                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : editingDoc ? "Update Project" : "Submit Project"}
                      </button>
                    </div>

                    {/* SEO Analyzer Sidebar */}
                    <div className="w-full xl:w-80 shrink-0">
                       <SeoAnalyzer 
                          title={currentTitle} 
                          description={currentDescription} 
                          content={fullDescription} 
                          type="project"
                       />
                    </div>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* News View */}
        {activeTab === "news" && (
          <div className="space-y-6">
            {!showForm && !editingDoc ? (
              <>
                <div className="flex justify-between items-center bg-white/5 p-6 rounded-2xl border border-white/10 mb-4 text-white">
                   <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                        <ExternalLink className="w-5 h-5 text-white/50" />
                     </div>
                     <h2 className="text-xl font-heading font-semibold">Danh sách Tin tức</h2>
                   </div>
                   <button 
                    onClick={() => { 
                      setShowForm(true); 
                      setEditingDoc(null); 
                      setStatus({ type: null, message: "" });
                      setNewsContent("");
                      setCurrentTitle("");
                    }}
                    className="px-5 py-2.5 bg-white text-black rounded-full font-heading font-bold hover:bg-white-dim transition-all flex items-center gap-2"
                   >
                    + Thêm Tin tức Mới
                   </button>
                </div>

                {isLoadingLists ? (
                  <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-white/50" /></div>
                ) : newsList.length === 0 ? (
                  <div className="text-center p-8 text-white/50 bg-white/5 rounded-2xl border border-white/10">Chưa có bài viết nào.</div>
                ) : (
                  <div className="grid gap-4">
                    {newsList.map((article) => (
                      <div key={article.$id} className="flex flex-col sm:flex-row items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl gap-4">
                        <div className="flex items-center gap-4 w-full sm:w-auto">
                          {article.image && <img src={article.image} alt="" className="w-16 h-16 object-cover rounded-lg shrink-0" />}
                          <div className="min-w-0">
                            <h3 className="font-heading font-semibold text-lg line-clamp-1">{article.title}</h3>
                            <p className="text-sm text-white/50">{article.category} • {article.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <a href={`/news/${article.slug}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/50 hover:text-white transition-colors" title="View live">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                          <button onClick={() => handleEditNews(article)} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/50 hover:text-white transition-colors" title="Edit">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDeleteNews(article.$id)} className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-red-500 transition-colors" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="space-y-6">
                <button 
                  onClick={() => { setShowForm(false); setEditingDoc(null); setStatus({ type: null, message: "" }); }}
                  className="mb-4 text-white/50 hover:text-white transition-colors flex items-center gap-2"
                >
                  ← Quay lại danh sách
                </button>
                <form key={editingDoc?.$id || "new-news"} onSubmit={handleNewsSubmit} className="space-y-6 bg-white/5 p-8 rounded-2xl border border-white/10">
                  {editingDoc ? (
                    <h2 className="text-xl font-heading mb-4 text-white/80 border-b border-white/10 pb-2">Đang chỉnh sửa tin tức: {editingDoc.title}</h2>
                  ) : (
                    <h2 className="text-xl font-heading mb-4 text-white/80 border-b border-white/10 pb-2">Thêm tin tức mới</h2>
                  )}

                  <div className="flex flex-col xl:flex-row gap-8">
                    <div className="flex-1 space-y-6">
                      <input type="hidden" name="existingImage" value={editingDoc?.image || ""} />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                          <label className="text-sm font-medium text-ash">Title</label>
                          <input required type="text" name="title" value={currentTitle} onChange={e => setCurrentTitle(e.target.value)} placeholder="News Title" className="bg-[#141414] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-white/40" />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-sm font-medium text-ash">Date</label>
                          <input required type="text" name="date" defaultValue={editingDoc?.date} placeholder="e.g. Jun 9, 2025" className="bg-[#141414] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-white/40" />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-sm font-medium text-ash">Category</label>
                          <select required name="category" defaultValue={editingDoc?.category} className="bg-[#141414] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-white/40">
                            <option value="">Select a category</option>
                            {categories.map(cat => (
                              <option key={cat.id} value={cat.name}>{cat.name}</option>
                            ))}
                          </select>
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-sm font-medium text-ash">Cover Image (Upload to Cloudflare R2)</label>
                          {editingDoc?.image && <div className="mb-2"><img src={editingDoc.image} alt="Current" className="w-16 h-16 object-cover rounded" /></div>}
                          <input type="file" required={!editingDoc} name="image" accept="image/*" className="bg-[#141414] border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-white/40 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-white file:text-black hover:file:bg-gray-200" />
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 text-black relative z-0">
                          <label className="text-sm font-medium text-white/60">Content</label>
                          <div className="bg-white rounded-lg overflow-hidden">
                            <ReactQuill 
                              theme="snow" 
                              value={newsContent} 
                              onChange={setNewsContent} 
                              forwardedRef={newsQuillRef}
                              modules={quillModules}
                              className="h-[400px] pb-10"
                            />
                          </div>
                      </div>

                      <button disabled={isSubmitting} type="submit" className="w-full bg-white text-black font-heading font-semibold py-4 rounded-xl hover:bg-white-dim transition-colors mt-4 disabled:opacity-50">
                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : editingDoc ? "Update News" : "Submit News"}
                      </button>
                    </div>

                    {/* SEO Analyzer Sidebar */}
                    <div className="w-full xl:w-80 shrink-0">
                       <SeoAnalyzer 
                          title={currentTitle} 
                          content={newsContent} 
                          type="news"
                       />
                    </div>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
