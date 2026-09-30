import React from "react";
import {   X } from "lucide-react";
import type { Hotspot } from "../types";

interface GroupDetailsTabProps {
  selectedSpot: Hotspot;
  onClose: () => void;
}

export const GroupDetailsTab: React.FC<GroupDetailsTabProps> = ({
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-50 flex flex-col overflow-hidden text-slate-900 animate-in fade-in duration-200">
      {/* Drawer Header */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-8 py-4 shrink-0">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
          
            <span>
              Group & Hotspot Details
            </span>
          </h2>
          
        </div>

        <button
          onClick={onClose}
          className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition active:scale-95"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 p-8 overflow-y-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
       
                  { /* Your Code */}
        
        </div>
      </div>
    </div>
  );
};