import { Button } from "@/components/ui/button"
import React from 'react'

function WelcomeBanner() {
        return (
            <div className="px-4 py-8 sm:px-8 sm:py-12 bg-gradient-to-r from-blue-500 via-violet-500 to-blue-700 rounded-2xl shadow-xl text-center">
                <h2 className="font-bold text-2xl sm:text-3xl md:text-4xl mb-2 text-white drop-shadow-lg tracking-tight leading-tight">
                    Ready to Transform Your Career?
                </h2>
                <p className="text-base sm:text-lg md:text-xl mb-6 text-blue-100 opacity-90 leading-relaxed">
                    Join thousands who've discovered their perfect career path with AI guidance.
                </p>
                <Button
                    size="lg"
                    className="bg-white text-blue-700 font-bold hover:bg-blue-50 text-base sm:text-lg px-6 sm:px-10 py-2.5 sm:py-3.5 rounded-full shadow-md border-none transition-all duration-200"
                >
                    Get Started for Free
                </Button>
            </div>
        );
}

export default WelcomeBanner
 