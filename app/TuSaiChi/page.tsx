'use client';

import { motion } from 'framer-motion';
import AdminProjects from '@/components/admin/AdminProjects';
// import { UserButton, useUser } from '@clerk/nextjs';

export default function TuSaiChiPage() {
  // const { user, isLoaded } = useUser();

  // if (!isLoaded) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-[#1E1E1D]">
  //       <div className="text-white">Loading...</div>
  //     </div>
  //   );
  // }

  return (
    <div className="h-full min-h-screen bg-[#1E1E1D] text-white">
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-6 flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-light tracking-tight">
            TuSaiChi Admin
          </h1>
          {/* <UserButton /> */}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-8 pb-20">
        {/* {user && (
          <div className="mb-8 text-sm text-gray-500">
            Signed in as: {user.emailAddresses[0]?.emailAddress}
          </div>
        )} */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8">
            <h2 className="text-xl font-medium mb-2">Projects</h2>
            <p className="text-gray-500 text-sm">
              View all projects with their cell properties, images, and configuration
            </p>
          </div>

          <AdminProjects />
        </motion.div>
      </div>
    </div>
  );
}
