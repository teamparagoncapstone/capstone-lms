'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card"

import TeamSwitcher from "@/app/(app)/grade-three-dashboard/_components/team-switcher"
import { UserNav } from "@/app/(app)/grade-three-dashboard/_components/user-nav"
import { ModeToggle } from "@/components/mode-toggle"
import { SystemMenu } from "../_components/system-menu"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import NextVideo from 'next-video'
import sample from '@/videos/sample.mp4'

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from 'next/navigation'; 



interface Module {
  moduleTitle: string;
  moduleDescription: string;
  learnOutcome1: string;
  videoModule: string;


}
export default function ModuleReadingPage() {
    const [module, setModule] = useState<Module | null>(null);
    const [loading, setLoading] = useState(true);
    const searchParams = useSearchParams();
    const router = useRouter(); 
    
    useEffect(() => {
      const title = searchParams.get('title');
      const video = searchParams.get('video');
      const description = searchParams.get('description');
      const learnOutcome = searchParams.get('learnOutcome');
    
    if (title && video && description && learnOutcome){
      setModule({
        moduleTitle: title,
        videoModule: video,
        moduleDescription: description,
        learnOutcome1: learnOutcome,
    });
    }
    setLoading(false);
  }, [searchParams]);
  
  const handleEndModule = () => {
    router.push('/grade-three-dashboard/module-homepage');
  };
  const handleStartVoice = () => {
    const title = module?.moduleTitle ? encodeURIComponent(module.moduleTitle) : '';
    router.push(`/grade-three-dashboard/voice-exercises?title=${title}`); 
};
  if(loading){
    return <p>Loading...</p>;
  }
  if (!module) {
    return <p>No module data available.</p>;
  }

  return (
    
      <div className="relative w-full md:h-16 "  >
        <div className="w-full h-auto md:h-16">
          <div className="flex h-16 items-center px-4">
            <div className="flex-1 flex items-center space-x-2 md:pr-2">
              <div className="hidden sm:block pr-2">
                <TeamSwitcher />
              </div>
              <div className="flex pl-2">
                <SystemMenu />
              </div>
            </div>

            <div className="ml-auto flex items-center space-x-2">
              
              <ModeToggle />
              <UserNav />
            </div>
          </div>
          <Separator />
        </div>
        <div className="relative flex-1 p-8 md:p-4 pt-6 h-screen w-full bg-cover bg-center">
          <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url("/images/reading-module.png")', filter: 'blur(6px)' }}></div>
          </div>
          <div className="relative z-10 bg-opacity-60 p-8">
          <div className="flex flex-col items-center">
          <h2 className="text-4xl font-black mb-8 px-3 py-3 rounded-lg bg-indigo-300 border border-black ">Module for Grade 1</h2>
          <div className="flex flex-col md:flex-row w-full max-w-7xl">
              <div className="flex-1 flex items-center justify-center mb-4 md:mb-0">
              <Card className="w-full max-w-2xl h-[500px] bg-amber-300 shadow-2xl shadow-neutral-900 ">
                  <CardContent className="flex items-center justify-center h-full">
                    <NextVideo src={module.videoModule} />
                  </CardContent>
                </Card>
                </div>
                <div className="flex-1 flex flex-col items-start pl-4 text-wrap break-all">
                <Card className="w-full max-w-2xl h-[500px] shadow-2xl shadow-neutral-900 bg-cover bg-bottom " style={{ backgroundImage: 'url("/images/reading3.png")' }} >
                  <CardTitle className="text-3xl font-extrabold  text-center">Module Title: <p className="font-normal text-2xl font-sans  text-center">{module.moduleTitle}</p></CardTitle>
                  <CardDescription className="text-xl font-extrabold text-black pt-4 pl-2">
                    Description: <p className="font-normal text-xl font-sans">{module.moduleDescription}</p>
                  </CardDescription>
                  <CardContent className="text-xl font-extrabold pt-4 pl-2">
                    Learning Outcomes: <p className="font-normal text-xl font-sans">{module.learnOutcome1}</p>
                  </CardContent>
                </Card>
              </div>
              </div>
            <div className="mt-4 flex justify-center w-full">
              <Button size='lg' className="mr-4 mt-2 drop-shadow-2xl shadow-black transition ease-in-out delay-100 bg-blue-500 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300" onClick={handleEndModule}>End Module</Button>
              <Button size='lg' className="mr-4 mt-2 drop-shadow-2xl shadow-black transition ease-in-out delay-100 bg-blue-500 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300" onClick={handleStartVoice}>Start Voice</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}