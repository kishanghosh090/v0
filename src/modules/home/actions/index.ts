"use server";
import { inngest } from "@/inngest/client";

export const onInvoke = async () => {
  const val = await inngest.send({
    name: "agent/hello",
  });
  console.log(val);
};
