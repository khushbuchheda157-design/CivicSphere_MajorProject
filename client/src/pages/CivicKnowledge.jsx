import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Share2,
  Search,
  Filter,
  Info,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Layers,
  ArrowRight,
} from "lucide-react";
import PageHeader from "../components/common/PageHeader";
import Badge from "../components/common/Badge";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import { civicKnowledgeGraph } from "../data/mockData";

export default function CivicKnowledge() {
  const [selectedNode, setSelectedNode] = useState(civicKnowledgeGraph.nodes[0]);
  const [filterType, setFilterType] = useState("all");
  const [search, setSearch] = useState("");

  const types = ["all", "Supreme Law", "Legislation", "Scheme", "Authority"];

  const filteredNodes = civicKnowledgeGraph.nodes.filter((node) => {
    const matchesSearch = node.label.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === "all" || node.type === filterType;
    return matchesSearch && matchesType;
  });

  const connectedLinks = civicKnowledgeGraph.links.filter(
    (l) => l.source === selectedNode?.id || l.target === selectedNode?.id
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Civic Knowledge Graph"
        subtitle="Explore interconnected Indian legal codes, welfare schemes, and civil liberties"
        badge={
          <Badge variant="emerald" size="sm">
            Knowledge Map
          </Badge>
        }
      >
        <Link to="/chat">
          <Button variant="primary" size="sm" leftIcon={Sparkles}>
            Query Graph in Chat
          </Button>
        </Link>
      </PageHeader>

      {/* Info Notice */}
      <div className="bg-[#15965B]/10 border border-[#15965B]/20 rounded-xl p-3.5 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-[#15965B] shrink-0 mt-0.5" />
        <div className="text-xs text-[#087443] leading-relaxed">
          The Civic Knowledge Graph visualizes statutory relationships connecting the Constitution of India, Central Acts, executing ministries, and public welfare schemes.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive Node Explorer (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-2xl border border-[#E5EAE8] p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
              <h3 className="text-sm font-bold text-[#17212B] flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#15965B]" />
                <span>Statutory Entities & Nodes</span>
              </h3>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Filter nodes..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-[#F5F8F7] border border-[#E5EAE8] rounded-lg px-2.5 py-1 text-xs outline-none focus:border-[#15965B]"
                />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="bg-[#F5F8F7] border border-[#E5EAE8] rounded-lg px-2.5 py-1 text-xs outline-none font-semibold"
                >
                  {types.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Nodes Grid Canvas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 min-h-[360px] bg-[#F5F8F7]/50 p-4 rounded-xl border border-dashed border-[#E5EAE8]">
              {filteredNodes.map((node) => {
                const isSelected = selectedNode?.id === node.id;
                return (
                  <div
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "bg-white border-[#15965B] shadow-md ring-2 ring-[#15965B]/20 scale-[1.01]"
                        : "bg-white border-[#E5EAE8] hover:border-[#CBD5E1] hover:shadow-xs"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-bold text-[#17212B]">
                        {node.label}
                      </span>
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0 mt-1"
                        style={{ backgroundColor: node.color }}
                      />
                    </div>
                    <div className="mt-3 flex items-center justify-between text-[11px] text-[#64748B]">
                      <span>{node.type}</span>
                      <span className="text-[#15965B] font-semibold">Inspect →</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Selected Entity Details Panel (4 cols) */}
        <div className="lg:col-span-4">
          <Card className="p-5 space-y-4">
            {selectedNode ? (
              <>
                <div className="pb-3 border-b border-[#E5EAE8]">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: selectedNode.color }}
                    />
                    <Badge variant="emerald" size="xs">
                      {selectedNode.type}
                    </Badge>
                  </div>
                  <h3 className="text-base font-bold text-[#17212B]">
                    {selectedNode.label}
                  </h3>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#64748B] mb-2">
                    Interconnected Statutory Links
                  </h4>
                  {connectedLinks.length === 0 ? (
                    <p className="text-xs text-[#64748B]">No direct relationships mapped.</p>
                  ) : (
                    <div className="space-y-2">
                      {connectedLinks.map((link, idx) => {
                        const targetNode = civicKnowledgeGraph.nodes.find(
                          (n) => n.id === (link.source === selectedNode.id ? link.target : link.source)
                        );
                        return (
                          <div
                            key={idx}
                            onClick={() => targetNode && setSelectedNode(targetNode)}
                            className="p-2.5 rounded-lg bg-[#F5F8F7] border border-[#E5EAE8] hover:border-[#15965B]/40 transition cursor-pointer text-xs"
                          >
                            <span className="text-[10px] text-[#64748B] uppercase font-bold block">
                              {link.relationship}
                            </span>
                            <span className="font-semibold text-[#17212B] flex items-center justify-between mt-0.5">
                              <span>{targetNode?.label}</span>
                              <ArrowRight className="w-3 h-3 text-[#15965B]" />
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <Link to="/chat">
                    <Button variant="outline" size="sm" className="w-full">
                      Ask Questions About {selectedNode.label.split(" ")[0]}
                    </Button>
                  </Link>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-xs text-[#64748B]">
                Select an entity to explore statutory connections.
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

