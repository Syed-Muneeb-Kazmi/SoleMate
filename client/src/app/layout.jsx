import { Inter, Outfit } from "next/font/google";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: {
    default: "SoleMate — Premium Footwear Store",
    template: "%s | SoleMate",
  },
  description:
    "Discover premium footwear for men, women, and kids at SoleMate. Shop the latest styles in running shoes, sneakers, heels, and more with free shipping on orders over PKR 10,000.",
  keywords: ["footwear", "shoes", "sneakers", "running shoes", "SoleMate", "online shoe store"],
  authors: [{ name: "SoleMate" }],
  openGraph: {
    type: "website",
    siteName: "SoleMate",
    title: "SoleMate — Premium Footwear Store",
    description:
      "Discover premium footwear for men, women, and kids. Shop the latest styles with free shipping on orders over PKR 10,000.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col antialiased bg-background text-foreground transition-colors duration-200">
        <ThemeProvider>
          <AuthProvider>
            <TooltipProvider>
              {children}
            </TooltipProvider>
          </AuthProvider>
        </ThemeProvider>
        <Toaster
          position="top-right"
          richColors
          closeButton
          toastOptions={{
            duration: 3000,
          }}
        />
      </body>
    </html>
  );
}
