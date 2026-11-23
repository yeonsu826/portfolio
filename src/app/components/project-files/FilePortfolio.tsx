import {
  lazy,
  Suspense,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { Link } from "react-router-dom";
import {
  AnimatePresence,
  motion,
  MotionConfig,
  useAnimationControls,
} from "motion/react";
import { LangProvider, useLang } from "../../context/LangContext";
import { PORTFOLIO } from "../../data/portfolio";
import { smoothScrollToElement } from "../../utils/smoothScrollToElement";
import { useTransitionScrollLock } from "../../utils/useTransitionScrollLock";
import FileProjectExperience from "./FileProjectExperience";
import FileVideoGallery from "./FileVideoGallery";
import { VIMEO_VIDEOS } from "../../data/videos";
import { videoCollections } from "./videoCollections";
import ReturningFileDeck, { type ReturnDeck } from "./ReturningFileDeck";
import {
  FileDeckIntro,
  OpeningDeckFile,
  type DeckSelection,
} from "./FileDeckIntro";
import "./FilePortfolio.css";
import { previewSrc } from "../../utils/imagePreview";
const ResumePaperDesk = lazy(() => import("./about/ResumePaperDesk"));

import {
  fileRows,
  fileSelection,
  tabNames,
  tabColors,
  rowTabWidth,
  type FileRow,
} from "./projectFileData";

type CardFlight = {
  row: number;
  key: string;
  depth: number;
  sourceTop: number;
  frontTop: number;
  width: number;
  height: number;
  shifted: boolean;
  sameGroup: boolean;
  revealing: boolean;
};
type ClosingCover = {
  next: CardFlight;
  color: string;
  row: number;
  closed: boolean;
  top: number;
};
type ProjectPageTurn = {
  html: string;
  top: number;
  height: number;
  color: string;
  ink: string;
  outline: string;
  key: string | null;
  row: number;
};
const groupShiftTransition = {
  duration: 0.9,
  ease: [0.45, 0, 0.2, 1] as [number, number, number, number],
};

function MainProjectCoverIndex({
  item,
  back = false,
}: {
  item: FileRow;
  back?: boolean;
}) {
  return (
    <div className={`mosby-main-cover-index ${back ? "is-back" : ""}`}>
      <div className="mosby-row">
        <div className="mosby-tabs">
          <span
            className="mosby-tab"
            style={
              {
                "--tab-color": item.color,
                "--tab-ink": "#f8f1e4",
              } as CSSProperties
            }
          >
            <svg viewBox="0 0 240 40" preserveAspectRatio="none">
              <path d="M0 40 C24 40 23 0 52 0 H188 C217 0 216 40 240 40 Z" />
            </svg>
            <span>{tabNames[item.keys[0]]}</span>
          </span>
        </div>
      </div>
    </div>
  );
}

function FlyingFileCard({
  flight,
  onShift,
  onReveal,
  onDone,
}: {
  flight: CardFlight;
  onShift: () => void;
  onReveal: () => void;
  onDone: () => void;
}) {
  const controls = useAnimationControls();
  const coverControls = useAnimationControls();
  const [atFront, setAtFront] = useState(false);
  const [opening, setOpening] = useState(false);
  const item = fileRows[flight.row];
  const color = flight.sameGroup
    ? (tabColors[flight.key] ?? item.color)
    : item.color;
  const carryMainIndex =
    !flight.sameGroup && item.id !== "all" && flight.key !== item.keys[0];
  const mainIndex = (
    <div className="mosby-row">
      <div className="mosby-tabs">
        <span
          className="mosby-tab"
          style={
            {
              "--tab-color": item.color,
              "--tab-ink": "#f8f1e4",
            } as CSSProperties
          }
        >
          <svg viewBox="0 0 240 40" preserveAspectRatio="none">
            <path d="M0 40 C24 40 23 0 52 0 H188 C217 0 216 40 240 40 Z" />
          </svg>
          <span>{tabNames[item.keys[0]]}</span>
        </span>
      </div>
    </div>
  );
  useEffect(() => {
    let cancelled = false;
    async function turn() {
      if (flight.sameGroup) {
        // Turn the linked project index and page toward the viewer in place.
        setAtFront(true);
        controls.set({
          x: 0,
          y: flight.frontTop,
          rotateZ: 0,
          rotateY: 0,
          rotateX: -14,
          scale: 0.98,
          opacity: 1,
        });
        await controls.start({
          rotateX: 0,
          scale: [0.98, 1.02, 1],
          transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] },
        });
      } else {
        controls.set({
          x: 0,
          y: flight.sourceTop,
          rotateZ: 0,
          rotateY: 0,
          opacity: 1,
        });
        await controls.start({
          x: flight.width * 1.12,
          y: flight.sourceTop + 45,
          rotateZ: 12,
          rotateY: -12,
          transition: { duration: 0.75, ease: [0.4, 0, 0.2, 1] },
        });
        if (cancelled) return;
        onShift();
        // The card stays outside the deck while the remaining file rows close the gap.
        await controls.start({
          x: flight.width * 1.12,
          y: flight.frontTop + 85,
          rotateZ: 12,
          rotateY: -12,
          transition: groupShiftTransition,
        });
        if (cancelled) return;
        setAtFront(true);
        await controls.start({
          x: 0,
          y: flight.frontTop,
          rotateZ: 0,
          rotateY: 0,
          transition: { duration: 0.85, ease: [0.22, 0.61, 0.36, 1] },
        });
      }
      if (cancelled) return;
      setOpening(true);
      onReveal();
      await new Promise<void>((resolve) =>
        requestAnimationFrame(() => resolve()),
      );
      if (cancelled) return;
      await coverControls.start({
        rotateX: [0, -78, -180],
        transition: {
          duration: 1.55,
          times: [0, 0.5, 1],
          ease: [0.4, 0, 0.2, 1],
        },
      });
      if (!cancelled) onDone();
    }
    void turn();
    return () => {
      cancelled = true;
      controls.stop();
      coverControls.stop();
    };
  }, [controls, coverControls]);
  return (
    <motion.div
      className={`mosby-flight-card ${flight.sameGroup ? "is-project-flight" : ""}`}
      aria-hidden="true"
      initial={{ x: 0, y: flight.sourceTop }}
      animate={controls}
      style={
        {
          zIndex: atFront ? 50 : flight.depth,
          "--row-color": color,
          "--tab-width": rowTabWidth(item),
          "--flight-color": color,
          "--flight-tab-slot": item.keys.findIndex((key) => key === flight.key),
          "--flight-tab-count": item.keys.length,
        } as CSSProperties
      }
    >
      <div
        className="mosby-row"
        style={{ visibility: opening ? "hidden" : undefined }}
      >
        <div className="mosby-tabs">
          {item.keys
            .filter((key) => !flight.sameGroup || key === flight.key)
            .map((key) => (
              <span
                key={key}
                className="mosby-tab"
                style={
                  {
                    "--tab-color": tabColors[key] ?? item.color,
                    "--tab-ink":
                      key === "devARContentGroup" ? "#161714" : "#f8f1e4",
                  } as CSSProperties
                }
              >
                <svg viewBox="0 0 240 40" preserveAspectRatio="none">
                  <path d="M0 40 C24 40 23 0 52 0 H188 C217 0 216 40 240 40 Z" />
                </svg>
                <span>{tabNames[key]}</span>
              </span>
            ))}
        </div>
      </div>
      <motion.div
        className={`mosby-flight-cover ${carryMainIndex && opening ? "has-main-index" : ""}`}
        initial={{ rotateX: 0 }}
        animate={coverControls}
      >
        <div className="mosby-cover-front">
          {carryMainIndex && opening && (
            <div className="mosby-main-cover-index">{mainIndex}</div>
          )}
          <div
            className="mosby-flight-paper"
            style={{ height: flight.height }}
          />
        </div>
        <div className="mosby-cover-back">
          {carryMainIndex && opening && (
            <div className="mosby-main-cover-index is-back">{mainIndex}</div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function FileArchive() {
  const [contactOpen, setContactOpen] = useState(false);
  const [contactReady, setContactReady] = useState(false);
  const [startContactParked, setStartContactParked] = useState(false);
  const returnDestination = useRef<"projects" | "contact">("projects");
  const [deckOpen, setDeckOpen] = useState(false);
  const [entry, setEntry] = useState<
    (DeckSelection & { revealing: boolean; coverHeight?: number }) | null
  >(null);
  const [activeRow, setActiveRow] = useState(fileRows.length - 1);
  const [groupOrder, setGroupOrder] = useState(() =>
    fileRows.map((_, index) => index),
  );
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [flight, setFlight] = useState<CardFlight | null>(null);
  const [closingCover, setClosingCover] = useState<ClosingCover | null>(null);
  const [pageTurn, setPageTurn] = useState<ProjectPageTurn | null>(null);
  const [returningTab, setReturningTab] = useState<{
    key: string;
    row: string;
    distance: number;
  } | null>(null);
  const [homeCover, setHomeCover] = useState<{
    top: number;
    height: number;
  } | null>(null);
  const [returnDeck, setReturnDeck] = useState<ReturnDeck | null>(null);
  const [riseFromBelow, setRiseFromBelow] = useState(false);
  const [frontProjects, setFrontProjects] = useState<Record<string, string>>(
    () =>
      Object.fromEntries(
        fileRows.map((item) => [
          item.id,
          item.id === "all" ? "allProjects" : item.keys[0],
        ]),
      ),
  );
  const busy = useRef(false);
  const section = useRef<HTMLElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const [panelWidths, setPanelWidths] = useState(() => ({
    base: document.documentElement.clientWidth * 0.89,
    expanded: window.innerWidth + 32,
  }));
  useEffect(() => {
    if (!frame.current) return;
    const update = () => {
      const base = frame.current!.clientWidth;
      const expanded = window.innerWidth + 32;
      setPanelWidths((previous) =>
        previous.base === base && previous.expanded === expanded
          ? previous
          : { base, expanded },
      );
    };
    const observer = new ResizeObserver(update);
    observer.observe(frame.current);
    window.addEventListener("resize", update);
    update();
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);
  // Reconcile saved state when project groups change during a live preview.
  useEffect(() => {
    const resolvedRow = activeKey ? fileSelection(activeKey).row : activeRow;
    setGroupOrder((previous) => {
      const complete = [
        ...new Set([
          ...previous.filter((index) => index < fileRows.length),
          ...fileRows.map((_, index) => index),
        ]),
      ];
      return resolvedRow >= 0
        ? [...complete.filter((index) => index !== resolvedRow), resolvedRow]
        : complete;
    });
    setFrontProjects((previous) =>
      Object.fromEntries(
        fileRows.map((item) => [
          item.id,
          item.id === "all"
            ? "allProjects"
            : (item.keys as readonly string[]).includes(previous[item.id])
              ? previous[item.id]
              : item.keys[0],
        ]),
      ),
    );
    if (activeKey) {
      const target = fileSelection(activeKey);
      if (target.row >= 0) {
        setActiveRow(target.row);
        if (target.key !== activeKey) setActiveKey(target.key);
      }
    }
  }, [fileRows]);
  const cancelOverviewScroll = useRef<(() => void) | null>(null);
  useEffect(() => () => cancelOverviewScroll.current?.(), []);
  const { lang, setLang, t } = useLang();
  const selected = PORTFOLIO.find((group) => group.groupKey === activeKey);
  const directoryGroup = activeKey?.startsWith("group-")
    ? fileRows.find((item) => item.id === activeKey.slice(6))
    : undefined;
  const directoryRows = directoryGroup
    ? [directoryGroup]
    : fileRows.filter((item) => item.id !== "all");
  const showingDirectory = activeKey === "allProjects" || !!directoryGroup;
  const selectedVideoCollection = videoCollections[activeKey ?? ""];
  const collectionVideos =
    selectedVideoCollection?.clips.flatMap((clip) => {
      const video = VIMEO_VIDEOS.find((item) => item.id === clip.id);
      return video ? [video] : [];
    }) ?? [];
  const row = fileRows[activeRow];
  const frontRow =
    flight && !flight.sameGroup && flight.shifted && !flight.revealing
      ? flight.row
      : activeRow;
  const sheetColor = activeKey
    ? (tabColors[activeKey] ?? row.color)
    : row.color;
  const sheetInk = activeKey === "devARContentGroup" ? "#191a18" : "#f8f1e4";
  const expandedPanel =
    (!deckOpen && !contactOpen) ||
    !!homeCover ||
    !!returnDeck ||
    (!!entry && !entry.revealing);
  useTransitionScrollLock(
    !!entry ||
      !!flight ||
      !!closingCover ||
      !!pageTurn ||
      !!returningTab ||
      !!homeCover ||
      !!returnDeck ||
      riseFromBelow,
  );
  function enterGroup(selection: DeckSelection) {
    if (busy.current) return;
    busy.current = true;
    cancelOverviewScroll.current?.();
    setActiveRow(selection.row);
    setActiveKey(selection.key);
    setGroupOrder([
      ...fileRows
        .map((_, index) => index)
        .filter((index) => index !== selection.row),
      selection.row,
    ]);
    setFrontProjects((previous) => ({
      ...previous,
      [fileRows[selection.row].id]: selection.key,
    }));
    setEntry({ ...selection, revealing: false });
    setDeckOpen(true);
  }
  function resumeProjects() {
    if (busy.current) return;
    busy.current = true;
    setContactReady(false);
    setContactOpen(false);
    const top = frame.current?.closest<HTMLElement>(".mosby-portfolio");
    if (top) cancelOverviewScroll.current = smoothScrollToElement(top);
  }
  function openContact() {
    if (busy.current || contactOpen) return;
    if (deckOpen) {
      returnDestination.current = "contact";
      returnToIntroduction();
    } else {
      busy.current = true;
      setStartContactParked(false);
      setContactOpen(true);
    }
  }
  function returnToIntroduction() {
    if (contactOpen) {
      resumeProjects();
      return;
    }
    if (busy.current || !section.current) return;
    cancelOverviewScroll.current?.();
    if (activeKey === null) {
      const top = section.current.closest<HTMLElement>(".mosby-portfolio");
      if (top) cancelOverviewScroll.current = smoothScrollToElement(top);
      return;
    }
    const page = section.current.querySelector<HTMLElement>("#mosby-content");
    if (!page) return;
    busy.current = true;
    setHomeCover({
      top:
        page.getBoundingClientRect().top -
        section.current.getBoundingClientRect().top,
      height: Math.min(520, Math.max(340, window.innerHeight * 0.46)),
    });
  }
  function collectReturningFiles() {
    if (!section.current || !homeCover) return;
    const rect = section.current.getBoundingClientRect();
    const rowHeight = parseFloat(
      getComputedStyle(section.current.querySelector(".mosby-row")!).height,
    );
    const cards = groupOrder.map((index) => {
      const source = section
        .current!.querySelector<HTMLElement>(
          `[data-group-id="${fileRows[index].id}"]`,
        )!
        .getBoundingClientRect();
      return {
        row: index,
        left: source.left,
        top: source.top,
        color:
          index === activeRow
            ? sheetColor
            : (tabColors[frontProjects[fileRows[index].id]] ??
              fileRows[index].color),
      };
    });
    setReturnDeck({
      cards,
      left: rect.left,
      top: rect.top + rowHeight * (fileRows.length - 1),
      width: rect.width,
      height: homeCover.height,
      rowHeight,
    });
    setHomeCover(null);
  }
  function finishReturnToIntroduction() {
    const top = section.current?.closest<HTMLElement>(".mosby-portfolio");
    setActiveKey(null);
    setActiveRow(fileRows.length - 1);
    setGroupOrder(fileRows.map((_, index) => index));
    setFrontProjects(
      Object.fromEntries(
        fileRows.map((item) => [
          item.id,
          item.id === "all" ? "allProjects" : item.keys[0],
        ]),
      ),
    );
    setReturnDeck(null);
    const toContact = returnDestination.current === "contact";
    setContactOpen(toContact);
    setContactReady(toContact);
    setStartContactParked(toContact);
    returnDestination.current = "projects";
    setRiseFromBelow(!toContact);
    setDeckOpen(false);
    if (top) cancelOverviewScroll.current = smoothScrollToElement(top);
  }
  function chooseProject(nextRow: number, key: string) {
    if (busy.current || activeKey === key || !section.current) return;
    cancelOverviewScroll.current?.();
    const container = section.current.getBoundingClientRect();
    const source = section.current
      .querySelector(`[data-group-id="${fileRows[nextRow].id}"]`)
      ?.getBoundingClientRect();
    if (!source) return;
    busy.current = true;
    const pageTop = container.top + source.height * fileRows.length;
    const height = Math.max(
      120,
      window.innerHeight - Math.max(0, pageTop) - 24,
    );
    if (nextRow === activeRow) {
      const currentPage =
        section.current.querySelector<HTMLElement>(".mosby-file-sheet");
      if (!currentPage) {
        busy.current = false;
        return;
      }
      const snapshot = currentPage.cloneNode(true) as HTMLElement;
      snapshot.style.setProperty(
        "--selected-tab-index",
        String(
          Math.max(
            0,
            row.keys.findIndex((projectKey) => projectKey === activeKey),
          ),
        ),
      );
      snapshot.style.setProperty("--tab-width", rowTabWidth(row));
      snapshot.style.setProperty("--group-tab-count", String(row.keys.length));
      snapshot
        .querySelectorAll("[id]")
        .forEach((element) => element.removeAttribute("id"));
      snapshot
        .querySelectorAll("button,a,summary,input,select,textarea")
        .forEach((element) => element.setAttribute("tabindex", "-1"));
      const tab = currentPage.querySelector<HTMLElement>(
        ".mosby-project-tab-row .mosby-tab",
      );
      const pageRect = currentPage.getBoundingClientRect();
      const tabRect = tab?.getBoundingClientRect();
      const left = tabRect
        ? (tabRect.left - pageRect.left) / pageRect.width
        : 0;
      const width = tabRect ? tabRect.width / pageRect.width : 0;
      const shoulder =
        (tabRect?.height ?? source.height) / (height + source.height);
      const outline = tabRect
        ? `M0 ${shoulder} H${left} C${left + width * 0.1} ${shoulder} ${left + (width * 23) / 240} 0 ${left + (width * 52) / 240} 0 H${left + (width * 188) / 240} C${left + (width * 217) / 240} 0 ${left + width * 0.9} ${shoulder} ${left + width} ${shoulder} H1 V1 H0 Z`
        : `M0 ${shoulder} H1 V1 H0 Z`;
      setPageTurn({
        html: snapshot.outerHTML,
        top: source.height * (fileRows.length - 1),
        height: height + source.height,
        color: sheetColor,
        ink: sheetInk,
        outline,
        key: activeKey,
        row: activeRow,
      });
      setActiveKey(key);
      setFrontProjects((previous) => ({
        ...previous,
        [fileRows[nextRow].id]: key,
      }));
      return;
    }
    const next: CardFlight = {
      row: nextRow,
      key,
      depth: groupOrder.indexOf(nextRow) * 2 + 2,
      sourceTop: source.top - container.top,
      frontTop: source.height * (fileRows.length - 1),
      width: container.width,
      height,
      shifted: false,
      sameGroup: nextRow === activeRow,
      revealing: false,
    };
    setClosingCover({
      next,
      color: row.color,
      row: activeRow,
      closed: false,
      top: source.height * fileRows.length,
    });
  }
  function restoreIndex(key: string | null, rowIndex: number) {
    const item = fileRows[rowIndex];
    if (!key || !(item.keys as readonly string[]).includes(key)) return;
    busy.current = true;
    const distance =
      section.current?.querySelector<HTMLElement>(".mosby-row")?.offsetHeight ??
      48;
    setReturningTab({ key, row: item.id, distance });
  }
  function renderTab(key: string, item: FileRow) {
    const mainTurning =
      !!flight?.revealing &&
      !flight.sameGroup &&
      item.id !== "all" &&
      flight.row === fileRows.indexOf(item) &&
      flight.key !== item.keys[0] &&
      key === item.keys[0];
    const pageTurning =
      pageTurn?.key === key && fileRows[pageTurn.row].id === item.id;
    const isReturning =
      returningTab?.key === key && returningTab.row === item.id;
    return (
      <motion.button
        key={key}
        id={`project-tab-${key}`}
        data-returning-index={isReturning || undefined}
        initial={false}
        animate={{ y: isReturning ? [returningTab.distance, 0] : 0 }}
        transition={{
          duration: isReturning ? 0.55 : 0,
          ease: [0.22, 0.61, 0.36, 1],
        }}
        onAnimationComplete={() => {
          if (isReturning) {
            setReturningTab(null);
            busy.current = false;
          }
        }}
        className={`mosby-tab ${activeKey === key ? "is-selected-project" : ""}`}
        style={
          {
            visibility:
              pageTurning ||
              mainTurning ||
              (flight?.sameGroup && !flight.revealing && flight.key === key)
                ? "hidden"
                : undefined,
            "--tab-color": tabColors[key] ?? item.color,
            "--tab-ink": key === "devARContentGroup" ? "#161714" : "#f8f1e4",
          } as CSSProperties
        }
        aria-label={t.groups[key as keyof typeof t.groups] ?? tabNames[key]}
        aria-pressed={activeKey === key}
        aria-controls="mosby-content"
        disabled={
          !!flight ||
          !!closingCover ||
          !!pageTurn ||
          !!returningTab ||
          !!homeCover ||
          !!returnDeck
        }
        onClick={() => {
          const target = fileSelection(key);
          chooseProject(target.row, target.key);
        }}
      >
        <svg viewBox="0 0 240 40" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 40 C24 40 23 0 52 0 H188 C217 0 216 40 240 40 Z" />
        </svg>
        <span>{tabNames[key]}</span>
      </motion.button>
    );
  }
  function renderRow(item: FileRow, maskSelected = false) {
    const isActive = item.id === fileRows[frontRow].id;
    const extracting =
      flight &&
      !flight.sameGroup &&
      !flight.shifted &&
      item.id === fileRows[flight.row].id;
    const stackedRows = groupOrder
      .filter((index) => index !== frontRow)
      .map((index) => fileRows[index]);
    const behind =
      stackedRows[
        stackedRows.findIndex((candidate) => candidate.id === item.id) - 1
      ];
    const behindColor = behind
      ? (tabColors[frontProjects[behind.id]] ?? behind.color)
      : "var(--archive-background)";
    const transferring =
      !!flight && !flight.sameGroup && item.id === fileRows[flight.row].id;
    return (
      <motion.div
        key={item.id}
        layout={transferring ? false : "position"}
        data-group-id={item.id}
        data-restoring-index={returningTab?.row === item.id || undefined}
        initial={entry && !isActive ? { y: 0, opacity: 0 } : false}
        animate={{
          y: 0,
          opacity: entry && !entry.revealing && !isActive ? 0 : 1,
        }}
        transition={{
          layout: groupShiftTransition,
          y: {
            duration: 0.9,
            delay: groupOrder.indexOf(fileRows.indexOf(item)) * 0.08,
            ease: [0.4, 0, 0.2, 1],
          },
          opacity: { duration: entry ? 0 : 0.5, delay: 0 },
        }}
        className={`mosby-row ${isActive ? "is-front-group" : ""} ${extracting ? "is-extracting-group" : ""}`}
        style={
          {
            position: "absolute",
            top: `calc(${groupOrder.indexOf(fileRows.indexOf(item))} * var(--row-height))`,
            left: 0,
            right: 0,
            zIndex: isActive
              ? 11
              : groupOrder.indexOf(fileRows.indexOf(item)) * 2 + 1,
            visibility:
              isActive &&
              ((entry && !entry.revealing) ||
                (flight?.shifted && !flight.revealing))
                ? "hidden"
                : undefined,
            "--behind-cover-color": behindColor,
            "--row-color": isActive
              ? sheetColor
              : (tabColors[frontProjects[item.id]] ?? item.color),
            "--row-ink": isActive ? sheetInk : "#f8f1e4",
            "--tab-width": rowTabWidth(item),
          } as CSSProperties
        }
      >
        <div className="mosby-tabs" role="group" aria-label={item.caption}>
          {item.keys.map((key) =>
            maskSelected && key === activeKey ? (
              <span
                key={key}
                className="mosby-tab-placeholder"
                aria-hidden="true"
              />
            ) : (
              renderTab(key, item)
            ),
          )}
        </div>
      </motion.div>
    );
  }
  return (
    <main
      className="mosby-portfolio"
      style={
        {
          "--paper-color": sheetColor,
          "--sheet-ink": sheetInk,
          "--file-group-count": fileRows.length,
        } as CSSProperties
      }
    >
      <div className="archive-backdrop" aria-hidden="true">
        <img src={previewSrc("images/cafe/0.jpeg")} alt="" />
      </div>
      <div
        ref={frame}
        className={`archive-frame ${!deckOpen ? "is-deck-view" : ""} ${contactOpen ? "is-contact-view" : ""}`}
      >
        <motion.div
          className="archive-frame-panel"
          data-panel-mode={expandedPanel ? "vertical" : "horizontal"}
          aria-hidden="true"
          initial={false}
          style={{ x: "-50%" }}
          animate={{
            width: expandedPanel ? panelWidths.expanded : panelWidths.base,
            y: expandedPanel ? -48 : 0,
            scaleY: expandedPanel ? 1.08 : 1,
          }}
          transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
        />
        <header className="archive-masthead">
          <span className="archive-masthead-category">
            DESIGN / DEVELOPMENT
          </span>
          <a
            className="archive-wordmark"
            href="#/"
            aria-label="Jeong Yeon Su project files"
            onClick={(event) => {
              event.preventDefault();
              returnToIntroduction();
            }}
            aria-disabled={
              !!flight ||
              !!closingCover ||
              !!pageTurn ||
              !!homeCover ||
              !!returnDeck
            }
          >
            YEONSU’S FILES
          </a>
          <a
            className="archive-contact-link"
            href="#contact"
            onClick={(event) => {
              event.preventDefault();
              openContact();
            }}
            aria-expanded={contactOpen}
          >
            About me
          </a>
        </header>
        <section className="archive-heading" aria-labelledby="archive-title">
          <h1 id="archive-title">IDEAS INTO EXPERIENCE</h1>
        </section>
        <MotionConfig reducedMotion="never">
          {!deckOpen && (
            <FileDeckIntro
              contact={contactOpen}
              startParked={startContactParked}
              onParked={() => {
                setContactReady(true);
                busy.current = false;
              }}
              onResume={resumeProjects}
              lang={lang}
              onChoose={enterGroup}
              returning={riseFromBelow}
              onReady={() => {
                setRiseFromBelow(false);
                busy.current = false;
              }}
            />
          )}
          <AnimatePresence>
            {!deckOpen && contactReady && (
              <Suspense key="resume" fallback={null}>
                <ResumePaperDesk />
              </Suspense>
            )}
          </AnimatePresence>
          {deckOpen && (
            <section
              ref={section}
              className={`mosby-files ${entry ? "is-entering-deck" : ""} ${returnDeck ? "is-returning-deck" : ""}`}
              aria-busy={
                !!flight ||
                !!closingCover ||
                !!pageTurn ||
                !!returningTab ||
                !!homeCover ||
                !!returnDeck ||
                !!entry
              }
              aria-label={
                lang === "ko"
                  ? "정연수 프로젝트 파일"
                  : "Jeong Yeon Su project files"
              }
            >
              <div
                className="mosby-stack"
                style={{
                  height: `calc(${fileRows.length - 1} * var(--row-height))`,
                }}
              >
                {groupOrder.map((index) =>
                  renderRow(
                    fileRows[index],
                    index === frontRow && index === activeRow,
                  ),
                )}
              </div>
              <motion.div
                className={`mosby-active-group ${flight?.revealing || entry?.revealing || pageTurn ? "is-opening-cover" : ""} ${closingCover || homeCover ? "is-closing-cover" : ""} ${(flight && !flight.sameGroup && flight.shifted && !flight.revealing) || (entry && !entry.revealing) ? "is-awaiting-front" : ""}`}
                style={
                  {
                    pointerEvents:
                      flight || closingCover || pageTurn || homeCover
                        ? "none"
                        : undefined,
                    "--cover-height": pageTurn
                      ? `${pageTurn.height}px`
                      : entry
                        ? `${entry.coverHeight ?? 240}px`
                        : homeCover
                          ? `${homeCover.height}px`
                          : closingCover
                            ? `${closingCover.next.height}px`
                            : flight
                              ? `${flight.height}px`
                              : undefined,
                    "--tab-width": rowTabWidth(row),
                    "--group-tab-count": row.keys.length,
                    "--selected-tab-index": Math.max(
                      0,
                      row.keys.findIndex((key) => key === activeKey),
                    ),
                  } as CSSProperties
                }
              >
                <div
                  key={activeKey ?? "introduction"}
                  className="mosby-file-sheet mosby-project-file"
                >
                  <div
                    className="mosby-project-tab-row"
                    style={{ "--project-color": sheetColor } as CSSProperties}
                  >
                    {activeKey &&
                      activeKey !== "allProjects" &&
                      renderTab(activeKey, row)}
                  </div>
                  <div
                    id="mosby-content"
                    className={`mosby-paper ${!selected ? "is-introduction" : ""} ${activeKey === "devARContentGroup" ? "is-light-sheet" : ""}`}
                    style={{
                      backgroundColor: sheetColor,
                      color: sheetInk,
                      visibility:
                        closingCover?.closed || (entry && !entry.revealing)
                          ? "hidden"
                          : undefined,
                    }}
                    role="region"
                    aria-label={
                      selectedVideoCollection
                        ? "영상 작업"
                        : selected
                          ? t.groups[selected.groupKey]
                          : showingDirectory
                            ? "All project groups"
                            : "Portfolio introduction"
                    }
                    aria-labelledby={
                      selected ? `project-tab-${selected.groupKey}` : undefined
                    }
                  >
                    {showingDirectory ? (
                      <section
                        className={`archive-group-directory ${directoryGroup ? "is-single-group" : ""}`}
                        data-directory-group={directoryGroup?.id ?? "all"}
                        aria-label={
                          lang === "ko"
                            ? "전체 프로젝트 그룹"
                            : "All project groups"
                        }
                      >
                        <span className="archive-kicker">
                          {directoryGroup ? "PROJECT GROUP" : "ALL PROJECTS"} /{" "}
                          {directoryRows
                            .filter((item) => item.id !== "videos")
                            .reduce(
                              (total, item) => total + item.keys.length,
                              0,
                            )}{" "}
                          FILES
                        </span>
                        <h2>
                          {directoryGroup
                            ? tabNames[activeKey!]
                            : lang === "ko"
                              ? "전체 프로젝트"
                              : "All projects"}
                        </h2>
                        <div>
                          {directoryRows.map((item) => (
                            <section key={item.id}>
                              <h3 style={{ color: item.color }}>
                                {item.caption}
                              </h3>
                              <ul>
                                {item.keys.map((key) => (
                                  <li key={key}>
                                    <button
                                      onClick={() => {
                                        const target = fileSelection(key);
                                        chooseProject(target.row, target.key);
                                      }}
                                    >
                                      {tabNames[key]}
                                      <span>↗</span>
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            </section>
                          ))}
                        </div>
                      </section>
                    ) : selectedVideoCollection ? (
                      <FileVideoGallery
                        key={activeKey}
                        videos={collectionVideos}
                        collection={selectedVideoCollection}
                        panel
                      />
                    ) : selected ? (
                      <FileProjectExperience
                        key={selected.groupKey}
                        group={selected}
                      />
                    ) : (
                      <>
                        <div className="mosby-intro">
                          <p>
                            {lang === "ko" ? (
                              <>
                                아이디어를 설계하고, 직접 만들고, 경험으로
                                완성합니다.
                                <br />
                                앱과 웹 서비스부터 3D 공간, 캐릭터, 인터랙티브
                                콘텐츠까지.
                                <br />
                                디자인과 개발 사이에서 쌓아온 정연수의 작업
                                기록입니다.
                                <br />각 프로젝트의 탭을 눌러 파일을 펼쳐보세요.
                              </>
                            ) : (
                              <>
                                Ideas shaped through design, code, and
                                curiosity.
                                <br />
                                From independent apps and web services to 3D
                                spaces,
                                <br />
                                characters, and interactive experiences. A
                                collection
                                <br />
                                of projects by Jeong Yeon Su. Open a tab to
                                explore.
                              </>
                            )}
                          </p>
                        </div>
                        <div className="mosby-project-body">
                          <div className="mosby-colophon">
                            <span>JEONG YEON SU</span>
                            <p>Design, development & everything in between.</p>
                            <a href="mailto:yeonsu826@gmail.com">
                              yeonsu826@gmail.com ↗
                            </a>
                          </div>
                          <div className="archive-photo-mount">
                            <figure className="archive-working-photo">
                              <img
                                src={previewSrc("images/working.png")}
                                alt={
                                  lang === "ko"
                                    ? "작업 중인 정연수"
                                    : "Jeong Yeon Su at work"
                                }
                                width="2048"
                                height="2048"
                              />
                            </figure>
                            <svg
                              className="archive-photo-clip"
                              viewBox="0 0 100 34"
                              fill="none"
                              aria-hidden="true"
                            >
                              <path
                                d="M66 6H16C1 6 1 28 16 28H94"
                                stroke="#41413b"
                                strokeWidth="1.7"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M66 5.6H16C1 5.6 1 27.6 16 27.6H94"
                                stroke="#dedbd1"
                                strokeWidth=".5"
                                strokeLinecap="round"
                              />
                            </svg>
                          </div>
                        </div>
                      </>
                    )}
                    <footer className="mosby-footer">
                      <Link to="/classic">
                        {lang === "ko"
                          ? "기존 포트폴리오"
                          : "Original portfolio"}{" "}
                        ↗
                      </Link>
                      <span>{PORTFOLIO.length} PROJECT FILES</span>
                      <button
                        onClick={() => setLang(lang === "ko" ? "en" : "ko")}
                      >
                        {lang === "ko" ? "EN" : "KO"}
                      </button>
                    </footer>
                  </div>
                </div>
              </motion.div>
              {pageTurn && (
                <div
                  className="mosby-project-turn-boundary"
                  style={{ height: pageTurn.top + pageTurn.height }}
                >
                  <motion.div
                    className="mosby-project-page-turn"
                    aria-hidden="true"
                    style={
                      {
                        top: pageTurn.top,
                        height: pageTurn.height,
                        "--paper-color": pageTurn.color,
                        "--sheet-ink": pageTurn.ink,
                        "--flight-color": pageTurn.color,
                      } as CSSProperties
                    }
                    initial={{ rotateX: 0 }}
                    animate={{ rotateX: [0, -78, -180] }}
                    transition={{
                      duration: 1.65,
                      times: [0, 0.5, 1],
                      ease: [0.4, 0, 0.2, 1],
                    }}
                    onAnimationComplete={() => {
                      setPageTurn(null);
                      busy.current = false;
                      restoreIndex(pageTurn.key, pageTurn.row);
                      const overview =
                        section.current?.querySelector<HTMLElement>(
                          ".archive-editorial",
                        );
                      if (overview)
                        cancelOverviewScroll.current =
                          smoothScrollToElement(overview);
                    }}
                  >
                    <svg
                      width="0"
                      height="0"
                      className="mosby-turn-outline"
                      aria-hidden="true"
                    >
                      <defs>
                        <clipPath
                          id="project-page-turn-outline"
                          clipPathUnits="objectBoundingBox"
                        >
                          <path d={pageTurn.outline} />
                        </clipPath>
                      </defs>
                    </svg>
                    <div
                      className="mosby-cover-front"
                      style={{ clipPath: "url(#project-page-turn-outline)" }}
                      dangerouslySetInnerHTML={{ __html: pageTurn.html }}
                    />
                    <div
                      className="mosby-cover-back"
                      style={{ clipPath: "url(#project-page-turn-outline)" }}
                    />
                  </motion.div>
                </div>
              )}
              {closingCover && (
                <motion.div
                  className="mosby-closing-cover"
                  aria-hidden="true"
                  style={
                    {
                      top: closingCover.top,
                      height: closingCover.next.height,
                      "--row-color": closingCover.color,
                      "--tab-width": rowTabWidth(fileRows[closingCover.row]),
                      "--flight-color": closingCover.color,
                    } as CSSProperties
                  }
                  initial={{ rotateX: -180, y: 0 }}
                  animate={
                    closingCover.closed
                      ? {
                          rotateX: 0,
                          y: flight?.shifted
                            ? -closingCover.top / fileRows.length
                            : 0,
                        }
                      : { rotateX: [-180, -78, 0], y: 0 }
                  }
                  transition={
                    closingCover.closed
                      ? groupShiftTransition
                      : {
                          duration: 1.15,
                          times: [0, 0.5, 1],
                          ease: [0.4, 0, 0.2, 1],
                        }
                  }
                  onAnimationComplete={() => {
                    if (!closingCover.closed) {
                      const closedRow = fileRows[closingCover.row];
                      setFrontProjects((previous) => ({
                        ...previous,
                        [closedRow.id]:
                          closedRow.id === "all"
                            ? "allProjects"
                            : closedRow.keys[0],
                      }));
                      setClosingCover((previous) =>
                        previous ? { ...previous, closed: true } : null,
                      );
                      setFlight(closingCover.next);
                    }
                  }}
                >
                  <div className="mosby-cover-front">
                    <MainProjectCoverIndex item={fileRows[closingCover.row]} />
                    <div
                      className="mosby-flight-paper"
                      style={{ height: "100%" }}
                    />
                  </div>
                  <div className="mosby-cover-back">
                    <MainProjectCoverIndex
                      item={fileRows[closingCover.row]}
                      back
                    />
                  </div>
                </motion.div>
              )}
              {homeCover && (
                <motion.div
                  className="mosby-closing-cover archive-home-cover"
                  aria-hidden="true"
                  style={
                    {
                      top: homeCover.top,
                      height: homeCover.height,
                      "--flight-color": sheetColor,
                    } as CSSProperties
                  }
                  initial={{ rotateX: -180 }}
                  animate={{ rotateX: [-180, -78, 0] }}
                  transition={{
                    duration: 1.1,
                    times: [0, 0.5, 1],
                    ease: [0.4, 0, 0.2, 1],
                  }}
                  onAnimationComplete={collectReturningFiles}
                >
                  <div className="mosby-cover-front">
                    <div
                      className="mosby-flight-paper"
                      style={{ height: "100%" }}
                    />
                  </div>
                  <div className="mosby-cover-back" />
                </motion.div>
              )}
              {flight && (
                <FlyingFileCard
                  flight={flight}
                  onShift={() => {
                    setGroupOrder((previous) => [
                      ...previous.filter((index) => index !== flight.row),
                      flight.row,
                    ]);
                    setFlight((previous) =>
                      previous ? { ...previous, shifted: true } : null,
                    );
                  }}
                  onReveal={() => {
                    setActiveRow(flight.row);
                    setActiveKey(flight.key);
                    setFrontProjects((previous) => ({
                      ...previous,
                      [fileRows[flight.row].id]: flight.key,
                    }));
                    setClosingCover(null);
                    setFlight((previous) =>
                      previous ? { ...previous, revealing: true } : null,
                    );
                  }}
                  onDone={() => {
                    busy.current = false;
                    setFlight(null);
                    if (
                      !flight.sameGroup &&
                      fileRows[flight.row].id !== "all" &&
                      flight.key !== fileRows[flight.row].keys[0]
                    )
                      restoreIndex(fileRows[flight.row].keys[0], flight.row);
                    const overview =
                      section.current?.querySelector<HTMLElement>(
                        ".archive-editorial",
                      );
                    if (overview)
                      cancelOverviewScroll.current =
                        smoothScrollToElement(overview);
                  }}
                />
              )}
            </section>
          )}
          {entry && (
            <OpeningDeckFile
              selection={entry}
              section={section}
              onReveal={(height) =>
                setEntry((previous) =>
                  previous
                    ? { ...previous, revealing: true, coverHeight: height }
                    : null,
                )
              }
              onDone={() => {
                setEntry(null);
                busy.current = false;
                const overview =
                  section.current?.querySelector<HTMLElement>(
                    ".archive-editorial",
                  );
                if (overview)
                  cancelOverviewScroll.current =
                    smoothScrollToElement(overview);
              }}
            />
          )}
          {returnDeck && (
            <ReturningFileDeck
              deck={returnDeck}
              onDone={finishReturnToIntroduction}
            />
          )}
        </MotionConfig>
      </div>
    </main>
  );
}
export default function FilePortfolio() {
  return (
    <LangProvider>
      <FileArchive />
    </LangProvider>
  );
}
