// Render the formatting used by the supplied README as escaped React content.
function InlineText({ text }: { text: string }) {
  return text.split(/(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\((?:https?:\/\/|\/(?!\/))[^)]+\))/g).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={index} className="font-semibold text-white">{part.slice(2, -2)}</strong>;
    if (part.startsWith("`") && part.endsWith("`")) return <code key={index} className="rounded bg-white/10 px-1.5 py-0.5 text-primary">{part.slice(1, -1)}</code>;
    const link = part.match(/^\[([^\]]+)\]\(((?:https?:\/\/|\/(?!\/))[^)]+)\)$/);
    if (link) return <a key={index} href={link[2]} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-4">{link[1]}</a>;
    return part;
  });
}

export function Readme({ text, images, videos }: { text: string; images: string[]; videos: { src: string; label: string }[] }) {
  // Normalize the README's image/caption wrappers without rendering raw HTML.
  const normalized = text
    .replace(/<p\s+align="center">\s*<img\s+src="([^"]+)"\s+width="100%"\s+alt="([^"]*)"\s*\/>\s*<\/p>/g, "![$2]($1)\n\n")
    .replace(/<p\s+align="center">\s*<sub>([^<]*)<\/sub>\s*<\/p>/g, "$1\n\n")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (original, label, path: string) => {
      const filename = path.split("/").pop();
      const src = [...images, ...videos.map(video => video.src)].find(asset => asset.split("/").pop() === filename);
      return src ? `[${label}](${src})` : original;
    });
  return normalized.trim().split(/\r?\n\s*\r?\n/).map((block, index) => {
    const imageLines = block.split(/\r?\n/).map(line => line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/));
    if (imageLines.length > 1 && imageLines.every(match => match && /icon/i.test(match[2].split("/").pop() ?? ""))) {
      return (
        <div key={index} className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {imageLines.map((match, logoIndex) => {
            if (!match) return null;
            const filename = match[2].split("/").pop();
            const src = images.find(path => path.split("/").pop() === filename);
            return src ? (
              <div key={logoIndex} className="overflow-hidden rounded-2xl border border-white/15 bg-white/5 p-2">
                <img src={src} alt={match[1]} loading="lazy" className="aspect-square w-full rounded-xl object-contain" />
              </div>
            ) : <p key={logoIndex}>{match[1]}</p>;
          })}
        </div>
      );
    }
    const image = block.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (image) {
      const filename = image[2].split("/").pop();
      const src = images.find(path => path.split("/").pop() === filename);
      const isAppIcon = /icon/i.test(filename ?? "");
      return src ? <img key={index} src={src} alt={image[1]} loading="lazy" className={isAppIcon ? "mx-auto h-auto w-40 rounded-3xl sm:w-48" : "h-auto w-full rounded-lg"} /> : <p key={index}>{image[1]}</p>;
    }
    if (block.startsWith("# ")) return <h3 key={index} className="text-3xl font-semibold text-white">{block.slice(2)}</h3>;
    if (block.startsWith("## ")) return <h4 key={index} className="pt-4 text-xl font-medium text-primary">{block.slice(3)}</h4>;
    if (block.startsWith("### ")) return <h5 key={index} className="pt-2 text-base font-semibold text-white">{block.slice(4)}</h5>;
    if (block.startsWith("#### ")) return <h6 key={index} className="pt-2 text-sm font-semibold text-white">{block.slice(5)}</h6>;
    if (block.startsWith("|")) {
      const rows = block.split(/\r?\n/).map(line => line.trim().replace(/^\||\|$/g, "").split("|").map(cell => cell.trim()));
      if (rows.length > 1 && rows[1].every(cell => /^:?-+:?$/.test(cell))) {
        return <div key={index} className="overflow-x-auto rounded-lg border border-white/15"><table className="w-full min-w-[400px] text-left text-sm"><thead className="bg-white/5"><tr>{rows[0].map((cell, i) => <th key={i} scope="col" className="px-4 py-3 font-semibold text-white"><InlineText text={cell} /></th>)}</tr></thead><tbody>{rows.slice(2).map((row, i) => <tr key={i} className="border-t border-white/10">{row.map((cell, j) => <td key={j} className="px-4 py-3"><InlineText text={cell} /></td>)}</tr>)}</tbody></table></div>;
      }
    }
    if (block.startsWith("```")) return <pre key={index} className="overflow-x-auto rounded-lg bg-black/40 p-4"><code>{block.replace(/^```[^\n]*\r?\n/, "").replace(/\r?\n```$/, "")}</code></pre>;
    if (block.startsWith("> ")) return <blockquote key={index} className="border-l-2 border-primary pl-4 italic"><InlineText text={block.replace(/^> /gm, "")} /></blockquote>;
    if (/^\d+\. /.test(block)) return <ol key={index} className="list-decimal space-y-3 pl-5">{block.split(/\r?\n/).map((line, i) => <li key={i}><InlineText text={line.replace(/^\d+\. /, "")} /></li>)}</ol>;
    if (block.startsWith("- ")) return <ul key={index} className="list-disc space-y-3 pl-5">{block.split(/\r?\n/).map((line, i) => <li key={i}><InlineText text={line.slice(2)} /></li>)}</ul>;
    return <p key={index}><InlineText text={block} /></p>;
  });
}
