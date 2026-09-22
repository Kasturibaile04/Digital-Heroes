"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, Trash2, Loader2, Star, Pencil, Check, X } from "lucide-react";

interface Charity {
    id: string;
    name: string;
    description: string;
    is_featured: boolean;
}

export default function AdminCharitiesPage() {
    const supabase = createClient();
    const [charities, setCharities] = useState<Charity[]>([]);
    const [loading, setLoading] = useState(true);
    const [newName, setNewName] = useState("");
    const [newDesc, setNewDesc] = useState("");
    const [creating, setCreating] = useState(false);
    const [editing, setEditing] = useState<string | null>(null);
    const [editName, setEditName] = useState("");
    const [editDesc, setEditDesc] = useState("");

    async function fetchCharities() {
        const { data } = await supabase
            .from("charities")
            .select("id, name, description, is_featured")
            .order("is_featured", { ascending: false })
            .order("name");
        setCharities(data ?? []);
        setLoading(false);
    }

    useEffect(() => { fetchCharities(); }, []);

    async function handleCreate(e: React.FormEvent) {
        e.preventDefault();
        setCreating(true);
        await supabase.from("charities").insert({ name: newName, description: newDesc });
        setNewName("");
        setNewDesc("");
        await fetchCharities();
        setCreating(false);
    }

    async function handleDelete(id: string) {
        if (!confirm("Delete this charity?")) return;
        await supabase.from("charities").delete().eq("id", id);
        await fetchCharities();
    }

    async function handleToggleFeatured(id: string, current: boolean) {
        // Unfeature all first
        if (!current) {
            await supabase.from("charities").update({ is_featured: false }).neq("id", "");
        }
        await supabase.from("charities").update({ is_featured: !current }).eq("id", id);
        await fetchCharities();
    }

    async function handleSaveEdit(id: string) {
        await supabase.from("charities").update({ name: editName, description: editDesc }).eq("id", id);
        setEditing(null);
        await fetchCharities();
    }

    function startEdit(c: Charity) {
        setEditing(c.id);
        setEditName(c.name);
        setEditDesc(c.description);
    }

    return (
        <main className="flex-1 bg-background pt-24 pb-24 px-6 md:px-12 font-sans relative overflow-hidden min-h-screen text-foreground">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-light/20 rounded-full blur-[100px] pointer-events-none -translate-y-1/3 translate-x-1/3" />

            <div className="max-w-[1200px] mx-auto relative z-10">
                <div className="mb-12 border-b border-border pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-light border border-brand/20 mb-4">
                            <span className="text-[10px] font-bold tracking-widest uppercase text-brand">Admin Module</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-serif font-bold text-editorial mb-3">
                            Charity <span className="italic text-brand">Directory.</span>
                        </h1>
                        <p className="text-muted-foreground text-lg">Add new charities and highlight the featured organization.</p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-4 gap-8">
                    {/* Left Column: Create Form */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="bg-white p-8 rounded-[2.5rem] border border-border premium-shadow">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center border border-brand/20">
                                    <Plus className="w-5 h-5 text-brand" />
                                </div>
                                <h2 className="text-xl font-serif font-bold">New Charity</h2>
                            </div>

                            <form onSubmit={handleCreate} className="space-y-5">
                                <div>
                                    <label className="text-xs tracking-widest uppercase font-bold text-muted-foreground block mb-2">Charity Name</label>
                                    <input
                                        type="text"
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                        placeholder="Name"
                                        required
                                        className="w-full px-4 py-3 rounded-xl text-[15px] font-medium outline-none transition-all bg-background border border-border text-foreground focus:border-brand focus:ring-1 focus:ring-brand shadow-sm"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs tracking-widest uppercase font-bold text-muted-foreground block mb-2">Description</label>
                                    <textarea
                                        value={newDesc}
                                        onChange={(e) => setNewDesc(e.target.value)}
                                        placeholder="Mission & impact..."
                                        rows={4}
                                        className="w-full px-4 py-3 rounded-xl text-[15px] font-medium outline-none resize-none transition-all bg-background border border-border text-foreground focus:border-brand focus:ring-1 focus:ring-brand shadow-sm"
                                    />
                                </div>
                                <button type="submit" disabled={creating}
                                    className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold transition-all bg-foreground text-background hover:bg-brand shadow-lg disabled:opacity-50 hover-lift mt-2">
                                    {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                                    {creating ? "Adding…" : "Create Charity"}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Right Column: Charities List */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-[2rem] premium-shadow border border-border h-full">
                            <div className="p-8 border-b border-border bg-muted/20">
                                <h2 className="text-xl font-serif font-bold text-foreground">Registered Organizations</h2>
                            </div>

                            <div className="p-8">
                                <div className="flex flex-col gap-4">
                                    {loading ? (
                                        <div className="flex justify-center py-12">
                                            <Loader2 className="w-8 h-8 text-brand animate-spin" />
                                        </div>
                                    ) : charities.length === 0 ? (
                                        <div className="text-center py-12 text-muted-foreground bg-muted/30 rounded-2xl border border-dashed border-border">No charities exist in the system yet.</div>
                                    ) : charities.map((c) => (
                                        <div key={c.id} className="bg-background border border-border rounded-3xl p-6 transition-all hover:border-brand/40 shadow-sm relative overflow-hidden group">

                                            {c.is_featured && <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 rounded-full blur-[30px] pointer-events-none translate-x-1/2 -translate-y-1/2" />}

                                            {editing === c.id ? (
                                                <div className="flex flex-col gap-4 relative z-10">
                                                    <input
                                                        value={editName}
                                                        onChange={(e) => setEditName(e.target.value)}
                                                        className="w-full px-4 py-3 rounded-xl font-medium outline-none transition-all bg-white border border-brand text-foreground focus:ring-2 focus:ring-brand focus:border-brand shadow-sm"
                                                    />
                                                    <textarea
                                                        value={editDesc}
                                                        onChange={(e) => setEditDesc(e.target.value)}
                                                        rows={3}
                                                        className="w-full px-4 py-3 rounded-xl font-medium outline-none resize-none transition-all bg-white border border-brand text-foreground focus:ring-2 focus:ring-brand focus:border-brand shadow-sm line-clamp-3"
                                                    />
                                                    <div className="flex gap-3 justify-end mt-2">
                                                        <button onClick={() => setEditing(null)}
                                                            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold bg-muted text-muted-foreground hover:bg-border transition-colors">
                                                            <X className="w-4 h-4" /> Cancel
                                                        </button>
                                                        <button onClick={() => handleSaveEdit(c.id)}
                                                            className="flex items-center gap-1.5 px-6 py-2 rounded-lg text-sm font-semibold bg-brand text-white hover:shadow-lg transition-all hover:-translate-y-0.5">
                                                            <Check className="w-4 h-4" /> Save
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <h3 className="font-serif font-bold text-xl text-foreground group-hover:text-brand transition-colors">{c.name}</h3>
                                                            {c.is_featured && (
                                                                <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-md bg-brand-light text-brand border border-brand/20">
                                                                    ★ Featured
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{c.description}</p>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 flex-shrink-0 bg-muted/50 p-1.5 rounded-xl border border-border">
                                                        <button onClick={() => handleToggleFeatured(c.id, c.is_featured)}
                                                            title={c.is_featured ? "Unfeature" : "Set as featured"}
                                                            className={`p-2 rounded-lg transition-all ${c.is_featured ? "bg-white text-brand shadow-sm border border-border" : "text-muted-foreground hover:bg-white hover:text-foreground hover:shadow-sm border border-transparent"}`}>
                                                            <Star className="w-4 h-4" fill={c.is_featured ? "currentColor" : "none"} />
                                                        </button>
                                                        <button onClick={() => startEdit(c)}
                                                            title="Edit charity"
                                                            className="p-2 rounded-lg transition-all text-muted-foreground hover:bg-white hover:text-foreground hover:shadow-sm border border-transparent">
                                                            <Pencil className="w-4 h-4" />
                                                        </button>
                                                        <button onClick={() => handleDelete(c.id)}
                                                            title="Delete charity"
                                                            className="p-2 rounded-lg transition-all text-muted-foreground hover:bg-destructive/10 hover:text-destructive border border-transparent">
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
