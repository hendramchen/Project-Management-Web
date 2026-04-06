"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { skillsApi } from "../api/skills";
import { SkillInput } from "../schemas/skill.schema";
import { Skill } from "../types";

export function useSkills() {
  const queryClient = useQueryClient();

  const { data: skills, isLoading } = useQuery({
    queryKey: ["skills"],
    queryFn: skillsApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: skillsApi.create,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SkillInput> }) =>
      skillsApi.update(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ["skills"] });
      const previous = queryClient.getQueryData(["skills"]);
      queryClient.setQueryData(["skills"], (old: Skill[] = []) =>
        old.map((skill) => (skill.id === id ? { ...skill, ...data } : skill)),
      );
      return { previous };
    },
    onError: (err, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["skills"], context.previous);
      }
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      queryClient.invalidateQueries({ queryKey: ["skills", variables.id] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: skillsApi.delete,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["skills"] });
      const previous = queryClient.getQueryData(["skills"]);
      queryClient.setQueryData(["skills"], (old: Skill[] = []) =>
        old.filter((skill) => skill.id !== id),
      );
      return { previous };
    },
    onError: (err, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["skills"], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
    },
  });

  return {
    skills: skills?.data || [],
    isLoading,
    createSkill: createMutation.mutate,
    isCreating: createMutation.isPending,
    updateSkill: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    deleteSkill: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
  };
}

export function useSkill(id: string) {
  const { data: skill, isLoading } = useQuery({
    queryKey: ["skills", id],
    queryFn: () => skillsApi.getById(id),
    enabled: !!id,
  });

  return {
    skill: skill?.data,
    isLoading,
  };
}

export function useSkillSearch(skillId: string) {
  const { data: employees, isLoading } = useQuery({
    queryKey: ["skills", skillId, "employees"],
    queryFn: () => skillsApi.searchBySkill(skillId),
    enabled: !!skillId,
  });

  return {
    employees: employees?.data || [],
    isLoading,
  };
}
