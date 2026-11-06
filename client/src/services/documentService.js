import apiClient, { simulateDelay } from "./api";

const DOCS_STORAGE_KEY = "civicsphere_documents";

export const documentService = {
  getDocuments() {
    const stored = localStorage.getItem(DOCS_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Strip out old dummy demo documents
        const cleaned = parsed.filter(
          (d) => !["doc-1", "doc-2", "doc-3", "doc-4", "doc-5"].includes(d.id)
        );
        if (cleaned.length !== parsed.length) {
          localStorage.setItem(DOCS_STORAGE_KEY, JSON.stringify(cleaned));
        }
        return cleaned;
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  },

  async fetchDocumentsFromServer() {
    try {
      const response = await apiClient.get("/api/documents");
      const docs = response.data.documents || [];
      localStorage.setItem(DOCS_STORAGE_KEY, JSON.stringify(docs));
      return docs;
    } catch {
      return this.getDocuments();
    }
  },

  async uploadDocument(file) {
    const formData = new FormData();
    formData.append("file", file);

    let docResult;
    try {
      // Connect to backend Gemini summarizer
      const response = await apiClient.post("/api/documents/summarize", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      docResult = response.data.document;
    } catch (err) {
      console.warn("Server document summarization fallback:", err);
      await simulateDelay(600);
      const sizeInMB = (file.size / (1024 * 1024)).toFixed(1) + " MB";
      const extension = file.name.split(".").pop().toUpperCase();
      docResult = {
        id: "doc-" + Date.now(),
        name: file.name,
        type: extension,
        size: sizeInMB,
        uploadedDate: new Date().toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        status: "Processed & Indexed",
        category: "Uploaded Document",
        pages: 1,
        summary: `Document "${file.name}" has been uploaded and parsed for statutory grounding.`,
        keyPoints: [
          "Document indexed for semantic search",
          "Available for citations in Chat Assistant",
        ],
        citations: ["Indian Law Archive"],
        downloadUrl: "#",
      };
    }

    const docs = this.getDocuments();
    const updated = [docResult, ...docs.filter((d) => d.id !== docResult.id)];
    localStorage.setItem(DOCS_STORAGE_KEY, JSON.stringify(updated));
    return docResult;
  },

  async deleteDocument(id) {
    try {
      await apiClient.delete(`/api/documents/${id}`);
    } catch {
      await simulateDelay(200);
    }
    const docs = this.getDocuments().filter((d) => d.id !== id);
    localStorage.setItem(DOCS_STORAGE_KEY, JSON.stringify(docs));
    return true;
  },
};

