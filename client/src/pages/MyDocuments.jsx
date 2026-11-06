import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FileText,
  Download,
  Trash2,
  Eye,
  UploadCloud,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  MessageSquare,
} from "lucide-react";
import PageHeader from "../components/common/PageHeader";
import Button from "../components/common/Button";
import SearchBar from "../components/common/SearchBar";
import Badge from "../components/common/Badge";
import Modal from "../components/common/Modal";
import ConfirmDialog from "../components/common/ConfirmDialog";
import EmptyState from "../components/common/EmptyState";
import { documentService } from "../services/documentService";
import { useToast } from "../context/ToastContext";

export default function MyDocuments() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [documents, setDocuments] = useState(() => documentService.getDocuments());
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewDoc, setViewDoc] = useState(null);
  const [docToDelete, setDocToDelete] = useState(null);

  useEffect(() => {
    let isMounted = true;
    documentService.fetchDocumentsFromServer().then((docs) => {
      if (isMounted && docs && docs.length > 0) {
        setDocuments(docs);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.category?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || doc.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const handleDelete = async () => {
    if (!docToDelete) return;
    try {
      await documentService.deleteDocument(docToDelete.id);
      setDocuments(documentService.getDocuments());
      showToast(`Document "${docToDelete.name}" deleted.`, "info");
      setDocToDelete(null);
    } catch (err) {
      showToast("Failed to delete document: " + err.message, "error");
    }
  };

  const handleDownload = (doc) => {
    showToast(`Downloading demo copy of ${doc.name}...`, "info");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Documents"
        subtitle="View and manage your uploaded documents"
        badge={
          <Badge variant="blue" size="sm">
            {documents.length} Files
          </Badge>
        }
      >
        <Link to="/documents/upload">
          <Button variant="primary" size="sm" leftIcon={UploadCloud}>
            Upload Document
          </Button>
        </Link>
      </PageHeader>

      {/* Search and Filters matching Reference Image 7 */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <SearchBar
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search documents..."
          className="flex-1 max-w-md"
        />

        <div className="flex items-center gap-2">
          {["all", "processed", "indexed"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition ${
                statusFilter === st
                  ? "bg-[#15965B] text-white shadow-xs"
                  : "bg-white text-[#64748B] hover:text-[#17212B] border border-[#E5EAE8]"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Documents List matching Reference Image 7 */}
      {filteredDocs.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No documents found"
          description={
            searchQuery
              ? `No documents match "${searchQuery}". Try different keywords.`
              : "You haven't uploaded any legal or civic documents yet."
          }
          actionLabel="Upload First Document"
          onAction={() => (window.location.href = "/documents/upload")}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-[#E5EAE8] shadow-xs divide-y divide-[#E5EAE8] overflow-hidden">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="p-4 sm:p-4.5 flex items-center justify-between gap-4 hover:bg-[#F5F8F7] transition"
            >
              {/* Left File info */}
              <div className="flex items-center gap-3.5 truncate min-w-0">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="truncate">
                  <p
                    onClick={() => setViewDoc(doc)}
                    className="text-xs sm:text-sm font-bold text-[#17212B] hover:text-[#15965B] cursor-pointer truncate transition-colors"
                  >
                    {doc.name}
                  </p>
                  <div className="flex items-center gap-2 text-[11px] text-[#64748B] mt-0.5">
                    <span>Uploaded on {doc.uploadedDate}</span>
                    <span>•</span>
                    <span>{doc.size}</span>
                    <span>•</span>
                    <span className="hidden sm:inline">{doc.category}</span>
                  </div>
                </div>
              </div>

              {/* Right Action Buttons matching Reference Image 7 */}
              <div className="flex items-center gap-2 shrink-0">
                <Badge
                  variant={doc.status === "Indexed" ? "blue" : "emerald"}
                  size="xs"
                  className="hidden md:inline-flex"
                >
                  {doc.status}
                </Badge>

                <button
                  onClick={() => handleDownload(doc)}
                  className="p-2 text-[#64748B] hover:text-[#15965B] hover:bg-slate-100 rounded-lg transition"
                  title="Download document"
                >
                  <Download className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setViewDoc(doc)}
                  className="p-2 text-[#64748B] hover:text-[#17212B] hover:bg-slate-100 rounded-lg transition hidden sm:inline-block"
                  title="View details"
                >
                  <Eye className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setDocToDelete(doc)}
                  className="p-2 text-[#64748B] hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                  title="Delete document"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Document Details Modal */}
      {viewDoc && (
        <Modal
          isOpen={!!viewDoc}
          onClose={() => setViewDoc(null)}
          title={viewDoc.name}
          subtitle={`Uploaded on ${viewDoc.uploadedDate}`}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-[#F5F8F7] rounded-xl border border-[#E5EAE8]">
                <p className="text-[#64748B]">File Format</p>
                <p className="font-bold text-[#17212B] mt-0.5">{viewDoc.type}</p>
              </div>
              <div className="p-3 bg-[#F5F8F7] rounded-xl border border-[#E5EAE8]">
                <p className="text-[#64748B]">File Size</p>
                <p className="font-bold text-[#17212B] mt-0.5">{viewDoc.size}</p>
              </div>
              <div className="p-3 bg-[#F5F8F7] rounded-xl border border-[#E5EAE8]">
                <p className="text-[#64748B]">Indexed Pages</p>
                <p className="font-bold text-[#17212B] mt-0.5">{viewDoc.pages} Pages</p>
              </div>
              <div className="p-3 bg-[#F5F8F7] rounded-xl border border-[#E5EAE8]">
                <p className="text-[#64748B]">Processing Status</p>
                <p className="font-bold text-[#15965B] mt-0.5">{viewDoc.status}</p>
              </div>
            </div>

            {/* Summary / Grounding Section */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#64748B] mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#15965B]" />
                <span>{viewDoc.summary ? "AI Executive Summary" : "Grounding Summary"}</span>
              </h4>
              <div className="text-xs text-[#17212B] leading-relaxed bg-[#F5F8F7] p-3 rounded-xl border border-[#E5EAE8] whitespace-pre-line font-normal">
                {viewDoc.summary ||
                  "This statutory text has been tokenized, vector-indexed, and integrated into your CivicSphere knowledge context. Citations from this document will automatically link when relevant civic queries are asked in Chat Assistant."}
              </div>
            </div>

            {/* Key Clauses / Points if available */}
            {viewDoc.keyPoints && viewDoc.keyPoints.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#64748B] mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#15965B]" />
                  <span>Key Provisions & Citizen Clauses</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-[#17212B]">
                  {viewDoc.keyPoints.map((point, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 p-2 rounded-lg bg-[#F5F8F7] border border-[#E5EAE8]"
                    >
                      <span className="w-4 h-4 rounded-full bg-[#15965B]/10 text-[#087443] flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Citations if available */}
            {viewDoc.citations && viewDoc.citations.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#64748B] mb-2 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#15965B]" />
                  <span>Statutory Acts & Citations</span>
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {viewDoc.citations.map((cite, i) => (
                    <span
                      key={i}
                      className="text-[11px] font-semibold bg-[#15965B]/10 text-[#087443] px-2.5 py-0.5 rounded-full border border-[#15965B]/20"
                    >
                      {cite}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap justify-between items-center gap-2 pt-3 border-t border-[#E5EAE8]">
              <Button
                variant="outline"
                size="sm"
                leftIcon={MessageSquare}
                onClick={() => {
                  const docPrompt = `Regarding my uploaded document "${viewDoc.name}":\n${viewDoc.summary || ""}\nWhat are the legal implications and my rights under this document?`;
                  setViewDoc(null);
                  navigate("/chat", { state: { initialPrompt: docPrompt } });
                }}
              >
                Ask in Chat
              </Button>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewDoc(null)}
                >
                  Close
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={Download}
                  onClick={() => handleDownload(viewDoc)}
                >
                  Download File
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!docToDelete}
        onClose={() => setDocToDelete(null)}
        onConfirm={handleDelete}
        title="Delete Document"
        message={`Are you sure you want to delete "${docToDelete?.name}"? You will lose contextual citations linked to this file.`}
        confirmLabel="Delete Document"
      />
    </div>
  );
}
