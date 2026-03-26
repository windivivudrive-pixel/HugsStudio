import React, { useState, useEffect } from "react";
import { CheckCircle2, AlertCircle, XCircle } from "lucide-react";

interface SeoAnalyzerProps {
  title?: string;
  description?: string;
  content?: string; // HTML string from rich text
  type: "project" | "news";
}

export default function SeoAnalyzer({ title = "", description = "", content = "", type }: SeoAnalyzerProps) {
  const [score, setScore] = useState(0);

  // Content parsing to count words and detect elements
  const stripHtml = (html: string) => {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const wordCount = stripHtml(content).split(/\s+/).filter((word) => word.length > 0).length;
  const hasHeadings = /<h[2-6]/.test(content);
  const hasImages = /<img/.test(content);
  const hasLinks = /<a/.test(content);

  // Checks mapping
  const checks = [
    {
      id: "title-length",
      label: "Độ dài Tiêu đề (40-60 ký tự)",
      test: () => {
        const len = title.trim().length;
        if (len >= 40 && len <= 60) return { status: "pass", score: 20 };
        if (len > 0) return { status: "warn", score: 10 };
        return { status: "fail", score: 0 };
      },
    },
    {
      id: "desc-length",
      label: type === "project" ? "Mô tả ngắn (120-160 ký tự)" : "Có mô tả nội dung",
      test: () => {
        if (type === "project") {
          const len = description.trim().length;
          if (len >= 120 && len <= 160) return { status: "pass", score: 20 };
          if (len > 0) return { status: "warn", score: 10 };
          return { status: "fail", score: 0 };
        } else {
          // For news, description might be part of content SEO checking
          return { status: "pass", score: 20 }; // Auto-pass for news if description isn't a direct field
        }
      },
      hidden: type === "news" // Hide if not applicable
    },
    {
      id: "content-length",
      label: "Độ sâu nội dung (> 300 từ)",
      test: () => {
        if (wordCount >= 300) return { status: "pass", score: 25 };
        if (wordCount >= 100) return { status: "warn", score: 10 };
        return { status: "fail", score: 0 };
      },
    },
    {
      id: "content-headings",
      label: "Sử dụng tiêu đề phân cấp (H2/H3)",
      test: () => {
        if (hasHeadings) return { status: "pass", score: 15 };
        return { status: "warn", score: 0 };
      },
    },
    {
      id: "content-media",
      label: "Chứa hình ảnh/đa phương tiện",
      test: () => {
        if (hasImages) return { status: "pass", score: 10 };
        return { status: "warn", score: 0 };
      },
    },
    {
      id: "content-links",
      label: "Chứa liên kết nội bộ/bên ngoài",
      test: () => {
        if (hasLinks) return { status: "pass", score: 10 };
        return { status: "warn", score: 0 };
      },
    }
  ];

  // Calculate total score
  const results = checks.map(check => ({ ...check, result: check.test() }));
  
  useEffect(() => {
    const total = results.reduce((acc, curr) => acc + curr.result.score, 0);
    // Adjust total to 100% max depending on visible checks
    const maxPossible = checks.filter(c => !c.hidden).reduce((acc, curr) => acc + curr.test().score, 0) || 100;
    // Normalize to 100 base just in case max isn't exactly 100. Actually, let's just make the scores sum to 100.
    // Base max if project: 20+20+25+15+10+10 = 100
    // Base max if news: 20+25+15+10+10 = 80 -> need to normalize or auto-pass. I auto-passed description so max is 100.
    setScore(total);
  }, [title, description, content]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 50) return "text-yellow-500";
    return "text-red-500";
  };
  
  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getIcon = (status: string) => {
    if (status === "pass") return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    if (status === "warn") return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    return <XCircle className="w-4 h-4 text-red-500" />;
  };

  return (
    <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 sticky top-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading font-semibold text-white/80">Trợ lý SEO</h3>
        <div className={`text-3xl font-bold font-heading ${getScoreColor(score)}`}>
          {score}
          <span className="text-sm font-normal text-white/40">/100</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-2 w-full bg-white/5 rounded-full mb-6 overflow-hidden">
        <div 
          className={`h-full transition-all duration-500 ease-out ${getProgressColor(score)}`}
          style={{ width: `${score}%` }}
        />
      </div>

      {/* Checklist */}
      <div className="space-y-3">
        {results.filter(c => !c.hidden).map((check) => (
          <div key={check.id} className="flex items-start gap-3 text-sm">
            <div className="mt-0.5 shrink-0">{getIcon(check.result.status)}</div>
            <div className="text-white/60 leading-tight">
              {check.label}
              {check.id === "content-length" && (
                <span className="block text-xs text-white/30 mt-0.5">({wordCount} từ)</span>
              )}
              {check.id === "title-length" && (
                <span className="block text-xs text-white/30 mt-0.5">({title.trim().length} ký tự)</span>
              )}
               {check.id === "desc-length" && (
                <span className="block text-xs text-white/30 mt-0.5">({description.trim().length} ký tự)</span>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {score < 50 && (
        <div className="mt-6 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-200">
          ⚠️ Điểm SEO quá thấp. Bạn nên tối ưu thêm độ dài câu từ và hình ảnh trước khi xuất bản.
        </div>
      )}
      {score >= 80 && (
        <div className="mt-6 p-3 bg-green-500/10 border border-green-500/20 rounded-xl text-xs text-green-200">
          ✨ Tuyệt vời! Bài viết đã được tối ưu SEO rất tốt.
        </div>
      )}
    </div>
  );
}
