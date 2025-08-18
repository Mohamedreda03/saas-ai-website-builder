import ProjectForm from "@/modules/home/ui/components/project-form";
import ProjectsList from "@/modules/home/ui/components/projects-list";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col max-w-5xl mx-auto w-full">
      <section className="space-y-6 py-[16vh] 2xl:py-48">
        <div className="flex flex-col items-center">
          <Image
            src="/logo.png"
            alt="Aiwa"
            width={80}
            height={130}
            quality={100}
            className="hidden md:block"
          />
          {/* <img
            src="/logo.png"
            alt="Aiwa"
            className="hidden md:block w-28 h-28"
          /> */}
        </div>
        <h1 className="text-2xl md:text-5xl font-bold text-center">
          Build something with Aiwa
        </h1>
        <p className="text-center text-muted-foreground text-lg md:text-xl">
          Create apps and websites by chatting with AI.
        </p>
        <div className="max-w-3xl mx-auto w-full">
          <ProjectForm />
        </div>
      </section>
      <ProjectsList />
    </div>
  );
}
