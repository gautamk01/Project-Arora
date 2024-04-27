import BlurPage from "@/components/global/blur-page";
import CircleProgress from "@/components/global/circle-progress";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/lib/db";
import { AreaChart, BadgeDelta } from "@tremor/react";
import { Contact2, IndianRupee, ShoppingCart } from "lucide-react";
import React from "react";

type Props = {
  params: { subaccountId: string };
};

const Page = async ({ params }: Props) => {
  let currency = "INR";
  let sessions;
  let totalClosedSessions;
  let totalPendingSessions;
  let net = 0;
  let potentialIncome = 0;
  let closingRate = 0;

  const subaccountDetails = await db.subAccount.findUnique({
    where: {
      id: params.subaccountId,
    },
  });
  const currentYear = new Date().getFullYear();
  const startDate = new Date(`${currentYear}-01-01T00:00:00Z`).getTime() / 1000;
  const endDate = new Date(`${currentYear}-12-31T23:59:59Z`).getTime() / 1000;
  if (!subaccountDetails) return;
  const checkoutSessions = {
    data: [
      {
        id: "sess_1",
        status: "complete",
        created: Date.now() - 86400000, // Yesterday
        amount_total: 50000, // $500.00
        customer_details: { name: "John Doe", email: "john.doe@example.com" },
      },
      {
        id: "sess_2",
        status: "open",
        created: Date.now() - 172800000, // 2 days ago
        amount_total: 30000, // $300.00
        customer_details: { name: "Jane Doe", email: "jane.doe@example.com" },
      },
      {
        id: "sess_3",
        status: "complete",
        created: Date.now() - 400000000, // Open session
        amount_total: 20000, // $200.00
        customer_details: { name: "Jim Beam", email: "jim.beam@example.com" },
      },
      {
        id: "sess_4",
        status: "expired",
        created: Date.now() - 500000000, // Expired session
        amount_total: 25000, // $250.00
        customer_details: {
          name: "Jack Daniels",
          email: "jack.daniels@example.com",
        },
      },
      // Add more sessions as needed
    ],
  };

  sessions = checkoutSessions.data.map((session) => ({
    ...session,
    created: new Date(session.created).toLocaleDateString(),
    amount_total: session.amount_total ? session.amount_total / 100 : 0,
  }));

  totalClosedSessions = checkoutSessions.data
    .filter((session) => session.status === "complete")
    .map((session) => ({
      ...session,
      created: new Date(session.created).toLocaleDateString(),
      amount_total: session.amount_total ? session.amount_total / 100 : 0,
    }));

  totalPendingSessions = checkoutSessions.data
    .filter(
      (session) => session.status === "open" || session.status === "expired"
    )
    .map((session) => ({
      ...session,
      created: new Date(session.created).toLocaleDateString(),
      amount_total: session.amount_total ? session.amount_total / 100 : 0,
    }));

  net = +totalClosedSessions
    .reduce((total, session) => total + (session.amount_total || 0), 0)
    .toFixed(2);

  potentialIncome = +totalPendingSessions
    .reduce((total, session) => total + (session.amount_total || 0), 0)
    .toFixed(2);

  closingRate = +(
    (totalClosedSessions.length / checkoutSessions.data.length) *
    100
  ).toFixed(2);

  return (
    <BlurPage>
      <div className="relative h-full">
        <div className="flex flex-col gap-4 pb-6">
          <div className="flex gap-4 flex-col xl:!flex-row">
            <Card className="flex-1 relative">
              <CardHeader>
                <CardDescription>Income</CardDescription>
                <CardTitle className="text-4xl">
                  {net ? `${currency} ${net.toFixed(2)}` : `$0.00`}
                </CardTitle>
                <small className="text-xs text-muted-foreground">
                  For the year {currentYear}
                </small>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Total revenue generated as reflected in your stripe dashboard.
              </CardContent>
              <IndianRupee className="absolute right-4 top-4 text-muted-foreground" />
            </Card>
            <Card className="flex-1 relative">
              <CardHeader>
                <CardDescription>Potential Income</CardDescription>
                <CardTitle className="text-4xl">
                  {potentialIncome
                    ? `${currency} ${potentialIncome.toFixed(2)}`
                    : `$0.00`}
                </CardTitle>
                <small className="text-xs text-muted-foreground">
                  For the year {currentYear}
                </small>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                This is how much you can close.
              </CardContent>
              <Contact2 className="absolute right-4 top-4 text-muted-foreground" />
            </Card>
            {/* <PipelineValue subaccountId={params.subaccountId} /> */}

            <Card className="xl:w-fit">
              <CardHeader>
                <CardDescription>Conversions</CardDescription>
                <CircleProgress
                  value={closingRate}
                  description={
                    <>
                      {sessions && (
                        <div className="flex flex-col">
                          Total Carts Opened
                          <div className="flex gap-2">
                            <ShoppingCart className="text-rose-700" />
                            {sessions.length}
                          </div>
                        </div>
                      )}
                      {totalClosedSessions && (
                        <div className="flex flex-col">
                          Closed
                          <div className="flex gap-2">
                            <ShoppingCart className="text-emerald-700" />
                            {totalClosedSessions.length}
                          </div>
                        </div>
                      )}
                    </>
                  }
                />
              </CardHeader>
            </Card>
          </div>

          <div className="flex gap-4 flex-col xl:!flex-row">
            <Card className="relative">
              <CardHeader>
                <CardDescription>Funnel Performance</CardDescription>
              </CardHeader>
              <CardContent className=" text-sm text-muted-foreground flex flex-col gap-12 justify-between ">
                {/* <SubaccountFunnelChart data={funnelPerformanceMetrics} /> */}
                <div className="lg:w-[150px]">
                  Total page visits across all funnels. Hover over to get more
                  details on funnel page performance.
                </div>
              </CardContent>
              <Contact2 className="absolute right-4 top-4 text-muted-foreground" />
            </Card>
            <Card className="p-4 flex-1">
              <CardHeader>
                <CardTitle>Checkout Activity</CardTitle>
              </CardHeader>
              <AreaChart
                className="text-sm stroke-primary"
                data={sessions || []}
                index="created"
                categories={["amount_total"]}
                colors={["primary"]}
                yAxisWidth={30}
                showAnimation={true}
              />
            </Card>
          </div>
          <div className="flex gap-4 xl:!flex-row flex-col">
            <Card className="p-4 flex-1 h-[450px] overflow-scroll relative">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Transition History
                  <BadgeDelta
                    className="rounded-xl bg-transparent"
                    deltaType="moderateIncrease"
                    isIncreasePositive={true}
                    size="xs"
                  >
                    +12.3%
                  </BadgeDelta>
                </CardTitle>
                <Table>
                  <TableHeader className="!sticky !top-0">
                    <TableRow>
                      <TableHead className="w-[300px]">Email</TableHead>
                      <TableHead className="w-[200px]">Status</TableHead>
                      <TableHead>Created Date</TableHead>
                      <TableHead className="text-right">Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="font-medium truncate">
                    {totalClosedSessions
                      ? totalClosedSessions.map((session) => (
                          <TableRow key={session.id}>
                            <TableCell>
                              {session.customer_details?.email || "-"}
                            </TableCell>
                            <TableCell>
                              <Badge className="bg-emerald-500 dark:text-black">
                                Paid
                              </Badge>
                            </TableCell>
                            <TableCell>{session.created}</TableCell>

                            <TableCell className="text-right">
                              <small>{currency}</small>{" "}
                              <span className="text-emerald-500">
                                {session.amount_total}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))
                      : "No Data"}
                  </TableBody>
                </Table>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </BlurPage>
  );
};

export default Page;
