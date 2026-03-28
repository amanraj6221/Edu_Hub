import React from "react";
import { Link } from "react-router-dom";
import { Users, User, BookOpen } from "lucide-react";

const Sidebar = ({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) => {
  return (
    <aside className={`h-screen bg-card border-r p-4 ${collapsed ? "w-16" : "w-64"} transition-all`}>
      <div className="flex items-center justify-between mb-6">
        {!collapsed && <h3 className="font-bold">Dashboard</h3>}
        <button onClick={onToggle} className="p-2 rounded-md hover:bg-primary/10">
          <svg width="18" height="18" viewBox="0 0 24 24"><path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
        </button>
      </div>

      <nav className="flex flex-col space-y-2">
        <Link to="/user/dashboard" className="flex items-center space-x-3 p-2 rounded hover:bg-primary/5">
          <User className="w-4 h-4" />
          {!collapsed && <span>Profile</span>}
        </Link>
        <Link to="/user/courses" className="flex items-center space-x-3 p-2 rounded hover:bg-primary/5">
          <BookOpen className="w-4 h-4" />
          {!collapsed && <span>Courses</span>}
        </Link>
        <Link to="/user/faculties" className="flex items-center space-x-3 p-2 rounded hover:bg-primary/5">
          <Users className="w-4 h-4" />
          {!collapsed && <span>Faculties</span>}
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
