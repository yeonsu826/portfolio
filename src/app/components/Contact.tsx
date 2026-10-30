import { useLang } from "../context/LangContext";

const CHANNELS = [
  { label: "Email", value: "yeonsu826@gmail.com", href: "mailto:yeonsu826@gmail.com" },
  { label: "LinkedIn", value: "linkedin.com/in/yeonsu0826", href: "https://www.linkedin.com/in/yeonsu0826/" },
  { label: "GitHub", value: "github.com/yeonsu826", href: "https://github.com/yeonsu826" },
  { label: "Instagram", value: "@yeon_ddooo", href: "https://www.instagram.com/yeon_ddooo/" },
  { label: "Blog", value: "blog.naver.com/infoinno1010", href: "https://blog.naver.com/infoinno1010" },
];

export default function Contact() {
  const { t } = useLang();

  return (
    <div id="contact" className="scroll-mt-24 w-full flex-1 min-h-0 flex flex-col">
      <h3 className="font-['Fraunces'] font-light text-white leading-tight mb-4 text-2xl md:text-3xl shrink-0">
        {t.contact}
      </h3>
      <ul className="list-none m-0 p-0 flex-1 min-h-0 grid grid-cols-[repeat(auto-fit,minmax(12.5rem,1fr))] auto-rows-fr gap-px bg-white/10 border border-white/10 rounded-2xl overflow-hidden">
        {CHANNELS.map((channel) => (
          <li key={channel.label} className="bg-card min-h-0">
            <a
              href={channel.href}
              target="_blank"
              rel="noreferrer"
              className="flex flex-col gap-1.5 px-5 py-4 h-full justify-center transition-colors hover:bg-white/[0.06]"
            >
              <span className="font-['JetBrains_Mono'] text-sm sm:text-base tracking-[0.14em] uppercase text-primary">
                {channel.label}
              </span>
              <span className="font-['Figtree'] text-sm sm:text-base text-white/90 truncate">
                {channel.value}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
