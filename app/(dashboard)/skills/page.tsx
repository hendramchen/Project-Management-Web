"use client";

import { useSkills } from "@/features/skills";
import { useAuth, RoleGuard } from "@/features/auth";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { skillSchema, SkillInput } from "@/features/skills";
import { toast } from "sonner";

export default function SkillsPage() {
  const { skills, isLoading, createSkill, updateSkill, deleteSkill } =
    useSkills();
  const { user } = useAuth();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SkillInput>({
    resolver: zodResolver(skillSchema),
  });

  const onSubmit = (data: SkillInput) => {
    if (editingSkill) {
      updateSkill(
        { id: editingSkill.id, data },
        {
          onSuccess: () => {
            toast.success("Skill updated successfully");
            setEditingSkill(null);
            reset();
            setIsCreateOpen(false);
          },
        },
      );
    } else {
      createSkill(data, {
        onSuccess: () => {
          toast.success("Skill created successfully");
          setIsCreateOpen(false);
          reset();
        },
      });
    }
  };

  const handleEdit = (skill: any) => {
    setEditingSkill(skill);
    setIsCreateOpen(true);
    reset(skill);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this skill?")) {
      deleteSkill(id, {
        onSuccess: () => {
          toast.success("Skill deleted successfully");
        },
      });
    }
  };

  const handleCloseDialog = () => {
    setIsCreateOpen(false);
    setEditingSkill(null);
    reset();
  };

  const filteredSkills = skills.filter(
    (skill) =>
      skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      skill.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      skill.category?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const isManager = user?.role === "admin" || user?.role === "manager";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Skills</h1>
          <p className="mt-2 text-muted-foreground">
            Manage skills and competencies
          </p>
        </div>
        <RoleGuard allowedRoles={["admin", "manager"]}>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Add Skill
          </button>
        </RoleGuard>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search skills..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-md border border-input bg-white pl-10 pr-4 py-2 text-sm"
        />
      </div>

      {isLoading ? (
        <div className="rounded-lg border bg-white p-8 text-center">
          <p className="text-muted-foreground">Loading skills...</p>
        </div>
      ) : filteredSkills.length === 0 ? (
        <div className="rounded-lg border bg-white p-8 text-center">
          <p className="text-muted-foreground">
            {searchTerm
              ? "No skills found matching your search"
              : "No skills found"}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredSkills.map((skill) => (
            <div
              key={skill.id}
              className="rounded-lg border bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold">{skill.name}</h3>
                  {skill.category && (
                    <span className="mt-1 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                      {skill.category}
                    </span>
                  )}
                  {skill.description && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      {skill.description}
                    </p>
                  )}
                </div>
                <RoleGuard allowedRoles={["admin", "manager"]}>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEdit(skill)}
                      className="rounded p-1 hover:bg-muted"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(skill.id)}
                      className="rounded p-1 hover:bg-muted"
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </button>
                  </div>
                </RoleGuard>
              </div>
            </div>
          ))}
        </div>
      )}

      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <h2 className="text-xl font-semibold">
              {editingSkill ? "Edit Skill" : "Add Skill"}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium">Name</label>
                <input
                  {...register("name")}
                  className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium">Category</label>
                <input
                  {...register("category")}
                  className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="e.g., Programming, Design, Management"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Description</label>
                <textarea
                  {...register("description")}
                  rows={3}
                  className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  {editingSkill ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  onClick={handleCloseDialog}
                  className="flex-1 rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
