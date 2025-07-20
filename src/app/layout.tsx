import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SafeLab AI - 실험실 안전관리 AI 플랫폼",
  description: "AI가 대신 작성하는 실험실 안전문서, 30분 작업을 3분에 완성",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background`}
      >
        <div className="min-h-screen flex flex-col">
          <Header />
          
          <div className="flex flex-1">
            {/* Sidebar */}
            <aside className="hidden lg:block w-64 bg-background-secondary border-r border-border">
              <div className="sticky top-[73px] p-4 h-[calc(100vh-73px)] overflow-y-auto">
                <Sidebar />
              </div>
            </aside>
            
            {/* Main Content Area */}
            <main className="flex-1 overflow-x-hidden">
              <div className="min-h-full">
                {children}
              </div>
            </main>
          </div>
        </div>

        {/* Mobile Sidebar - 모바일 반응형을 위한 준비 */}
        <div className="lg:hidden">
          {/* 추후 모바일 메뉴 토글 기능 추가 예정 */}
        </div>
      </body>
    </html>
  );
}
