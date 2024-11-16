import { nextFetch } from "@/src/apis/fetch";
import { ApiRoutes } from "@/src/apis/routes.enum";
import ExpensesView from "@/src/components/common/main/ExpensesView";
import { MonthlyDebt } from "@prisma/client";

export default async function Home() {
  const monthDebtList: Array<MonthlyDebt> = await nextFetch(ApiRoutes.getMonthDebts);

  return (
    <main className="container px-3 sm:px-8 h-full">
      <ExpensesView data={monthDebtList} />
    </main>
  );
}
