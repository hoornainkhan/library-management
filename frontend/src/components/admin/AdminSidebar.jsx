import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  HiOutlineChartBar,
  HiOutlineClipboardDocumentList,
  HiOutlinePencilSquare,
} from "react-icons/hi2";

const AdminSidebar = () => {
  return (
    <aside className="w-64 border-r border-gray-300 h-full">
      <div className="flex flex-col pt-8 gap-6">
        <NavLink
          to="/admin"
          end
          className={({ isActive }) =>
            `flex items-center gap-4 px-8 py-3 transition ${
              isActive ? 'bg-[#F3E4C9] text-[#8B5E3C]' : 'text-[#0A2947] hover:bg-[#F3E4C9]'
            }`
          }
        >
          <HiOutlineChartBar size={22} />
          <span>Stats</span>
        </NavLink>

        <NavLink
          to="/admin/logs"
          className={({ isActive }) =>
            `flex items-center gap-4 px-8 py-3 transition ${
              isActive ? 'bg-[#F3E4C9] text-[#8B5E3C]' : 'text-[#0A2947] hover:bg-[#F3E4C9]'
            }`
          }
        >
          <HiOutlineClipboardDocumentList size={22} />
          <span>Logs</span>
        </NavLink>

        <NavLink
          to="/admin/edit"
          className={({ isActive }) =>
            `flex items-center gap-4 px-8 py-3 transition ${
              isActive ? 'bg-[#F3E4C9] text-[#8B5E3C]' : 'text-[#0A2947] hover:bg-[#F3E4C9]'
            }`
          }
        >
          <HiOutlinePencilSquare size={22} />
          <span>Edit</span>
        </NavLink>
      </div>
    </aside>
  );
};

export default AdminSidebar;