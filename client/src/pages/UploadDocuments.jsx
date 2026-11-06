import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  X,
  MoreVertical,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  MessageSquare,
} from "lucide-react";
import PageHeader from "../components/common/PageHeader";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import Badge from "../components/common/Badge";
import { documentService } from "../services/documentService";
import { useToast } from "../context/ToastContext";

export default function UploadDocuments() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const fileInputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analyzedDoc, setAnalyzedDoc] = useState(null);
  const [recentDocs, setRecentDocs] = useState(() =>
    documentService.getDocuments().slice(0, 3)
  );

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const validateFile = (file) => {
    const validExtensions = ["pdf", "docx", "txt"];
    const ext = file.name.split(".").pop().toLowerCase();
    if (!validExtensions.includes(ext)) {
      showToast("Only PDF, DOCX, and TXT files are supported.", "error");
      return false;
    }
    // 20MB limit
    if (file.size > 20 * 1024 * 1024) {
      showToast("File size exceeds maximum limit of 20MB.", "error");
      return false;
    }
    return true;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0 && validateFile(files[0])) {
      setSelectedFile(files[0]);
    }
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files.length > 0 && validateFile(files[0])) {
      setSelectedFile(files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(20);

    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 25;
      });
    }, 200);

    try {
      const docResult = await documentService.uploadDocument(selectedFile);
      clearInterval(progressInterval);
      setUploadProgress(100);
      setAnalyzedDoc(docResult);
      showToast(`Document "${selectedFile.name}" analyzed & summarized!`, "success");
      setSelectedFile(null);
      setUploadProgress(0);
      setRecentDocs(documentService.getDocuments().slice(0, 3));
    } catch (err) {
      showToast("Upload failed: " + err.message, "error");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <PageHeader
        title="Upload Documents"
        subtitle="Upload legal or government documents for AI analysis"
        badge={
          <Badge variant="emerald" size="sm">
            AI Analyzer
          </Badge>
        }
      >
        <Link to="/documents">
          <Button variant="outline" size="sm" rightIcon={ArrowRight}>
            View All Documents
          </Button>
        </Link>
      </PageHeader>

      {/* Upload Box matching Reference Image 6 */}
      <Card className="p-8 sm:p-12">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf,.docx,.txt"
          className="hidden"
        />

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !selectedFile && fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
            isDragging
              ? "border-[#15965B] bg-[#15965B]/5 scale-[0.99]"
              : selectedFile
              ? "border-[#15965B]/40 bg-white"
              : "border-[#E5EAE8] bg-[#F5F8F7]/50 hover:bg-[#F5F8F7] hover:border-[#CBD5E1]"
          }`}
        >
          {/* Cloud Icon matching Reference Image 6 */}
          <div className="w-16 h-16 rounded-2xl bg-[#15965B]/10 text-[#15965B] flex items-center justify-center mb-4 shadow-xs">
            <UploadCloud className="w-8 h-8" />
          </div>

          <h3 className="text-base sm:text-lg font-bold text-[#17212B]">
            Drag & drop your files here
          </h3>

          <p className="text-xs sm:text-sm text-[#64748B] mt-1">
            or{" "}
            <span className="text-[#15965B] font-semibold underline underline-offset-2">
              click to browse
            </span>
          </p>

          <p className="text-[11px] text-slate-400 mt-3 font-medium">
            Supports PDF, DOCX, TXT (Max 20MB)
          </p>
        </div>

        {/* Selected File Card Preview */}
        {selectedFile && (
          <div className="mt-6 p-4 rounded-xl border border-[#E5EAE8] bg-[#F5F8F7] animate-in fade-in duration-200">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 truncate">
                <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="truncate">
                  <p className="text-xs font-bold text-[#17212B] truncate">
                    {selectedFile.name}
                  </p>
                  <p className="text-[11px] text-[#64748B]">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready to parse
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedFile(null)}
                  disabled={isUploading}
                  className="p-1 text-slate-400 hover:text-red-500 rounded transition"
                  title="Remove file"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Progress Bar when uploading */}
            {isUploading && (
              <div className="mt-3">
                <div className="flex justify-between text-[11px] font-semibold text-[#17212B] mb-1">
                  <span>Extracting sections & grounding citations...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-[#E5EAE8] rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-[#15965B] h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            <div className="mt-4 flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedFile(null)}
                disabled={isUploading}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleUpload}
                isLoading={isUploading}
                leftIcon={CheckCircle2}
              >
                Upload & Analyze
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* AI Generated Document Summary Card */}
      {analyzedDoc && (
        <Card className="p-6 sm:p-8 border-2 border-[#15965B]/30 bg-white shadow-md animate-in fade-in zoom-in-95 duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E5EAE8]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#15965B]/10 text-[#15965B] flex items-center justify-center shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-[#17212B]">
                    {analyzedDoc.name}
                  </h3>
                  <Badge variant="emerald" size="xs">
                    {analyzedDoc.category}
                  </Badge>
                </div>
                <p className="text-xs text-[#64748B] mt-0.5">
                  {analyzedDoc.size} • {analyzedDoc.pages} {analyzedDoc.pages === 1 ? "Page" : "Pages"} • Analyzed by Gemini AI
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setAnalyzedDoc(null)}
                className="p-1.5 text-slate-400 hover:text-[#17212B] rounded-lg transition"
                title="Dismiss summary"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="mt-5 space-y-4">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#64748B] mb-2 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#15965B]" />
                <span>Executive AI Summary</span>
              </h4>
              <div className="p-4 bg-[#F5F8F7] rounded-xl border border-[#E5EAE8] text-xs sm:text-sm text-[#17212B] leading-relaxed whitespace-pre-line font-normal">
                {analyzedDoc.summary}
              </div>
            </div>

            {/* Key Clauses & Extracted Points */}
            {analyzedDoc.keyPoints && analyzedDoc.keyPoints.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#64748B] mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#15965B]" />
                  <span>Key Provisions & Citizen Clauses</span>
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-[#17212B]">
                  {analyzedDoc.keyPoints.map((point, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 p-2.5 rounded-lg bg-white border border-[#E5EAE8] hover:border-[#15965B]/40 transition"
                    >
                      <span className="w-5 h-5 rounded-full bg-[#15965B]/10 text-[#087443] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Citations Found */}
            {analyzedDoc.citations && analyzedDoc.citations.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#64748B] mb-2 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#15965B]" />
                  <span>Identified Statutory Acts & Provisions</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {analyzedDoc.citations.map((cite, i) => (
                    <span
                      key={i}
                      className="text-xs font-semibold bg-[#15965B]/10 text-[#087443] px-3 py-1 rounded-full border border-[#15965B]/20"
                    >
                      {cite}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Bar */}
            <div className="pt-3 border-t border-[#E5EAE8] flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-[#64748B]">
                This document is now grounded in your civic intelligence context.
              </span>
              <div className="flex items-center gap-2">
                <Link to="/documents">
                  <Button variant="outline" size="sm">
                    View in My Documents
                  </Button>
                </Link>
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={MessageSquare}
                  onClick={() =>
                    navigate("/chat", {
                      state: {
                        initialPrompt: `I would like to consult on my uploaded document: "${analyzedDoc.name}". Here is its summary: ${analyzedDoc.summary}`,
                      },
                    })
                  }
                >
                  Ask Questions in Chat
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Recent Uploads Section matching Reference Image 6 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#17212B]">Recent Uploads</h3>
          <Link
            to="/documents"
            className="text-xs font-semibold text-[#15965B] hover:underline"
          >
            View All ({recentDocs.length})
          </Link>
        </div>

        {recentDocs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E5EAE8] p-8 text-center text-xs text-[#64748B] shadow-xs">
            <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="font-semibold text-[#17212B]">No documents uploaded yet</p>
            <p className="text-[11px] text-[#64748B] mt-0.5">
              Files you upload will appear here for grounding and statutory analysis.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#E5EAE8] divide-y divide-[#E5EAE8] shadow-xs">
            {recentDocs.map((doc) => (
              <div
                key={doc.id}
                className="p-4 flex items-center justify-between gap-4 hover:bg-[#F5F8F7] transition"
              >
                <div className="flex items-center gap-3 truncate">
                  <div className="w-9 h-9 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                    <FileText className="w-4.5 h-4.5" />
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-bold text-[#17212B] truncate">
                      {doc.name}
                    </p>
                    <p className="text-[11px] text-[#64748B] mt-0.5">
                      {doc.size} • Uploaded on {doc.uploadedDate}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-[#087443] bg-[#15965B]/10 px-2 py-0.5 rounded-full">
                    <ShieldCheck className="w-3 h-3 text-[#15965B]" />
                    {doc.status}
                  </span>

                  <button
                    className="p-1.5 text-slate-400 hover:text-[#17212B] rounded-lg transition"
                    title="Document options"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
