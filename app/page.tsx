"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Vault } from "lucide-react";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { motion } from "motion/react"

export default function Home() {
  return (
    <AuroraBackground>
      <motion.div
        initial={{ opacity: 0.0, y: 0 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="relative flex flex-col gap-4 items-center justify-center px-4"
      >

        <div className="min-h-screen flex flex-col">
          <header>
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
              <h1 className="flex gap-2 items-center text-xl font-bold">
                <Vault />
                LoanPick
              </h1>
            </div>
          </header>

          <main className="flex-1 flex items-center justify-center px-4">
            <div className="max-w-2xl text-center space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1">
                <span className="h-2 w-2 rounded-full bg-blue-400"></span>
                <span className="text-sm">Now with AI Chat Assistant</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">
                Find Your Perfect Loan Match
              </h1>
              <p className="text-lg text-muted-foreground">
                Compare loan products from top banks, get personalized recommendations,
                and chat with AI to find the best loan for your needs.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Link href="/dashboard">
                  <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 group">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/products">
                  <Button size="lg" variant="outline">Browse Products</Button>
                </Link>
              </div>
            </div>
          </main>

          <footer className="py-6">
            <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
              © 2025 LoanPick. All rights reserved.
            </div>
          </footer>
        </div>

      </motion.div>
    </AuroraBackground>
  );
}
