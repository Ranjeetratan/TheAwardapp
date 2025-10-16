export function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="py-8 px-4 border-t border-accent/20">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-sm text-muted-foreground">
          © {currentYear} CofounderBase — Built for Founders.
        </p>
      </div>
    </footer>
  )
}