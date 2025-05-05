import React from 'react'
import Sidebar from "./Sidebar"
import { Outlet } from 'react-router-dom'

export const StaffLayout = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}

export default StaffLayout;
