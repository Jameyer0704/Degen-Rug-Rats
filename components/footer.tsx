"use client"

const Footer = () => {
  return (
    <footer className="bg-black/80 border-t border-gray-800 mt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h3 className="text-xl font-orbitron text-rat-primary mb-4">Degen Rug-Rats</h3>
          <p className="text-gray-400 mb-4 max-w-md mx-auto">
            The underground community for the most degen Solana token. Embrace the sewers, embrace the gains.
          </p>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Degen Rug-Rats. All rights reserved.</p>
          <p className="mt-1">
            <span className="font-mono text-xs">Contract: G7o5yXGyQPxUbPPJC6Apme7p5M1YqVoapQ2YbUsWpump</span>
          </p>
          <div className="flex justify-center gap-4 mt-4">
            <a
              href="https://discord.gg/TnHKnJKP5w"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-rat-primary transition-colors"
            >
              Discord
            </a>
            <a
              href="https://x.com/MoandChi"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-rat-primary transition-colors"
            >
              Twitter
            </a>
            <a
              href="https://pump.fun/coin/G7o5yXGyQPxUbPPJC6Apme7p5M1YqVoapQ2YbUsWpump"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-rat-primary transition-colors"
            >
              PumpFun
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
