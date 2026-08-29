"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  ArrowLeft,
  Users,
  Store,
  Mail,
  Clock,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  ListTodo,
  Plus,
  Trash2,
  Check,
  Save,
  Megaphone,
  Sparkles,
  Info,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminUser {
  name: string;
  email: string;
  stores: any[];
  activeId: string;
  updatedAt: string;
}

interface TaskSubItem {
  id: string;
  title: string;
  completed: boolean;
}

interface TaskItem {
  id: string;
  title: string;
  completed: boolean;
  children?: TaskSubItem[];
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"users" | "tasks" | "instructions">("users");
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedEmail, setExpandedEmail] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  // Master Tasks State
  const [masterTasks, setMasterTasks] = useState<TaskItem[]>([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [tasksSavedMsg, setTasksSavedMsg] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");

  // Admin Instructions State
  const [instructions, setInstructions] = useState({
    title: "Admin Notice & Team Guidelines",
    text: "",
    isActive: true,
  });
  const [instructionsLoading, setInstructionsLoading] = useState(false);
  const [instructionsSavedMsg, setInstructionsSavedMsg] = useState("");

  // In-app non-blocking confirmation modal
  const [confirmAction, setConfirmAction] = useState<{
    title: string;
    message: string;
    confirmText?: string;
    isDestructive?: boolean;
    onConfirm: () => void;
  } | null>(null);

  async function fetchUsers() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (data.success && Array.isArray(data.users)) {
        setUsers(data.users);
      }
    } catch (e) {}
    setLoading(false);
  }

  function handleDeleteUser(email: string, e: React.MouseEvent) {
    e.stopPropagation();
    setConfirmAction({
      title: "Delete User & Stores",
      message: `Are you sure you want to delete user ${email} and all their stores?`,
      confirmText: "Delete User",
      isDestructive: true,
      onConfirm: async () => {
        try {
          await fetch(`/api/admin/users?email=${encodeURIComponent(email)}`, { method: "DELETE" });
          setUsers((prev) => prev.filter((u) => u.email !== email));
        } catch (err) {}
        setConfirmAction(null);
      },
    });
  }

  function handleDeleteUserStore(email: string, storeId: string, storeName: string) {
    setConfirmAction({
      title: "Delete Store",
      message: `Are you sure you want to remove store "${storeName}" from user ${email}?`,
      confirmText: "Delete Store",
      isDestructive: true,
      onConfirm: async () => {
        try {
          await fetch(`/api/admin/users?email=${encodeURIComponent(email)}&storeId=${encodeURIComponent(storeId)}`, {
            method: "DELETE",
          });
          setUsers((prev) =>
            prev.map((u) => {
              if (u.email === email && u.stores) {
                return { ...u, stores: u.stores.filter((s: any) => s.id !== storeId) };
              }
              return u;
            })
          );
        } catch (err) {}
        setConfirmAction(null);
      },
    });
  }

  async function fetchMasterTasks() {
    setTasksLoading(true);
    try {
      const res = await fetch("/api/admin/tasks");
      const data = await res.json();
      if (data.success && Array.isArray(data.tasks)) {
        setMasterTasks(data.tasks);
      }
    } catch (e) {}
    setTasksLoading(false);
  }

  async function fetchInstructions() {
    setInstructionsLoading(true);
    try {
      const res = await fetch("/api/admin/instructions");
      const data = await res.json();
      if (data.success && data.instructions) {
        setInstructions(data.instructions);
      }
    } catch (e) {}
    setInstructionsLoading(false);
  }

  useEffect(() => {
    fetchUsers();
    fetchMasterTasks();
    fetchInstructions();
  }, []);

  async function handleSaveMasterTasks() {
    setTasksLoading(true);
    try {
      const res = await fetch("/api/admin/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tasks: masterTasks }),
      });
      const data = await res.json();
      if (data.success) {
        setTasksSavedMsg("Master checklist template saved successfully!");
        setTimeout(() => setTasksSavedMsg(""), 3500);
      }
    } catch (e) {}
    setTasksLoading(false);
  }

  async function handleSaveInstructions(e: React.FormEvent) {
    e.preventDefault();
    setInstructionsLoading(true);
    try {
      const res = await fetch("/api/admin/instructions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(instructions),
      });
      const data = await res.json();
      if (data.success) {
        setInstructionsSavedMsg("Admin instructions published live to all users!");
        setTimeout(() => setInstructionsSavedMsg(""), 3500);
      }
    } catch (e) {}
    setInstructionsLoading(false);
  }

  function handleAddCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    const newCat: TaskItem = {
      id: "task-" + Date.now(),
      title: newCategoryName.trim(),
      completed: false,
      children: [],
    };
    setMasterTasks([...masterTasks, newCat]);
    setNewCategoryName("");
  }

  function handleAddSubTask(parentId: string, title: string) {
    if (!title.trim()) return;
    setMasterTasks(
      masterTasks.map((t) => {
        if (t.id === parentId) {
          const currentChildren = t.children || [];
          return {
            ...t,
            children: [
              ...currentChildren,
              { id: "sub-" + Date.now(), title: title.trim(), completed: false },
            ],
          };
        }
        return t;
      })
    );
  }

  function handleDeleteCategory(id: string) {
    setConfirmAction({
      title: "Delete Category",
      message: "Are you sure you want to delete this entire category and its subtasks?",
      confirmText: "Delete Category",
      isDestructive: true,
      onConfirm: () => {
        setMasterTasks((prev) => prev.filter((t) => t.id !== id));
        setConfirmAction(null);
      },
    });
  }

  function handleDeleteSubTask(parentId: string, subId: string) {
    setMasterTasks(
      masterTasks.map((t) => {
        if (t.id === parentId && t.children) {
          return {
            ...t,
            children: t.children.filter((c) => c.id !== subId),
          };
        }
        return t;
      })
    );
  }

  function handleUpdateCategoryTitle(id: string, newTitle: string) {
    setMasterTasks(
      masterTasks.map((t) => (t.id === id ? { ...t, title: newTitle } : t))
    );
  }

  function handleUpdateSubTaskTitle(parentId: string, subId: string, newTitle: string) {
    setMasterTasks(
      masterTasks.map((t) => {
        if (t.id === parentId && t.children) {
          return {
            ...t,
            children: t.children.map((c) => (c.id === subId ? { ...c, title: newTitle } : c)),
          };
        }
        return t;
      })
    );
  }

  const totalStores = users.reduce((acc, u) => acc + (u.stores ? u.stores.length : 0), 0);

  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.stores || []).some((s) => s.name?.toLowerCase().includes(q) || s.country?.toLowerCase().includes(q))
    );
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-900 mb-2 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Hub
            </Link>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-slate-900" strokeWidth={2} />
              <h1 className="text-2xl font-bold text-slate-900">Master Admin Dashboard</h1>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Overview of all users, their added stores, emails, and activity
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={fetchUsers}
            disabled={loading}
            className="flex items-center gap-1.5"
          >
            <RefreshCw className={"w-3.5 h-3.5 " + (loading ? "animate-spin" : "")} />
            Refresh Data
          </Button>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="flex border-b border-slate-200 mb-6 gap-3 flex-wrap">
          <button
            onClick={() => setActiveTab("users")}
            className={`pb-3 px-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === "users"
                ? "border-slate-900 text-slate-900"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Users & Stores ({users.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("tasks")}
            className={`pb-3 px-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === "tasks"
                ? "border-slate-900 text-slate-900"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <ListTodo className="w-4 h-4" />
            <span>Master Task Checklist ({masterTasks.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("instructions")}
            className={`pb-3 px-3.5 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer rounded-t-[4px] ${
              activeTab === "instructions"
                ? "border-emerald-600 text-emerald-900 bg-emerald-50/70"
                : "border-transparent text-emerald-700 bg-emerald-50/30 hover:bg-emerald-50/60 hover:text-emerald-900"
            }`}
          >
            <Megaphone className="w-4 h-4 text-emerald-600" />
            <span>Admin Instructions & Guidelines</span>
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
              Live Directive
            </span>
          </button>
        </div>

        {/* TAB 1: USERS & STORES OVERVIEW */}
        {activeTab === "users" && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-white border border-slate-200 rounded-[4px] p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Users</span>
                  <Users className="w-4 h-4 text-slate-400" />
                </div>
                <div className="text-2xl font-bold text-slate-900 mt-2">{users.length}</div>
              </div>

              <div className="bg-white border border-slate-200 rounded-[4px] p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Stores Added</span>
                  <Store className="w-4 h-4 text-slate-400" />
                </div>
                <div className="text-2xl font-bold text-slate-900 mt-2">{totalStores}</div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search by user name, email, store name, or country..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-3.5 py-2 rounded-[4px] border border-slate-300 text-sm bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-950"
              />
            </div>

            {/* User List */}
            {loading ? (
              <div className="text-center py-16 text-slate-400 text-sm">Loading users data...</div>
            ) : filteredUsers.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-[4px] p-12 text-center">
                <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-500">No users found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredUsers.map((user) => {
                  const isExpanded = expandedEmail === user.email;
                  const storeCount = user.stores ? user.stores.length : 0;
                  const formattedDate = user.updatedAt
                    ? new Date(user.updatedAt).toLocaleString()
                    : "N/A";

                  return (
                    <div
                      key={user.email}
                      className="bg-white border border-slate-200 rounded-[4px] overflow-hidden shadow-sm transition-all"
                    >
                      {/* User Summary Header */}
                      <div
                        onClick={() => setExpandedEmail(isExpanded ? null : user.email)}
                        className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50/75 select-none flex-wrap gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-[4px] bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-sm text-slate-900 flex items-center gap-2">
                              {user.name}
                              <span className="text-xs font-normal text-slate-500 flex items-center gap-1">
                                <Mail className="w-3 h-3" /> {user.email}
                              </span>
                            </div>
                            <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                              <Clock className="w-3 h-3" /> Last Active: {formattedDate}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-800 rounded-[4px] border border-slate-200">
                            {storeCount} {storeCount === 1 ? "Store" : "Stores"}
                          </span>
                          <button
                            onClick={(e) => handleDeleteUser(user.email, e)}
                            className="p-1 rounded-[4px] text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-slate-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                      </div>

                      {/* Expanded Store Details */}
                      {isExpanded && (
                        <div className="border-t border-slate-200 p-4 bg-slate-50/50">
                          {storeCount === 0 ? (
                            <p className="text-xs text-slate-400 py-2">No stores added yet by this user.</p>
                          ) : (
                            <div className="overflow-x-auto">
                              <table className="w-full text-left text-xs border-collapse">
                                <thead>
                                  <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                                    <th className="py-2 px-2">Store Name</th>
                                    <th className="py-2 px-2">Country</th>
                                    <th className="py-2 px-2">Company</th>
                                    <th className="py-2 px-2">Domain</th>
                                    <th className="py-2 px-2">Email</th>
                                    <th className="py-2 px-2">Currency</th>
                                    <th className="py-2 px-2">Language</th>
                                    <th className="py-2 px-2 text-right">Action</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 text-slate-700">
                                  {user.stores.map((s: any, idx: number) => (
                                    <tr key={s.id || idx} className="hover:bg-white transition-colors">
                                      <td className="py-2.5 px-2 font-bold text-slate-900">{s.name || "N/A"}</td>
                                      <td className="py-2.5 px-2">
                                        <span className="px-1.5 py-0.5 bg-slate-200/70 rounded-[3px] text-[11px] font-medium text-slate-800">
                                          {s.country || "N/A"}
                                        </span>
                                      </td>
                                      <td className="py-2.5 px-2 text-slate-600">{s.company || "N/A"}</td>
                                      <td className="py-2.5 px-2 font-mono text-slate-600">{s.domain || "N/A"}</td>
                                      <td className="py-2.5 px-2 text-slate-600">{s.email || "N/A"}</td>
                                      <td className="py-2.5 px-2 font-bold">{s.currency || "N/A"}</td>
                                      <td className="py-2.5 px-2">{s.language || "N/A"}</td>
                                      <td className="py-2.5 px-2 text-right">
                                        <button
                                          onClick={() => handleDeleteUserStore(user.email, s.id, s.name || "Store")}
                                          className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                          title="Remove this store"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* TAB 2: MASTER TASK CHECKLIST MANAGER */}
        {activeTab === "tasks" && (
          <div className="space-y-6">
            {/* Action Bar */}
            <div className="bg-white border border-slate-200 rounded-[4px] p-5 shadow-sm flex items-center justify-between flex-wrap gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Standard Workflow Checklist</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Edit categories and subtasks below. When saved, all new stores and user resets will receive this standard checklist.
                </p>
              </div>

              <div className="flex items-center gap-3">
                {tasksSavedMsg && (
                  <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> {tasksSavedMsg}
                  </span>
                )}
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleSaveMasterTasks}
                  disabled={tasksLoading}
                  className="flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Master Template</span>
                </Button>
              </div>
            </div>

            {/* Categories & Subtasks List */}
            <div className="space-y-4">
              {masterTasks.map((cat, catIdx) => (
                <div
                  key={cat.id}
                  className="bg-white border border-slate-200 rounded-[4px] p-5 shadow-sm space-y-4"
                >
                  {/* Category Header */}
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-2.5 flex-1 min-w-[280px]">
                      <span className="w-6 h-6 rounded-[3px] bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
                        {catIdx + 1}
                      </span>
                      <input
                        type="text"
                        value={cat.title}
                        onChange={(e) => handleUpdateCategoryTitle(cat.id, e.target.value)}
                        placeholder="Category Title..."
                        className="w-full text-sm font-bold text-slate-900 border border-slate-200 rounded-[4px] px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-slate-900 bg-slate-50/50"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteCategory(cat.id)}
                      className="text-xs text-rose-600 hover:text-rose-800 p-1 rounded hover:bg-rose-50 flex items-center gap-1 transition-colors"
                      title="Delete Category"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete Category
                    </button>
                  </div>

                  {/* Subtasks List */}
                  <div className="pl-8 space-y-2 border-l-2 border-slate-100 ml-3">
                    {(cat.children || []).map((sub) => (
                      <div key={sub.id} className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-slate-300 shrink-0" />
                        <input
                          type="text"
                          value={sub.title}
                          onChange={(e) => handleUpdateSubTaskTitle(cat.id, sub.id, e.target.value)}
                          className="flex-1 text-xs text-slate-700 border border-slate-200 rounded-[4px] px-2 py-1 focus:outline-none focus:ring-1 focus:ring-slate-900 bg-white"
                        />
                        <button
                          type="button"
                          onClick={() => handleDeleteSubTask(cat.id, sub.id)}
                          className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer transition-colors"
                          title="Delete subtask"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}

                    {/* Add Subtask Input */}
                    <div className="pt-1.5 flex gap-2">
                      <input
                        type="text"
                        placeholder="+ Add subtask to this category and press Enter..."
                        id={`input-sub-${cat.id}`}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && (e.target as HTMLInputElement).value.trim()) {
                            handleAddSubTask(cat.id, (e.target as HTMLInputElement).value.trim());
                            (e.target as HTMLInputElement).value = "";
                          }
                        }}
                        className="flex-1 text-xs text-slate-700 border border-dashed border-slate-300 rounded-[4px] px-2.5 py-1.5 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 bg-slate-50/50"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const el = document.getElementById(`input-sub-${cat.id}`) as HTMLInputElement;
                          if (el && el.value.trim()) {
                            handleAddSubTask(cat.id, el.value.trim());
                            el.value = "";
                          }
                        }}
                        className="h-auto py-1 px-3 text-xs"
                      >
                        Add Subtask
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add New Category Form */}
            <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-[4px] p-5">
              <form onSubmit={handleAddCategory} className="flex gap-2 items-center flex-wrap">
                <input
                  type="text"
                  placeholder="Enter new master category name (e.g. Meta Ads & Pixel Verification)..."
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="flex-1 min-w-[240px] px-3.5 py-2 rounded-[4px] border border-slate-300 text-xs bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
                <Button type="submit" variant="default" size="sm" className="flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5" /> Add Category
                </Button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 3: ADMIN INSTRUCTIONS & TEAM GUIDELINES */}
        {activeTab === "instructions" && (
          <div className="space-y-6">
            <form onSubmit={handleSaveInstructions} className="bg-white border border-emerald-200 rounded-[4px] p-6 shadow-sm space-y-5">
              <div className="flex items-center justify-between flex-wrap gap-3 border-b border-emerald-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-[4px] bg-emerald-600 text-white flex items-center justify-center font-bold">
                    <Megaphone className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Admin Instructions & Team Guidelines</h3>
                    <p className="text-xs text-slate-500">
                      These instructions will appear as a prominent green highlight banner at the top of the user toolkit.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {instructionsSavedMsg && (
                    <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> {instructionsSavedMsg}
                    </span>
                  )}
                  <Button
                    type="submit"
                    variant="default"
                    size="sm"
                    disabled={instructionsLoading}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Publish Instructions</span>
                  </Button>
                </div>
              </div>

              {/* Title Field */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Banner Header Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mandatory Guidelines for Team & Store Creation"
                  value={instructions.title}
                  onChange={(e) => setInstructions({ ...instructions, title: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-[4px] border border-slate-300 text-sm font-semibold text-slate-900 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              {/* Textarea Field */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Instructions / Rules Content (Bullet points, notes, links)
                </label>
                <textarea
                  rows={8}
                  required
                  placeholder={"e.g.\n• Always verify payment methods (BLIK/Przelewy24 for Poland, MobilePay for Denmark).\n• Never retain Asian/AliExpress reference packaging or watermarks.\n• Use 26px for section headings and 14px for body text.\n• Shipping must always be free across all target stores."}
                  value={instructions.text}
                  onChange={(e) => setInstructions({ ...instructions, text: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-[4px] border border-slate-300 text-xs font-mono leading-relaxed text-slate-900 bg-slate-50/50 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              {/* Active Toggle */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={instructions.isActive}
                    onChange={(e) => setInstructions({ ...instructions, isActive: e.target.checked })}
                    className="w-4 h-4 accent-emerald-600 rounded-[2px]"
                  />
                  <span>Show Green Highlight Banner Live on User Toolkit</span>
                </label>

                <span className={`text-xs font-bold px-2 py-0.5 rounded-[3px] ${instructions.isActive ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-500"}`}>
                  {instructions.isActive ? "Status: Active (Visible to users)" : "Status: Hidden"}
                </span>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Modern In-App Confirmation Modal */}
      {confirmAction && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-[6px] p-5 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-sm font-semibold text-slate-900 mb-1.5">{confirmAction.title}</h3>
            <p className="text-xs text-slate-600 mb-5 leading-relaxed">{confirmAction.message}</p>
            <div className="flex items-center justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setConfirmAction(null)}
                className="text-xs h-8 px-3"
              >
                Cancel
              </Button>
              <Button
                variant={confirmAction.isDestructive ? "destructive" : "default"}
                size="sm"
                onClick={confirmAction.onConfirm}
                className="text-xs h-8 px-3.5"
              >
                {confirmAction.confirmText || "Confirm"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
