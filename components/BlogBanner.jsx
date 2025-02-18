"use client";
import React from "react";
import { motion } from "framer-motion";

const BlogBanner = () => {
  return (
    <motion.section
      className="relative flex flex-col "
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
    >
      <div className="flex flex-col justify-center items-center ">
        <div className="min-h-[180px] w-full flex flex-col justify-center items-center px-4">
          <h1 className="text-4xl md:text-4xl lg:text-6xl font-semibold max-w-7xl mx-auto text-center relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-700 dark:from-neutral-800 dark:via-white dark:to-white ">
            Catch up on the latest <br />
            <div className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] to-[#E114E5] pb-2">
              Sanity Esports
            </div>
          </h1>
        </div>
      </div>
    </motion.section>
  );
};

export default BlogBanner;
