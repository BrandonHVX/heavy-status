interface MasonryGridProps {
  children: React.ReactNode;
  columns?: number;
  gap?: string;
}

export default function MasonryGrid({ children, columns = 3, gap = "gap-3" }: MasonryGridProps) {
  const items = Array.isArray(children) ? children : [children];
  const cols: React.ReactNode[][] = Array.from({ length: columns }, () => []);

  items.forEach((child, i) => {
    cols[i % columns].push(child);
  });

  return (
    <div className={`flex ${gap}`} data-testid="masonry-grid">
      {cols.map((col, i) => (
        <div key={i} className={`flex-1 flex flex-col ${gap}`}>
          {col.map((item, j) => (
            <div key={j}>{item}</div>
          ))}
        </div>
      ))}
    </div>
  );
}
