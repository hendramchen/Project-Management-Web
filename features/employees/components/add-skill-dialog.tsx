"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { useSkills } from "@/features/skills/hooks/use-skills";
import { SkillLevel } from "@/features/skills/types";

interface AddSkillDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { skillId: string; proficiencyLevel: SkillLevel; yearsOfExperience: number }) => void;
  isSubmitting?: boolean;
}

export default function AddSkillDialog({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting = false,
}: AddSkillDialogProps) {
  const { skills } = useSkills();
  const [skillId, setSkillId] = useState("");
  const [proficiencyLevel, setProficiencyLevel] = useState<SkillLevel>(SkillLevel.Beginner);
  const [yearsOfExperience, setYearsOfExperience] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillId) return;
    
    onSubmit({
      skillId,
      proficiencyLevel,
      yearsOfExperience,
    });
    
    setSkillId("");
    setProficiencyLevel(SkillLevel.Beginner);
    setYearsOfExperience(0);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={() => onOpenChange(false)}>
        <DialogHeader>
          <DialogTitle>Add Skill</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="skill">Skill</Label>
            <select
              id="skill"
              value={skillId}
              onChange={(e) => setSkillId(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              required
            >
              <option value="">Select a skill</option>
              {skills.map((skill) => (
                <option key={skill.id} value={skill.id}>
                  {skill.name} ({skill.category})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="level">Proficiency Level</Label>
            <select
              id="level"
              value={proficiencyLevel}
              onChange={(e) => setProficiencyLevel(e.target.value as SkillLevel)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              required
            >
              <option value={SkillLevel.Beginner}>Beginner</option>
              <option value={SkillLevel.Intermediate}>Intermediate</option>
              <option value={SkillLevel.Expert}>Expert</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="years">Years of Experience</Label>
            <input
              id="years"
              type="number"
              min="0"
              step="0.5"
              value={yearsOfExperience}
              onChange={(e) => setYearsOfExperience(parseFloat(e.target.value))}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              required
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Skill"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
