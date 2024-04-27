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

type TicketData = {
  id: string;
  status: string;
  created: number;
  amount_total: number;
  customer_details: {
    name: string;
    email: string;
  };
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

  const tickets = await db.subAccount.findUnique({
    where: {
      id: params.subaccountId, // replace with the actual subAccountId
    },
    include: {
      Pipeline: {
        include: {
          Lane: {
            include: {
              Tickets: {
                include: {
                  Customer: true, // Assuming you want customer details
                  Assigned: true, // Assuming you want assigned user details
                },
              },
            },
          },
        },
      },
    },
  });

  let data1: any = [];
  // Iterate over the nested structure to access all tickets
  tickets?.Pipeline.forEach((pipeline) => {
    pipeline.Lane.forEach((lane) => {
      lane.Tickets.forEach((ticket) => {
        // For each ticket, create a structured object and push it to the data array
        const valueInCents = ticket.value ? +ticket.value.toString() * 100 : 0;
        data1.push({
          id: ticket.id,
          status: ticket.status, // Assuming status is stored directly in the ticket
          created: new Date(ticket.createdAt).getTime(),
          amount_total: valueInCents, // Assuming value needs to be transformed to cents
          customer_details: ticket.Customer
            ? {
                name: ticket.Customer.name, // Assuming name is stored directly in the Customer model
                email: ticket.Customer.email, // Assuming email is also stored directly
              }
            : { name: "Unknown", email: "No email provided" },
        });
      });
    });
  });
  console.log(data1);
  const checkoutSessions = {
    data: data1,
  };

  sessions = checkoutSessions.data.map((session: TicketData) => ({
    ...session,
    created: new Date(session.created).toLocaleDateString(),
    amount_total: session.amount_total ? session.amount_total / 100 : 0,
  }));

  totalClosedSessions = checkoutSessions.data
    .filter((session: TicketData) => session.status === "CLOSE")
    .map((session: TicketData) => ({
      ...session,
      created: new Date(session.created).toLocaleDateString(),
      amount_total: session.amount_total ? session.amount_total / 100 : 0,
    }));

  totalPendingSessions = checkoutSessions.data
    .filter(
      (session: TicketData) =>
        session.status === "OPEN" || session.status === "expired"
    )
    .map((session: TicketData) => ({
      ...session,
      created: new Date(session.created).toLocaleDateString(),
      amount_total: session.amount_total ? session.amount_total / 100 : 0,
    }));

  net = +totalClosedSessions
    .reduce(
      (total: number, session: TicketData) =>
        total + (session.amount_total || 0),
      0
    )
    .toFixed(2);

  potentialIncome = +totalPendingSessions
    .reduce(
      (total: number, session: TicketData) =>
        total + (session.amount_total || 0),
      0
    )
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
                      ? totalClosedSessions.map((session: TicketData) => (
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
