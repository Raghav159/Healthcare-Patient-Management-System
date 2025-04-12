import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Calendar, 
  Users, 
  UserPlus, 
  FileText, 
  Settings, 
  HelpCircle,
  LogOut
} from 'lucide-react';

const Sidebar: React.FC = () => {
  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200">
      <div className="flex-1 overflow-y-auto py-6 px-4">
        <nav className="space-y-1">
          <NavLink 
            to="/dashboard" 
            className={({ isActive }) => 
              `flex items-center px-3 py-2 rounded-md ${
                isActive 
                  ? 'bg-primary-100 text-primary-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <Home className="mr-3 h-5 w-5" />
            Dashboard
          </NavLink>
          
          <NavLink 
            to="/appointments" 
            className={({ isActive }) => 
              `flex items-center px-3 py-2 rounded-md ${
                isActive 
                  ? 'bg-primary-100 text-primary-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <Calendar className="mr-3 h-5 w-5" />
            Appointments
          </NavLink>
          
          <NavLink 
            to="/patients" 
            className={({ isActive }) => 
              `flex items-center px-3 py-2 rounded-md ${
                isActive 
                  ? 'bg-primary-100 text-primary-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <Users className="mr-3 h-5 w-5" />
            Patients
          </NavLink>
          
          <NavLink 
            to="/doctors" 
            className={({ isActive }) => 
              `flex items-center px-3 py-2 rounded-md ${
                isActive 
                  ? 'bg-primary-100 text-primary-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <UserPlus className="mr-3 h-5 w-5" />
            Doctors
          </NavLink>
          
          <NavLink 
            to="/medical-histories" 
            className={({ isActive }) => 
              `flex items-center px-3 py-2 rounded-md ${
                isActive 
                  ? 'bg-primary-100 text-primary-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <FileText className="mr-3 h-5 w-5" />
            Medical Records
          </NavLink>
        </nav>
      </div>
      
      <div className="p-4 border-t border-gray-200">
        <div className="space-y-1">
          <button className="flex w-full items-center px-3 py-2 text-gray-700 rounded-md hover:bg-gray-100">
            <Settings className="mr-3 h-5 w-5" />
            Settings
          </button>
          
          <button className="flex w-full items-center px-3 py-2 text-gray-700 rounded-md hover:bg-gray-100">
            <HelpCircle className="mr-3 h-5 w-5" />
            Help & Support
          </button>
          
          <button className="flex w-full items-center px-3 py-2 text-red-600 rounded-md hover:bg-red-50">
            <LogOut className="mr-3 h-5 w-5" />
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;