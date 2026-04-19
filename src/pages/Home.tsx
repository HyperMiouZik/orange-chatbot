import React from "react";
import { Wizard } from "@/components/Wizard";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-gray-200 flex flex-col items-center sm:justify-center px-0 sm:px-4 py-0 sm:py-8 font-sans">
      <Wizard />
      
      <p className="mt-6 text-sm text-gray-400 font-medium text-center hidden sm:block">
        Prototype interactif — projet design thinking
      </p>
    </div>
  );
}
