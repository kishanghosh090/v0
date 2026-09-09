"use client";

import ProjectsForm from "@/modules/home/components/project-form";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { onInvoke } from "@/modules/home/actions";

const Page = () => {
  return (
    <div className="flex items-center justify-center w-full px-4 py-8">
      <Button
        onClick={() => {
          onInvoke();
        }}
      >
        Invoke Ai Agent
      </Button>
      <div className="max-w-5xl w-full">
        <section className="space-y-8 flex flex-col items-center">
          <div className="flex flex-col items-center">
            <Logo className="h-12 w-auto md:h-16 text-primary" />
          </div>
          <h1 className="text-2xl md:text-5xl lg:text-6xl font-bold text-center tracking-tight text-balance">
            Build Something with{" "}
            <span className="bg-gradient-to-r from-primary via-ring to-foreground bg-clip-text text-transparent drop-shadow-sm">
              Venthen Build
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground text-center">
            Create apps and websites by chatting with AI
          </p>

          <div className="max-w-3xl w-full">
            <ProjectsForm />
          </div>
          {/* <ProjectList /> */}
        </section>
      </div>
    </div>
  );
};

export default Page;
