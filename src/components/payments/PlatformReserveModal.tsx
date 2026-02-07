import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CircleDollarSign, Plus, Minus } from "lucide-react";

interface PlatformReserveModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentReserve: number;
  onSubmit: (type: "deposit" | "withdraw", amount: number, note: string) => void;
}

export function PlatformReserveModal({
  open,
  onOpenChange,
  currentReserve,
  onSubmit,
}: PlatformReserveModalProps) {
  const [transactionType, setTransactionType] = useState<"deposit" | "withdraw">("deposit");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleSubmit = () => {
    const numAmount = parseFloat(amount);
    if (numAmount > 0) {
      onSubmit(transactionType, numAmount, note);
      setAmount("");
      setNote("");
      setTransactionType("deposit");
      onOpenChange(false);
    }
  };

  const isValid = parseFloat(amount) > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <CircleDollarSign className="w-5 h-5 text-primary" />
            <DialogTitle>Platform Reserve</DialogTitle>
          </div>
          <DialogDescription>
            Add or withdraw funds from the platform reserve used to back airline credit.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Current Reserve Display */}
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <p className="text-sm text-muted-foreground mb-1">Current Reserve</p>
            <p className="text-2xl font-bold text-foreground">{formatCurrency(currentReserve)}</p>
          </div>

          {/* Transaction Type */}
          <div className="space-y-2">
            <Label>Transaction Type</Label>
            <Select 
              value={transactionType} 
              onValueChange={(value: "deposit" | "withdraw") => setTransactionType(value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="deposit">
                  <div className="flex items-center gap-2">
                    <Plus className="w-4 h-4 text-success" />
                    <span>Deposit</span>
                  </div>
                </SelectItem>
                <SelectItem value="withdraw">
                  <div className="flex items-center gap-2">
                    <Minus className="w-4 h-4 text-destructive" />
                    <span>Withdraw</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label>Amount (USD)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
              <Input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-7"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          {/* Note */}
          <div className="space-y-2">
            <Label>Note (Optional)</Label>
            <Textarea
              placeholder="Add a note for this transaction..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={500}
              rows={3}
            />
            <p className="text-xs text-muted-foreground text-right">{note.length}/500</p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!isValid}>
            {transactionType === "deposit" ? (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Deposit
              </>
            ) : (
              <>
                <Minus className="w-4 h-4 mr-2" />
                Withdraw
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
