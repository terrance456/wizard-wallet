import { MonthlyDebt } from "@prisma/client";
import React from "react";
import { Badge } from "../../ui/badge";

interface BalanceAmountProps {
  data: MonthlyDebt[];
}

interface BalanceInfo {
  pendingBalance: number;
  totalBalance: number;
}

const BalanceAmount: React.FC<BalanceAmountProps> = ({ data = [] }: BalanceAmountProps) => {
  const amount: BalanceInfo = React.useMemo(
    () =>
      data.reduce(
        (prev: BalanceInfo, current: MonthlyDebt) => {
          if (current.pending) {
            prev.pendingBalance += current.amount;
          }
          prev.totalBalance += current.amount;
          return prev;
        },
        { pendingBalance: 0, totalBalance: 0 }
      ),
    [data]
  );
  const isDanger: boolean = React.useMemo(() => (amount.pendingBalance / amount.totalBalance) * 100 > 50, [amount]);

  return <Badge variant={isDanger ? "destructive" : "default"}>Remaining: RM {amount.pendingBalance}</Badge>;
};

export default BalanceAmount;
