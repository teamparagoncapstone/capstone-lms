import { cn } from "@/lib/utils";
import {
  Menubar,
  MenubarContent,
  MenubarMenu,
  MenubarTrigger,
  MenubarSeparator,
} from "@/components/ui/menubar";
import { Separator } from "@/components/ui/separator";
import { list } from "../data/lists";
import { CircleUserRoundIcon, FileIcon, LoaderCircle } from "lucide-react";
import Link from "next/link";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  lists: list[];
}

export function Sidebar({ className }: SidebarProps) {
  return (
    <div className={cn(className)}>
      <div className="py-2">
        <h2 className="mb-4 px-6 text-lg font-extrabold tracking-tight">
          Administrator Panel
        </h2>
        <Separator />
        {/* User Accounts Section */}
        <div className="space-y-5">
          <h3 className="text-md text-center font-bold text-gray-800 mt-4 mb-2">
            User Accounts
          </h3>
          <Separator />
          <div className="space-y-2">
            <div className="mb-2">
              <Link href="/admin-dashboard/users">
                <button className="flex items-center w-full p-2 text-left bg-gray-200 rounded hover:bg-gray-300">
                  <CircleUserRoundIcon className="mr-2" />
                  Add Admin Account
                </button>
              </Link>
            </div>
            <div className="mb-2">
              <Link href="/admin-dashboard/educators">
                <button className="flex items-center w-full p-2 text-left bg-gray-200 rounded hover:bg-gray-300">
                  <CircleUserRoundIcon className="mr-2" />
                  Add Educator Account
                </button>
              </Link>
            </div>
            <div className="mb-2">
              <Link href="/admin-dashboard/students">
                <button className="flex items-center w-full p-2 text-left bg-gray-200 rounded hover:bg-gray-300">
                  <CircleUserRoundIcon className="mr-2" />
                  Add Student Account
                </button>
              </Link>
            </div>
            <Separator />
            <div className="mb-2">
              <Link href="/admin-dashboard/auditLogs">
                <button className="flex items-center w-full p-2 text-left bg-gray-200 rounded hover:bg-gray-300">
                  <FileIcon className="mr-2" />
                  View Audit Logs
                </button>
              </Link>
            </div>
            <div className="mb-2">
              <Link href="/admin-dashboard/progressBar">
                <button className="flex items-center w-full p-2 text-left bg-gray-200 rounded hover:bg-gray-300">
                  <LoaderCircle className="mr-2" />
                  Progress Bar
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Reports Section (optional) */}
        {/* <div className="py-4">
          <h3 className="px-6 text-md font-semibold">Reports</h3>
          <div className="space-y-2">
            <Link href="/admin-dashboard/quiz-performance">
              <button className="flex items-center w-full p-2 text-left bg-gray-200 rounded hover:bg-gray-300">
                <FileTextIcon className="mr-2" />
                Quiz Performance
              </button>
            </Link>
            <Link href="/admin-dashboard/voice-exercise">
              <button className="flex items-center w-full p-2 text-left bg-gray-200 rounded hover:bg-gray-300">
                <FileTextIcon className="mr-2" />
                Voice Exercise Reports
              </button>
            </Link>
            <Link href="/admin-dashboard/comprehension-history">
              <button className="flex items-center w-full p-2 text-left bg-gray-200 rounded hover:bg-gray-300">
                <FileTextIcon className="mr-2" />
                Comprehension History
              </button>
            </Link>
          </div>
        </div> */}
      </div>
    </div>
  );
}
