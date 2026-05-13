export default function Footer() {
  return (
    <footer
      aria-label="Site footer"
      className="border-t border-white/5 bg-[#0d0d14] py-2.5 px-6 flex items-center justify-center"
    >
      <p className="text-xs text-gray-600 tracking-wide">
        Made By Prateek{' '}
        <span aria-label="heart" className="text-red-400 font-bold">&lt;3</span>
      </p>
    </footer>
  );
}
