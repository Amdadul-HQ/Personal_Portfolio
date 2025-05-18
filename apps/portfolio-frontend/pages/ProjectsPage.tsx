'use client';
import { RevealLinks } from '@/components/common/RevealLinks';
import ScrollElement from '@/components/ui/scroll-element';
import { ProjectsSection } from '@/modules/projects-section';

const ProjectsPage = () => {

  return (
    <>
      <section className="relative grid min-h-screen w-full place-content-center overflow-hidden ">
        <h2 className="relative z-0 text-[14vw] font-black text-neutral-800 md:text-[200px]">
          PROJECTS<span className="text-orange-500">.</span>
        </h2>
      </section>
      <ProjectsSection/>
      <ScrollElement className='mt-10'>
            <RevealLinks />
      </ScrollElement>
    </>
  );
}

export default ProjectsPage;