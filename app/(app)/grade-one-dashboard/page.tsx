"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import TeamSwitcher from "@/app/(app)/grade-one-dashboard/_components/team-switcher";
import { UserNav } from "@/app/(app)/grade-one-dashboard/_components/user-nav";
import { SystemMenu } from "./_components/system-menu";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  FaClipboardList,
  FaClipboardCheck,
  FaHourglassHalf,
} from "react-icons/fa";
import UnauthorizedPage from "@/components/forms/unauthorized";
import Loading from "./loading";

interface QuizHistoryItem {
  Question: {
    Module: {
      id: string;
      moduleTitle: string;
    };
  };
  completed: boolean;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [quizHistory, setQuizHistory] = useState<QuizHistoryItem[]>([]);
  const [completedModuleTitles, setCompletedModuleTitles] = useState<
    Set<string>
  >(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [assignedCount, setAssignedCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      if (!session) return;

      if (session?.user?.grade !== "GradeOne") {
        setLoading(false);
        return;
      }

      const studentId = session.user.studentId;

      try {
        const quizResponse = await fetch(
          `/api/get-quiz-history?studentId=${studentId}`
        );
        if (!quizResponse.ok) throw new Error("Failed to fetch quiz history");
        const quizData = await quizResponse.json();

        const uniqueQuizTitles = new Set<string>();
        quizData.history.forEach((quiz: QuizHistoryItem) => {
          if (quiz.completed) {
            uniqueQuizTitles.add(quiz.Question.Module.moduleTitle);
          }
        });

        setCompletedModuleTitles(uniqueQuizTitles);
        setQuizHistory(quizData.history);

        const assignedResponse = await fetch(
          `/api/fetch-assigned-modules?studentId=${studentId}`
        );
        if (!assignedResponse.ok)
          throw new Error("Failed to fetch assigned modules");
        const assignedData = await assignedResponse.json();

        const assignedModuleTitles = new Set<string>();
        assignedData.assignedModules.forEach((module: any) => {
          assignedModuleTitles.add(module.moduleTitle);
        });

        setCompletedModuleTitles(
          (prevTitles) =>
            new Set([
              ...Array.from(prevTitles),
              ...Array.from(assignedModuleTitles),
            ])
        );

        const gradeOneResponse = await fetch("/api/grade-one-module");
        if (!gradeOneResponse.ok)
          throw new Error("Failed to fetch grade one modules");
        const gradeOneData = await gradeOneResponse.json();

        setAssignedCount(gradeOneData.count);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [session]);

  if (status === "loading") return <Loading />;

  if (status === "unauthenticated" || session?.user?.grade !== "GradeOne") {
    return <UnauthorizedPage />;
  }

  return (
    <div className="w-full md:h-16 relative">
      <div className="w-full h-auto md:h-16">
        <div className="flex h-16 items-center px-4">
          <div className="hidden sm:block pr-2">
            <TeamSwitcher />
          </div>
          <div className="flex pl-2 z-30">
            <SystemMenu />
          </div>
          <div className="ml-auto flex items-center space-x-2">
            <UserNav />
          </div>
        </div>
        <Separator />
      </div>
      <div
        className="bg-cover bg-center h-screen  absolute top -0 left-0 w-full bg-opacity-100"
        style={{ backgroundImage: 'url("/images/bgdash21.png")' }}
      >
        <div className="flex-1 space-y-4 p-8 md:p-4 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0 md:items-center">
            <h2 className="text-4xl font-bold tracking-tight text-center text-blue-600 z-10">
              Dashboard
            </h2>
            <div>
              <h2 className="text-4xl font-bold tracking-tight text-center text-green-600 z-10">
                Grade 1
              </h2>
            </div>
            <div className="flex items-center space-x-2 z-10">
              <Button
                onClick={() =>
                  router.push("/grade-one-dashboard/module-homepage")
                }
                size="lg"
                className="ml-auto mt-8 mr-4 bg-orange-500 hover:bg-orange-400 transition z-10"
              >
                Go to Module
              </Button>
            </div>
          </div>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsContent value="overview" className="space-y-4 mt-16">
              <div className="container grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card
                  className="bg-blue-300 rounded-lg shadow-md hover:shadow-lg transition transform hover:scale-105 z-10"
                  onClick={() =>
                    router.push("/grade-one-dashboard/module-homepage")
                  }
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xl font-bold text-white flex items-center">
                      <FaClipboardList className="mr-2" /> To-do
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-black">
                      {assignedCount} Assigned
                    </div>
                    <p className="text-sm text-black">
                      activities for this month
                    </p>
                    <div
                      className="h-2 bg-green-200 rounded mt-2"
                      style={{ width: `${(assignedCount / 10) * 100}%` }}
                    ></div>{" "}
                    {/* Simple progress bar */}
                  </CardContent>
                </Card>
                <Card
                  className="bg-red-400 rounded-lg shadow-md hover:shadow-lg transition transform hover:scale-105 z-10"
                  onClick={() =>
                    router.push("/grade-one-dashboard/module-homepage")
                  }
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xl font-bold text-white flex items-center">
                      <FaHourglassHalf className="mr-2" /> In Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-black">
                      {completedModuleTitles.size}
                    </div>
                    <p className="text-sm text-black">unfinished activities</p>
                    <div
                      className="h-2 bg-yellow-200 rounded mt-2"
                      style={{
                        width: `${(completedModuleTitles.size / 10) * 100}%`,
                      }}
                    ></div>
                  </CardContent>
                </Card>
                <Card
                  className="bg-yellow-400 rounded-lg shadow-md hover:shadow-lg transition transform hover:scale-105 z-10"
                  onClick={() =>
                    router.push("/grade-one-dashboard/history-quiz")
                  }
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xl font-bold text-white flex items-center">
                      <FaClipboardCheck className="mr-2" /> Completed
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-black">
                      {completedModuleTitles.size}
                    </div>
                    <p className="text-sm text-black">finished activities</p>
                    <div
                      className="h-2 bg-blue-200 rounded mt-2"
                      style={{
                        width: `${(completedModuleTitles.size / 10) * 100}%`,
                      }}
                    ></div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        {/* Add playful background elements */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-200 rounded-full opacity-30 animate-bounce "></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-yellow-200 rounded-full opacity-30 animate-bounce "></div>
        <div className="absolute top-20 right-20 w-24 h-24 bg-purple-300 rounded-full opacity-40 animate-pulse "></div>
        <div className="absolute bottom-20 left-20 w-28 h-28 bg-green-300 rounded-full opacity-30 animate-spin "></div>
        <div className="absolute top-40 left-5 w-16 h-16 bg-pink-400 rounded-full opacity-50 animate-bounce "></div>
        <div className="absolute bottom-40 right-5 w-20 h-20 bg-orange-300 rounded-full opacity-30 animate-bounce "></div>
        <div className="absolute top-24 left-24 w-36 h-36 bg-red-300 rounded-full opacity-25 animate-bounce "></div>
        <div className="absolute bottom-10 left-40 w-30 h-30 bg-teal-200 rounded-full opacity-35 animate-pulse "></div>
        <div className="absolute top-36 right-5 w-20 h-20 bg-indigo-300 rounded-full opacity-40 animate-spin "></div>
      </div>
    </div>
  );
}
