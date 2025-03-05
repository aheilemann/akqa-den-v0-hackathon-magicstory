import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Sparkles } from "lucide-react";

interface LimitReachedDialogProps {
  isOpen: boolean;
  onClose: () => void;
  limit: number;
}

export function LimitReachedDialog({ isOpen, onClose, limit }: LimitReachedDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            Daily Limit Reached
          </DialogTitle>
          <DialogDescription>You've reached your daily limit of {limit} story generations. Upgrade your plan to create more magical stories!</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
          <Button variant="ghost" onClick={onClose}>
            Maybe Later
          </Button>
          <Link href="/pricing" className="w-full sm:w-auto">
            <Button className="w-full">Upgrade Plan</Button>
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
