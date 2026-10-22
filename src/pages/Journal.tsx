import { useEffect, useMemo, useState, type FormEvent, type KeyboardEvent } from "react";
import {
  BookOpen,
  Check,
  Pencil,
  Plus,
  Search,
  Shuffle,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { useI18n } from "../i18n/I18nProvider";
import { useStore } from "../store/StoreProvider";
import { usePageMeta } from "../lib/usePageMeta";
import { journalPrompts } from "../data/journal";
import { moods } from "../data/moods";
import type { JournalEntry } from "../data/types";
import { formatDate, wordCount } from "../lib/utils";
import { Modal } from "../components/Modal";
import { useToast } from "../components/ToastProvider";

const DRAFT_KEY = "marea.journal.draft.v1";

interface Draft {
  title: string;
  body: string;
  mood: string;
  promptIndex: number;
}

function readDraft(): Draft {
  const fallback: Draft = { title: "", body: "", mood: "", promptIndex: 0 };
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Partial<Draft>;
    return {
      title: typeof parsed.title === "string" ? parsed.title : "",
      body: typeof parsed.body === "string" ? parsed.body : "",
      mood: typeof parsed.mood === "string" ? parsed.mood : "",
      promptIndex: typeof parsed.promptIndex === "number" ? parsed.promptIndex : 0,
    };
  } catch {
    return fallback;
  }
}

