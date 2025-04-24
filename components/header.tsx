"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

// Constants for external links
const PUMPFUN_URL = "https://pump.fun/coin/G7o5yXGyQPxUbPPJC6Apme7p5M1YqVoapQ2YbUsWpump"
const TOKEN_CONTRACT = "G7o5yXGyQPxUbPPJC6Apme7p5M1YqVoapQ2YbUsWpump"
const BUY_TOKEN_URL = `https://jup.ag/swap/SOL-${TOKEN_CONTRACT}`

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState("token")
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)

      // Determine active section based on scroll position
      const sections = ["token", "nfts", "community", "roadmap"]
      const scrollPosition = window.scrollY + 100 // Add offset for header

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const top = element.offsetTop
          const height = element.offsetHeight

          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  const navItems = [
    { name: "Token", path: "#token" },
    { name: "NFTs", path: "#nfts" },
    { name: "Community", path: "#community" },
    { name: "Roadmap", path: "#roadmap" },
  ]

  const scrollToSection = (sectionId: string) => {
    setIsMenuOpen(false)
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-black/80 backdrop-blur-md py-2" : "bg-transparent py-4",
      )}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <a href="#token" className="flex items-center gap-2">
          <div className="h-10 w-40 relative">
            <Image src="/images/degen-logo.png" alt="Degen Rug-Rats" fill className="object-contain" />
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <a
              key={item.path}
              href={item.path}
              onClick={(e) => {
                e.preventDefault()
                scrollToSection(item.path.substring(1))
              }}
              className={cn(
                "font-orbitron text-sm uppercase tracking-wider transition-colors hover:text-rat-primary",
                activeSection === item.path.substring(1) ? "text-rat-primary font-bold" : "text-gray-300",
              )}
            >
              {item.name}
            </a>
          ))}
        </nav>

        <div className="hidden md:block">
          <Button
            className="bg-rat-primary hover:bg-rat-primary/90 text-white"
            onClick={() => window.open(BUY_TOKEN_URL, "_blank")}
          >
            Buy $DEGEN
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-white" onClick={toggleMenu} aria-label="Toggle menu">
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-md border-t border-gray-800">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            {navItems.map((item) => (
              <a
                key={item.path}
                href={item.path}
                onClick={(e) => {
                  e.preventDefault()
                  scrollToSection(item.path.substring(1))
                }}
                className={cn(
                  "font-orbitron text-sm uppercase tracking-wider py-2 transition-colors hover:text-rat-primary",
                  activeSection === item.path.substring(1) ? "text-rat-primary font-bold" : "text-gray-300",
                )}
              >
                {item.name}
              </a>
            ))}

            <Button
              className="bg-rat-primary hover:bg-rat-primary/90 text-white mt-2"
              onClick={() => window.open(BUY_TOKEN_URL, "_blank")}
            >
              Buy $DEGEN
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
