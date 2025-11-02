const Header = ({ darkMode, setDarkMode }) => {
  return (
    <header className="header-navbar sticky top-0 z-50 backdrop-blur-sm transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-5 max-w-7xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-4xl leading-none select-none">💰</div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                AI Expense Tracker
              </h1>
              <p className="text-sm sm:text-base mt-0.5 font-medium">
                Smart financial insights powered by AI
              </p>
            </div>
          </div>
          
          <button
            onClick={() => {
              const newMode = !darkMode
              setDarkMode(newMode)
              // Force update immediately
              if (newMode) {
                document.documentElement.classList.add('dark')
              } else {
                document.documentElement.classList.remove('dark')
              }
            }}
            className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 active:scale-95 transition-all duration-200 text-xl border border-gray-200 dark:border-gray-700 shadow-sm"
            aria-label="Toggle dark mode"
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header

