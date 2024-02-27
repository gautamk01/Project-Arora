import React from "react";
import { pricingCards } from "@/lib/constants";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check } from "lucide-react";
import clsx from "clsx";
import Link from "next/link";

type Props = {};

const Section_2 = (props: Props) => {
  return (
    <section className="flex justify-center items-center flex-col gap-4 md:!mt-30 mt-[60px]">
      <h2 className="text-4xl text-center"> Choose what fits you right</h2>
      <p className="text-muted-foreground text-center">
        Our straightforward pricing plans are tailored to meet your needs. If
        {" you're"} not <br />
        ready to commit you can get started for free.
      </p>
      <div className="flex  justify-center gap-4 flex-wrap mt-6">
        {pricingCards.map((card) => (
          //WIP: Wire up free product from stripe
          <Card
            key={card.title}
            className={clsx("w-[300px] flex flex-col justify-between", {
              "border-2 border-primary": card.title === "Unlimited Saas",
            })}
          >
            <CardHeader>
              <CardTitle
                className={clsx("", {
                  "text-muted-foreground": card.title !== "Unlimited Saas",
                })}
              >
                {card.title}
              </CardTitle>
              <CardDescription>
                {pricingCards.find((c) => c.title === card.title)?.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <span className="text-4xl font-bold">{card.price}</span>
              <span className="text-muted-foreground">
                <span>/m</span>
              </span>
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-4">
              <div>
                {pricingCards
                  .find((c) => c.title === card.title)
                  ?.features.map((feature) => (
                    <div key={feature} className="flex gap-2">
                      <Check />
                      <p>{feature}</p>
                    </div>
                  ))}
              </div>
              <Link
                href={`/agency?plan=${card.priceId}`}
                className={clsx(
                  "w-full text-center bg-primary p-2 rounded-md",
                  {
                    "!bg-muted-foreground": card.title !== "Unlimited Saas",
                  }
                )}
              >
                Get Started
              </Link>
            </CardFooter>
          </Card>
        ))}
        {/* <Card className={clsx("w-[300px] flex flex-col justify-between")}>
      <CardHeader>
        <CardTitle
          className={clsx({
            "text-muted-foreground": true,
          })}
        >
          {pricingCards[0].title}
        </CardTitle>
        <CardDescription>{pricingCards[0].description}</CardDescription>
      </CardHeader>
      <CardContent>
        <span className="text-4xl font-bold">$0</span>
        <span>/ month</span>
      </CardContent>
      <CardFooter className="flex flex-col  items-start gap-4 ">
        <div>
          {pricingCards
            .find((c) => c.title === "Starter")
            ?.features.map((feature) => (
              <div key={feature} className="flex gap-2">
                <Check />
                <p>{feature}</p>
              </div>
            ))}
        </div>
        <Link
          href="/agency"
          className={clsx(
            "w-full text-center bg-primary p-2 rounded-md",
            {
              "!bg-muted-foreground": true,
            }
          )}
        >
          Get Started
        </Link>
      </CardFooter>
    </Card> */}
      </div>
    </section>
  );
};

export default Section_2;