export function Journal() {
  const { t, pick, lang } = useI18n();
  const { data, addJournal, updateJournal, deleteJournal } = useStore();
  const { toast } = useToast();
  const initialDraft = useMemo(readDraft, []);
  const [title, setTitle] = useState(initialDraft.title);
  const [body, setBody] = useState(initialDraft.body);
  const [mood, setMood] = useState(initialDraft.mood);
  const [promptIndex, setPromptIndex] = useState(initialDraft.promptIndex);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<JournalEntry | null>(null);

  usePageMeta({
    title: `${t("app.journal.title")} · Marea`,
    description: t("app.journal.sub"),
  });

  useEffect(() => {
    try {
      if (!title && !body && !mood) {
        window.localStorage.removeItem(DRAFT_KEY);
      } else {
        window.localStorage.setItem(
          DRAFT_KEY,
          JSON.stringify({ title, body, mood, promptIndex } satisfies Draft),
        );
      }
    } catch {
      // Drafts are a convenience, not a requirement.
    }
  }, [title, body, mood, promptIndex]);

  const prompt = journalPrompts[promptIndex % journalPrompts.length];
  const words = wordCount(body);
  const hasContent = body.trim().length > 0;

  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase();
    if (!needle) return data.journal;
    return data.journal.filter((entry) =>
      `${entry.title} ${entry.body}`.toLowerCase().includes(needle),
    );
  }, [data.journal, search]);

  const resetEditor = () => {
    setTitle("");
    setBody("");
    setMood("");
    setEditingId(null);
  };

  const save = () => {
    if (!hasContent) return;
    const cleanTitle = title.trim() || t("app.journal.untitled");
    if (editingId) {
      updateJournal(editingId, { title: cleanTitle, body: body.trim(), mood: mood || undefined });
      toast(t("app.journal.savedToast"), "success");
      resetEditor();
    } else {
      addJournal({ title: cleanTitle, body: body.trim(), mood: mood || undefined });
      toast(t("app.journal.savedToast"), "success");
      resetEditor();
      setExpandedId(null);
    }
    try {
      window.localStorage.removeItem(DRAFT_KEY);
    } catch {
      // Ignore.
    }
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    save();
  };

  const onEditorKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      event.preventDefault();
      save();
    }
  };

  const startEdit = (entry: JournalEntry) => {
    setEditingId(entry.id);
    setTitle(entry.title === t("app.journal.untitled") ? "" : entry.title);
    setBody(entry.body);
    setMood(entry.mood ?? "");
    setExpandedId(null);
    window.setTimeout(() => {
      document.getElementById("journal-editor")?.scrollIntoView({ behavior: "smooth", block: "start" });
      document.getElementById("journal-body")?.focus({ preventScroll: true });
    }, 60);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    deleteJournal(deleteTarget.id);
    if (editingId === deleteTarget.id) resetEditor();
    if (expandedId === deleteTarget.id) setExpandedId(null);
    setDeleteTarget(null);
    toast(t("app.journal.deletedToast"), "success");
  };

  const shufflePrompt = () => {
    if (journalPrompts.length < 2) return;
    let next = promptIndex;
    while (next === promptIndex) {
      next = Math.floor(Math.random() * journalPrompts.length);
    }
    setPromptIndex(next);
  };

  return (
    <div className="page journal-page">
      <header className="page-head">
        <div>
          <p className="eyebrow">{t("nav.journal")}</p>
          <h1 className="display page-title">{t("app.journal.title")}</h1>
          <p className="page-lede">{t("app.journal.sub")}</p>
        </div>
        <span className="page-head__count">
          <strong>{data.journal.length}</strong>
          <span>{t("app.journal.entries")}</span>
        </span>
      </header>

      <div className="journal-grid">
        <section className="journal-editor" id="journal-editor" aria-labelledby="journal-editor-title">
          <form onSubmit={submit}>
            <div className="journal-editor__head">
              <div>
                <p className="eyebrow">{editingId ? t("app.journal.edit") : t("app.journal.new")}</p>
                <h2 id="journal-editor-title">{t("app.journal.prompt")}</h2>
              </div>
              <button type="button" className="btn btn--ghost btn--sm" onClick={shufflePrompt}>
                <Shuffle size={14} />
                {t("app.journal.shuffle")}
              </button>
            </div>

            <div className="journal-prompt">
              <Sparkles size={17} />
              <blockquote>{pick(prompt)}</blockquote>
            </div>

            <label className="field">
              <span className="label">{t("app.journal.titlePlaceholder")}</span>
              <input
                className="input"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder={t("app.journal.titlePlaceholder")}
                maxLength={90}
              />
            </label>

            <label className="field">
              <span className="sr-only">{t("app.journal.bodyPlaceholder")}</span>
              <textarea
                id="journal-body"
                className="textarea journal-textarea"
                value={body}
                onChange={(event) => setBody(event.target.value)}
                onKeyDown={onEditorKeyDown}
                placeholder={t("app.journal.bodyPlaceholder")}
                rows={9}
              />
            </label>

            <fieldset className="journal-moods">
              <legend>{t("app.journal.mood")}</legend>
              <div className="mood-picker mood-picker--small">
                {moods.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`mood-pill${mood === item.id ? " is-selected" : ""}`}
                    style={{ ["--mood-color" as string]: item.color }}
                    aria-pressed={mood === item.id}
                    onClick={() => setMood(mood === item.id ? "" : item.id)}
                  >
                    <span className="mood-pill__dot" aria-hidden="true" />
                    {pick(item.label)}
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="journal-editor__foot">
              <span className="journal-draft">
                <span className="journal-draft__dot" aria-hidden="true" />
                {t("app.journal.autosave")}
                <span className="journal-words">
                  {words} {t("app.journal.words")}
                </span>
              </span>
              <div className="journal-editor__actions">
                {editingId && (
                  <button
                    type="button"
                    className="btn btn--ghost"
                    onClick={() => {
                      resetEditor();
                    }}
                  >
                    {t("common.cancel")}
                  </button>
                )}
                <button type="submit" className="btn btn--coral" disabled={!hasContent}>
                  <Check size={15} />
                  {t("app.journal.save")}
                </button>
              </div>
            </div>
          </form>
        </section>

        <section className="journal-list" aria-labelledby="journal-list-title">
          <div className="journal-list__head">
            <h2 id="journal-list-title">{t("app.journal.entries")}</h2>
            <span className="tiny muted">{data.journal.length}</span>
          </div>

          <div className="journal-search">
            <Search size={16} aria-hidden="true" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t("app.journal.search")}
              aria-label={t("app.journal.search")}
            />
            {search && (
              <button type="button" onClick={() => setSearch("")} aria-label={t("app.library.clear")}>
                <X size={15} />
              </button>
            )}
          </div>

          {data.journal.length === 0 ? (
            <div className="journal-empty">
              <span className="journal-empty__icon">
                <BookOpen size={24} />
              </span>
              <h3>{t("app.journal.noEntries")}</h3>
              <p>{t("app.journal.noEntriesBody")}</p>
            </div>
          ) : filtered.length === 0 ? (
            <p className="journal-empty-line">{t("app.journal.emptySearch")}</p>
          ) : (
            <ul className="entry-list">
              {filtered.map((entry) => {
                const isOpen = expandedId === entry.id;
                const entryMood = moods.find((item) => item.id === entry.mood);
                return (
                  <li key={entry.id} className={`entry${isOpen ? " is-open" : ""}`}>
                    <div className="entry__head">
                      <button
                        type="button"
                        className="entry__open"
                        aria-expanded={isOpen}
                        onClick={() => setExpandedId(isOpen ? null : entry.id)}
                      >
                        <span className="entry__date">{formatDate(entry.createdAt, lang, "long")}</span>
                        <strong>{entry.title || t("app.journal.untitled")}</strong>
                        {!isOpen && <span className="entry__excerpt">{entry.body}</span>}
                      </button>
                      <div className="entry__tools">
                        {entryMood && (
                          <span
                            className="entry__mood"
                            style={{ ["--mood-color" as string]: entryMood.color }}
                            title={pick(entryMood.label)}
                          >
                            <span aria-hidden="true" />
                            {pick(entryMood.label)}
                          </span>
                        )}
                        <button
                          type="button"
                          className="icon-quiet"
                          onClick={() => startEdit(entry)}
                          aria-label={t("app.journal.edit")}
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          type="button"
                          className="icon-quiet"
                          onClick={() => setDeleteTarget(entry)}
                          aria-label={t("app.journal.delete")}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    {isOpen && (
                      <div className="entry__body">
                        {entry.body.split("\n").map((paragraph, index) => (
                          <p key={index}>{paragraph || "\u00a0"}</p>
                        ))}
                        <div className="entry__foot">
                          <span>
                            {wordCount(entry.body)} {t("app.journal.words")}
                          </span>
                          <span>
                            {t("app.journal.saved")} · {formatDate(entry.updatedAt, lang)}
                          </span>
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}

          <button type="button" className="journal-new-inline" onClick={resetEditor}>
            <Plus size={15} />
            {t("app.journal.new")}
          </button>
        </section>
      </div>

      <Modal
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title={t("app.journal.delete")}
        closeLabel={t("common.close")}
        size="sm"
      >
        <p className="modal__intro">{t("app.journal.confirmDelete")}</p>
        <div className="modal__actions">
          <button type="button" className="btn btn--ghost" onClick={() => setDeleteTarget(null)}>
            {t("app.journal.cancel")}
          </button>
          <button type="button" className="btn btn--coral" onClick={confirmDelete}>
            <Trash2 size={15} />
            {t("app.journal.delete")}
          </button>
        </div>
      </Modal>
    </div>
  );
}
