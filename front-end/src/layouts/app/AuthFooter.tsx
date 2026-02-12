"use client";

export default function AuthFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="py-[7px] z-10 max-w-[1400px] w-full m-auto border-t rounded-t-xl border-[var(--border)] bg-[var(--surface)]">
      <div className="container mx-auto px-4">
        <p className="text-xs text-center text-[var(--text-muted)]">
          © {year}{" "}
          <a
            href="https://aniq-ui.com/en"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--text)] transition-colors underline"
          >
            Aniq-ui
          </a>
          . All rights reserved.
        </p>
      </div>
    </footer>
  );
}
