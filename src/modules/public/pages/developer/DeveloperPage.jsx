import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { Check, ChevronDown, Copy, Menu, Search, X } from 'lucide-react';
import {
  COMPONENT_DOCS,
  DOC_CATEGORIES,
  filterComponentDocs,
  getComponentDoc,
} from '@/developer/catalog';
import ComponentPreview from '@/developer/ComponentPreview';

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function HighlightText({ text, query }) {
  const value = text == null ? '' : String(text);
  const q = query?.trim();
  if (!q || !value) return value;

  const parts = value.split(new RegExp(`(${escapeRegExp(q)})`, 'gi'));
  if (parts.length === 1) return value;

  return parts.map((part, i) =>
    part.toLowerCase() === q.toLowerCase() ? (
      <mark key={`${part}-${i}`} className="rounded-sm bg-amber-200 px-0.5 text-inherit">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

function CodeBlock({ code, label }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="min-w-0 overflow-hidden rounded-xl border border-[#E4E7EC] bg-slate-950">
      <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
        <span className="text-xs font-medium text-slate-300">{label}</span>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-slate-300 hover:bg-white/10 hover:text-white"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-xs leading-relaxed text-slate-100 sm:text-sm">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function PropTable({ props = [], required, query = '' }) {
  const rows = props.filter((p) => Boolean(p.required) === required);
  if (!rows.length) {
    return (
      <p className="text-sm text-[#64748B]">
        {required ? 'No required props.' : 'No optional props.'}
      </p>
    );
  }

  return (
    <div className="min-w-0 overflow-x-auto rounded-xl border border-[#E4E7EC]">
      <table className="min-w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-[#E4E7EC] bg-[#F9FAFB]">
            <th className="px-3 py-2.5 font-semibold text-deep-blue">Prop</th>
            <th className="px-3 py-2.5 font-semibold text-deep-blue">Type</th>
            {!required ? <th className="px-3 py-2.5 font-semibold text-deep-blue">Default</th> : null}
            <th className="px-3 py-2.5 font-semibold text-deep-blue">Description</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((prop) => (
            <tr key={prop.name} className="border-b border-[#F4F5F7] last:border-0">
              <td className="px-3 py-2.5 font-mono text-xs text-primary sm:text-sm">
                <HighlightText text={prop.name} query={query} />
              </td>
              <td className="px-3 py-2.5 font-mono text-xs text-deep-blue">
                <HighlightText text={prop.type} query={query} />
              </td>
              {!required ? (
                <td className="px-3 py-2.5 font-mono text-xs text-[#64748B]">
                  <HighlightText text={prop.defaultValue ?? '—'} query={query} />
                </td>
              ) : null}
              <td className="px-3 py-2.5 text-[#64748B]">
                <HighlightText text={prop.description} query={query} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CallbackTable({ props = [], query = '' }) {
  const rows = props.filter((p) => p.name.startsWith('on'));
  if (!rows.length) return null;

  return (
    <section className="min-w-0 space-y-3">
      <div>
        <h2 className="text-lg font-bold text-deep-blue">Callbacks</h2>
        <p className="mt-1 text-sm text-[#64748B]">
          UI-only handlers — wire them from the parent page.
        </p>
      </div>
      <div className="min-w-0 overflow-x-auto rounded-xl border border-[#E4E7EC]">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-[#E4E7EC] bg-amber-50/80">
              <th className="px-3 py-2.5 font-semibold text-deep-blue">Callback</th>
              <th className="px-3 py-2.5 font-semibold text-deep-blue">Signature</th>
              <th className="px-3 py-2.5 font-semibold text-deep-blue">When it runs</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((prop) => (
              <tr key={prop.name} className="border-b border-[#F4F5F7] last:border-0">
                <td className="px-3 py-2.5 font-mono text-xs text-primary sm:text-sm">
                  <HighlightText text={prop.name} query={query} />
                </td>
                <td className="px-3 py-2.5 font-mono text-xs text-deep-blue">
                  <HighlightText text={prop.type} query={query} />
                </td>
                <td className="px-3 py-2.5 text-[#64748B]">
                  <HighlightText text={prop.description} query={query} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function DocPanel({ doc, query = '' }) {
  if (!doc) {
    return (
      <div className="flex h-full min-h-[320px] items-center justify-center rounded-xl border border-dashed border-[#D0D5DD] bg-white p-8 text-center">
        <p className="text-sm text-[#64748B]">
          Select a component from the sidebar to view documentation.
        </p>
      </div>
    );
  }

  return (
    <article className="min-w-0 space-y-8">
      <header className="min-w-0">
        <p className="text-xs font-semibold tracking-wide text-primary uppercase">
          <HighlightText text={doc.category} query={query} />
        </p>
        <h1 className="mt-1 break-words text-2xl font-bold text-deep-blue sm:text-3xl">
          <HighlightText text={doc.name} query={query} />
        </h1>
        <p className="mt-2 text-sm text-[#64748B] sm:text-base">
          <HighlightText text={doc.summary} query={query} />
        </p>
        <p className="mt-3 inline-flex max-w-full flex-wrap rounded-lg border border-[#E4E7EC] bg-[#F9FAFB] px-3 py-1.5 font-mono text-xs break-all text-deep-blue">
          <HighlightText text={doc.path} query={query} />
        </p>
      </header>

      <section className="min-w-0 space-y-3">
        <h2 className="text-lg font-bold text-deep-blue">Import</h2>
        <CodeBlock label="Import" code={doc.importExample} />
        {doc.importExample?.includes('@/data/demoData') ? (
          <p className="text-xs text-[#64748B]">
            Demo payloads:{' '}
            <code className="rounded bg-[#F9FAFB] px-1 py-0.5 font-mono text-[11px]">
              src/data/demoData.js
            </code>
          </p>
        ) : null}
      </section>

      <section className="min-w-0 space-y-3">
        <h2 className="text-lg font-bold text-deep-blue">Required props</h2>
        <PropTable props={doc.props} required query={query} />
        <h3 className="pt-2 text-sm font-semibold text-deep-blue">Required usage</h3>
        <CodeBlock label="JSX" code={doc.requiredExample} />
      </section>

      <section className="min-w-0 space-y-3">
        <h2 className="text-lg font-bold text-deep-blue">Optional props</h2>
        <PropTable props={doc.props} required={false} query={query} />
        <h3 className="pt-2 text-sm font-semibold text-deep-blue">Optional usage</h3>
        <CodeBlock label="JSX" code={doc.optionalExample} />
      </section>

      <CallbackTable props={doc.props} query={query} />

      {Array.isArray(doc.variants) && doc.variants.length > 0 ? (
        <section className="min-w-0 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-deep-blue">Variants</h2>
            <p className="mt-1 text-sm text-[#64748B]">
              Every major UI state — live preview below.
            </p>
          </div>
          {doc.variants.map((variant) => (
            <div key={variant.id} className="min-w-0 space-y-3 border-t border-[#E4E7EC] pt-6">
              <div>
                <h3 className="text-base font-semibold text-deep-blue">
                  <HighlightText text={variant.name} query={query} />
                </h3>
                {variant.description ? (
                  <p className="mt-1 text-sm text-[#64748B]">
                    <HighlightText text={variant.description} query={query} />
                  </p>
                ) : null}
              </div>
              {variant.example ? <CodeBlock label="JSX" code={variant.example} /> : null}
              <div className="min-w-0 overflow-hidden rounded-xl border border-[#E4E7EC] bg-[#F3F4F6] p-4 sm:p-6">
                <ComponentPreview previewId={doc.previewId} variantId={variant.id} />
              </div>
            </div>
          ))}
        </section>
      ) : (
        <section className="min-w-0 space-y-3">
          <h2 className="text-lg font-bold text-deep-blue">Output</h2>
          <div className="min-w-0 overflow-hidden rounded-xl border border-[#E4E7EC] bg-[#F3F4F6] p-4 sm:p-6">
            <ComponentPreview previewId={doc.previewId} />
          </div>
        </section>
      )}
    </article>
  );
}

function CategoryNav({
  groups,
  openCategories,
  toggleCategory,
  expandAll,
  selected,
  query,
  onSelect,
}) {
  return (
    <nav className="flex flex-col gap-1">
      <button
        type="button"
        onClick={expandAll}
        className="rounded-lg px-3 py-2 text-left text-sm text-deep-blue hover:bg-[#F9FAFB]"
      >
        All
      </button>

      {groups.map((group) => {
        const isOpen = openCategories.has(group.id);
        return (
          <div key={group.id}>
            <button
              type="button"
              onClick={() => toggleCategory(group.id)}
              aria-expanded={isOpen}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                isOpen
                  ? 'bg-[#F9FAFB] font-semibold text-deep-blue'
                  : 'text-deep-blue hover:bg-[#F9FAFB]'
              }`}
            >
              <span>
                <HighlightText text={group.label} query={query} />
                <span className="ml-1.5 text-xs font-normal text-[#98A2B3]">
                  ({group.items.length})
                </span>
              </span>
              <ChevronDown
                className={`h-4 w-4 shrink-0 text-[#98A2B3] transition-transform ${isOpen ? 'rotate-180' : ''}`}
                aria-hidden
              />
            </button>

            {isOpen ? (
              <ul className="mt-0.5 mb-1 ml-2 flex flex-col gap-0.5 border-l border-[#E4E7EC] pl-2">
                {group.items.length === 0 ? (
                  <li className="px-3 py-1.5 text-xs text-[#64748B]">No matches</li>
                ) : (
                  group.items.map((docItem) => (
                    <li key={docItem.id}>
                      <button
                        type="button"
                        onClick={() => onSelect(docItem.id)}
                        className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                          selected?.id === docItem.id
                            ? 'bg-secondary font-semibold text-primary'
                            : 'text-deep-blue hover:bg-[#F9FAFB]'
                        }`}
                      >
                        <HighlightText text={docItem.name} query={query} />
                      </button>
                    </li>
                  ))
                )}
              </ul>
            ) : null}
          </div>
        );
      })}
    </nav>
  );
}

export default function DeveloperPage() {
  const { componentId } = useParams();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const categoryIds = useMemo(
    () => DOC_CATEGORIES.filter((c) => c.id !== 'all').map((c) => c.id),
    []
  );
  const [openCategories, setOpenCategories] = useState(() => new Set(categoryIds));

  const filtered = useMemo(() => filterComponentDocs({ category: 'all', query }), [query]);

  const selected = useMemo(() => {
    const match = filtered.find((doc) => doc.id === componentId);
    if (match) return match;
    if (componentId) {
      const fromAll = getComponentDoc(componentId);
      if (fromAll && !query.trim()) return fromAll;
    }
    return filtered[0] || null;
  }, [filtered, componentId, query]);

  useEffect(() => {
    if (!componentId && filtered[0]) {
      navigate(`/developer/${filtered[0].id}`, { replace: true });
    }
  }, [componentId, filtered, navigate]);

  useEffect(() => {
    if (!query.trim()) return;
    const next = new Set();
    filtered.forEach((doc) => next.add(doc.category));
    setOpenCategories(next);
  }, [query, filtered]);

  useEffect(() => {
    if (!selected?.category) return;
    setOpenCategories((prev) => {
      if (prev.has(selected.category)) return prev;
      const next = new Set(prev);
      next.add(selected.category);
      return next;
    });
  }, [selected?.category]);

  useEffect(() => {
    document.body.style.overflow = mobileNavOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileNavOpen]);

  const groups = useMemo(
    () =>
      DOC_CATEGORIES.filter((c) => c.id !== 'all').map((c) => ({
        ...c,
        items: filtered.filter((doc) => doc.category === c.id),
      })),
    [filtered]
  );

  const toggleCategory = (id) => {
    setOpenCategories((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const expandAll = () => setOpenCategories(new Set(categoryIds));

  const selectComponent = (id) => {
    navigate(`/developer/${id}`);
    setMobileNavOpen(false);
  };

  return (
    <div className="min-h-screen overflow-x-clip bg-[#F3F4F6]">
      <div className="sticky top-0 z-30 border-b border-[#E4E7EC] bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[95%] flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-10">
          <div className="flex min-w-0 items-start gap-2">
            <button
              type="button"
              onClick={() => setMobileNavOpen(true)}
              className="mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#E4E7EC] text-deep-blue hover:bg-[#F9FAFB] lg:hidden"
              aria-label="Open category menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="min-w-0">
              <Link to="/" className="text-sm text-[#64748B] hover:text-primary">
                ← Home
              </Link>
              <h1 className="mt-1 text-xl font-bold text-deep-blue sm:text-2xl">
                Developer Docs
              </h1>
              <p className="text-sm text-[#64748B]">
                {COMPONENT_DOCS.length} shared components — import, props, live previews.
              </p>
            </div>
          </div>
          <label className="flex w-full max-w-md items-center gap-2 rounded-xl border border-[#E4E7EC] bg-[#F9FAFB] px-3 py-2.5 focus-within:border-primary focus-within:bg-white sm:w-80">
            <Search className="h-4 w-4 shrink-0 text-[#98A2B3]" aria-hidden />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search components, props, paths…"
              className="w-full min-w-0 bg-transparent text-sm text-deep-blue outline-none placeholder:text-[#98A2B3]"
            />
          </label>
        </div>
      </div>

      <div className="mx-auto grid max-w-[95%] grid-cols-1 gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:px-10">
        <aside className="z-10 hidden h-fit rounded-xl border border-[#E4E7EC] bg-white p-4 lg:sticky lg:top-36 lg:block lg:max-h-[calc(100vh-10rem)] lg:overflow-y-auto">
          <div className="mb-3 flex items-center justify-between px-1">
            <p className="text-[11px] font-semibold tracking-wide text-[#98A2B3] uppercase">
              Category
            </p>
            <button
              type="button"
              onClick={expandAll}
              className="text-[11px] font-medium text-primary hover:underline"
            >
              Expand all
            </button>
          </div>
          <CategoryNav
            groups={groups}
            openCategories={openCategories}
            toggleCategory={toggleCategory}
            expandAll={expandAll}
            selected={selected}
            query={query}
            onSelect={selectComponent}
          />
        </aside>

        {mobileNavOpen ? (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div className="absolute inset-0 bg-black/40" onClick={() => setMobileNavOpen(false)} />
            <div className="absolute top-0 left-0 h-full w-[85%] max-w-sm overflow-y-auto bg-white p-4">
              <div className="mb-3 flex items-center justify-between px-1">
                <p className="text-[11px] font-semibold tracking-wide text-[#98A2B3] uppercase">
                  Category
                </p>
                <button
                  type="button"
                  onClick={() => setMobileNavOpen(false)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg hover:bg-[#F9FAFB]"
                  aria-label="Close category menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <CategoryNav
                groups={groups}
                openCategories={openCategories}
                toggleCategory={toggleCategory}
                expandAll={expandAll}
                selected={selected}
                query={query}
                onSelect={selectComponent}
              />
            </div>
          </div>
        ) : null}

        <main className="min-w-0 rounded-xl border border-[#E4E7EC] bg-white p-4 sm:p-6 lg:p-8">
          <DocPanel doc={selected} query={query} />
        </main>
      </div>
    </div>
  );
}
