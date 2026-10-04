/* ==========================================================
   Lex · IntelliCon'26 prototype (desktop website layout)
   Start:   landing → Sign In (login form) or Sign Up (role selection)
   Client:  sign in / sign up → home feed
   Lawyer:  sign in → dashboard, or sign up → registration → dashboard (+ sidebar, feature screens)
   ========================================================== */

// TESTING ONLY: when true, the Lawyer Registration form accepts any input
// (even empty fields and no document) and goes straight to the dashboard
// as a verified lawyer. Set to false before demoing the real flow.
const DEV_BYPASS_VERIFICATION = true;

/* ---------- Screens ----------
   Every <section class="screen" id="screen-xyz"> is registered automatically
   under the key "xyz". To add a screen, add the section in index.html and
   call showScreen("xyz"). */

const screens = Object.fromEntries(
  [...document.querySelectorAll(".screen")].map((el) => [el.id.replace(/^screen-/, ""), el])
);

// Which part of the site each screen belongs to. CSS uses this (body[data-area])
// to decide what the navbar shows and whether the sidebar is visible.
// Any screen not listed here is treated as a lawyer screen.
const SCREEN_AREA = {
  landing: "auth",
  signin: "auth",
  welcome: "welcome", // Sign Up: choose a role
  home: "client",
  lawyer: "register",
};

// Floating shortcut to Common Chat
const fabChat = document.getElementById("fab-chat");

function showScreen(name) {
  if (!screens[name]) {
    console.warn(`Unknown screen: ${name}`);
    return;
  }

  Object.entries(screens).forEach(([key, el]) => {
    const active = key === name;
    el.hidden = !active;
    el.setAttribute("aria-hidden", active ? "false" : "true");
    el.classList.toggle("is-active", active);
  });

  document.body.dataset.screen = name;
  const area = SCREEN_AREA[name] || "lawyer";
  document.body.dataset.area = area;

  // The chat shortcut shows on every lawyer screen except Common Chat itself
  fabChat.hidden = !(area === "lawyer" && name !== "common-chat");

  // Highlight the matching sidebar link
  document.querySelectorAll(".side-link:not(.side-signout)").forEach((link) => {
    const target = link.dataset.open || link.dataset.go;
    if (target === name) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });

  window.scrollTo({ top: 0, behavior: "instant" });

  // The thread can only be scrolled once it is visible
  if (name === "personal-chat") scrollChatToBottom();
}

/* ---------- Navigation ---------- */

// Anything with data-go="screenName" navigates there (Change role, Back, Overview, Sign out)
document.querySelectorAll("[data-go]").forEach((el) => {
  el.addEventListener("click", () => showScreen(el.dataset.go));
});

// Anything with data-open="screenName" opens that screen:
//  - the sidebar links (common-chat, notifications, my-room, personal-chat, vault)
//  - the profile picture in the navbar (profile)
document.querySelectorAll("[data-open]").forEach((el) => {
  el.addEventListener("click", () => showScreen(el.dataset.open));
});

// Clicking the logo goes "home": the dashboard for lawyers, the feed for clients,
// and the role selection while a lawyer is still registering
document.getElementById("nav-brand").addEventListener("click", () => {
  const area = document.body.dataset.area;
  showScreen(area === "lawyer" ? "dashboard" : area === "client" ? "home" : "welcome");
});

// Floating chat button: jump straight to Common Chat
fabChat.addEventListener("click", () => showScreen("common-chat"));

/* ---------- Sign Up: choose a role ---------- */

document.getElementById("btn-client").addEventListener("click", () => {
  showScreen("home");
  showToast("Account created. Welcome to Lex.");
});

document.getElementById("btn-lawyer").addEventListener("click", () => {
  showScreen("lawyer");
});

/* ---------- Client home feed (mock data) ---------- */

const mockQuestions = [
  {
    id: "4821",
    category: "Tenancy",
    title: "Can my landlord keep my whole deposit for normal wear and tear?",
    body: "I moved out after two years and left the flat clean. The landlord says the paint and carpet need replacing and is keeping everything.",
    replies: 3,
    time: "2h ago",
  },
  {
    id: "3307",
    category: "Employment",
    title: "I was dismissed a week after asking about unpaid overtime. Is that retaliation?",
    body: "I have emails showing I worked extra hours. My manager never answered them, and then I received a termination letter.",
    replies: 5,
    time: "5h ago",
  },
  {
    id: "9154",
    category: "Consumer",
    title: "A contractor took 50% upfront and stopped responding. What can I do?",
    body: "We signed a short written agreement for a kitchen renovation. No work has happened in three weeks and my calls go unanswered.",
    replies: 2,
    time: "Yesterday",
  },
  {
    id: "6612",
    category: "Family",
    title: "How is custody usually decided when parents live in different cities?",
    body: "We are separating amicably and want to understand what a court would look at before we agree on anything.",
    replies: 4,
    time: "Yesterday",
  },
  {
    id: "2078",
    category: "Business",
    title: "Do I need a written contract for a small freelance project?",
    body: "A client wants me to start tomorrow on a handshake. Is a verbal agreement enough if something goes wrong?",
    replies: 1,
    time: "2 days ago",
  },
];

function createEl(tag, className, text) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text !== undefined) el.textContent = text;
  return el;
}

function renderFeed() {
  const feed = document.getElementById("feed");
  feed.replaceChildren();

  mockQuestions.forEach((q, index) => {
    const card = createEl("article", "feed-card" + (index === 0 ? " featured" : ""));

    card.append(createEl("p", "feed-meta", `${q.category} · Anon #${q.id}`), createEl("h3", "", q.title));
    if (q.body) card.append(createEl("p", "", q.body));

    const footer = createEl("div", "feed-footer");
    const replyText =
      q.replies === 0 ? "No lawyer replies yet" : `${q.replies} lawyer ${q.replies === 1 ? "reply" : "replies"}`;
    footer.append(createEl("span", "", replyText), createEl("span", "", q.time));
    card.append(footer);

    feed.append(card);
  });
}

function randomAnonId() {
  return String(Math.floor(1000 + Math.random() * 9000));
}

document.getElementById("ask-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  const text = String(data.get("question") || "").trim();
  if (!text) return;

  const isLong = text.length > 90;
  mockQuestions.unshift({
    id: randomAnonId(),
    category: String(data.get("category") || "Other"),
    title: isLong ? text.slice(0, 87).trimEnd() + "…" : text,
    body: isLong ? text : "",
    replies: 0,
    time: "Just now",
  });

  renderFeed();
  form.reset();
});

/* ---------- Lawyer registration: file upload ---------- */

const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB
const DEFAULT_HINT = "PDF or image · click to browse or drop a file here";

const dropzone = document.getElementById("dropzone");
const fileInput = document.getElementById("verification-file");
const dropzoneHint = document.getElementById("dropzone-hint");
const formNote = document.getElementById("form-note");

function showNote(message, isError) {
  formNote.textContent = message;
  formNote.classList.toggle("is-error", Boolean(isError));
  formNote.hidden = !message;
}

function setSelectedFile(file) {
  if (!file) {
    dropzoneHint.textContent = DEFAULT_HINT;
    dropzone.classList.remove("has-file");
    return;
  }
  dropzoneHint.textContent = file.name;
  dropzone.classList.add("has-file");
}

function isAcceptedFile(file) {
  return file.type === "application/pdf" || file.type.startsWith("image/");
}

fileInput.addEventListener("change", () => {
  setSelectedFile(fileInput.files[0]);
  showNote("");
});

["dragenter", "dragover"].forEach((eventName) => {
  dropzone.addEventListener(eventName, (event) => {
    event.preventDefault();
    dropzone.classList.add("is-dragging");
  });
});

["dragleave", "drop"].forEach((eventName) => {
  dropzone.addEventListener(eventName, (event) => {
    event.preventDefault();
    dropzone.classList.remove("is-dragging");
  });
});

dropzone.addEventListener("drop", (event) => {
  const file = event.dataTransfer.files[0];
  if (!file) return;
  if (!isAcceptedFile(file)) {
    showNote("Upload a PDF or an image file.", true);
    return;
  }
  const transfer = new DataTransfer();
  transfer.items.add(file);
  fileInput.files = transfer.files;
  setSelectedFile(file);
  showNote("");
});

/* ---------- Lawyer profile ---------- */

function applyProfile({ name, email, barNumber, jurisdiction, practiceArea }) {
  const displayName = (name || "").trim() || "Alexandra Chen";
  document.getElementById("nav-name").textContent = displayName;
  document.getElementById("lb-you-name").textContent = displayName;
  document.getElementById("dash-name").textContent = displayName;
  document.getElementById("profile-name").textContent = displayName;
  document.getElementById("profile-email").textContent = email || "achen@firm.com";
  document.getElementById("profile-bar").textContent = barNumber || "TX 24012345";
  document.getElementById("profile-jurisdiction").textContent = jurisdiction || "Texas, USA";
  document.getElementById("profile-practice").textContent = practiceArea || "Employment law";

  const parts = displayName.split(/\s+/);
  const first = parts[0]?.[0] || "A";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : parts[0]?.[1] || "C";
  document.querySelector(".avatar").textContent = (first + last).toUpperCase();
}

// Turns off the browser's "required" checks so an empty form can still submit
document.getElementById("lawyer-form").noValidate = DEV_BYPASS_VERIFICATION;

document.getElementById("lawyer-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;

  // Document checks are skipped while DEV_BYPASS_VERIFICATION is on
  if (!DEV_BYPASS_VERIFICATION) {
    const file = fileInput.files[0];
    if (!file) {
      showNote("Upload a verification document to continue.", true);
      return;
    }
    if (!isAcceptedFile(file)) {
      showNote("Upload a PDF or an image file.", true);
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      showNote("That file is over 10 MB. Upload a smaller one.", true);
      return;
    }
  }

  const data = new FormData(form);
  applyProfile({
    name: data.get("fullName"),
    email: data.get("email"),
    barNumber: data.get("barNumber"),
    jurisdiction: data.get("jurisdiction"),
    practiceArea: data.get("practiceArea"),
  });

  // Prototype only: nothing is sent to a server. A real build would upload
  // the document and form data to a backend for verification here.

  form.reset();
  setSelectedFile(null);
  showNote("");
  showScreen("dashboard");
  showToast("Application submitted. Welcome to Lex.");
});

/* ==========================================================
   My Room: calendar notes + simulated document storage
   ========================================================== */

const byId = (id) => document.getElementById(id);
const pad2 = (n) => String(n).padStart(2, "0");
const dateKey = (d) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
const keyToDate = (key) => {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
};
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

const TRASH_ICON =
  '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-12M9 7V4h6v3"/></svg>';

/* ---------- Calendar and notes ---------- */

const NOTES_KEY = "lex.myroom.notes";

// Shape: { "2026-10-05": [{ id, text, time }] }  (time is "" or "HH:MM")
function seedNotes() {
  const now = new Date();
  const inDays = (n) => dateKey(new Date(now.getFullYear(), now.getMonth(), now.getDate() + n));
  return {
    [inDays(2)]: [{ id: uid(), text: "Call back Anon #4821 about the deposit claim", time: "10:00" }],
    [inDays(5)]: [{ id: uid(), text: "Draft reply for the overtime case (Anon #3307)", time: "" }],
  };
}

function loadNotes() {
  try {
    const parsed = JSON.parse(localStorage.getItem(NOTES_KEY));
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) return parsed;
  } catch (err) {
    /* storage unavailable or corrupted: fall back to the demo notes */
  }
  return seedNotes();
}

function persistNotes() {
  try {
    localStorage.setItem(NOTES_KEY, JSON.stringify(notesByDate));
  } catch (err) {
    /* storage unavailable: notes still work for this session */
  }
}

let notesByDate = loadNotes();
let viewDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
let activeKey = null;

const calGrid = byId("cal-grid");
const calMonth = byId("cal-month");
const upcomingList = byId("upcoming-list");
const noteDialog = byId("note-dialog");
const noteTitle = byId("note-dialog-title");
const noteList = byId("note-list");
const noteForm = byId("note-form");
const noteText = byId("note-text");
const noteTime = byId("note-time");
const noteStatus = byId("note-status");

const notesFor = (key) => notesByDate[key] || [];
const byTime = (a, b) => (a.time || "99:99").localeCompare(b.time || "99:99");

function renderCalendar() {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const todayKey = dateKey(new Date());

  calMonth.textContent = viewDate.toLocaleDateString(undefined, { month: "long", year: "numeric" });
  calGrid.replaceChildren();

  // Weeks start on Monday
  const leadingBlanks = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < leadingBlanks; i++) calGrid.append(createEl("span", "cal-blank"));

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const key = dateKey(date);
    const count = notesFor(key).length;

    const button = createEl("button", "cal-day");
    button.type = "button";
    button.dataset.date = key;
    if (key === todayKey) button.classList.add("is-today");

    const label = date.toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long", year: "numeric" });
    button.setAttribute("aria-label", count ? `${label}, ${count} ${count === 1 ? "note" : "notes"}` : label);

    button.append(createEl("span", "", String(day)), createEl("span", count ? "cal-dot" : "cal-dot-spacer"));
    calGrid.append(button);
  }
}

function renderUpcoming() {
  const todayKey = dateKey(new Date());
  const items = Object.entries(notesByDate)
    .filter(([key]) => key >= todayKey)
    .flatMap(([key, notes]) => notes.map((note) => ({ key, ...note })))
    .sort((a, b) => a.key.localeCompare(b.key) || byTime(a, b))
    .slice(0, 6);

  upcomingList.replaceChildren();

  if (!items.length) {
    const li = createEl("li");
    li.append(createEl("p", "empty-line", "No upcoming reminders. Click a date on the calendar to add one."));
    upcomingList.append(li);
    return;
  }

  items.forEach((item) => {
    const date = keyToDate(item.key);
    const li = createEl("li");
    const button = createEl("button", "upcoming-item");
    button.type = "button";
    button.dataset.date = item.key;

    const chip = createEl("span", "upcoming-date");
    chip.append(
      createEl("strong", "", String(date.getDate())),
      createEl("span", "", date.toLocaleDateString(undefined, { month: "short" }))
    );

    const text = createEl("span", "upcoming-text");
    const when = date.toLocaleDateString(undefined, { weekday: "long" }) + (item.time ? ` · ${item.time}` : "");
    text.append(createEl("strong", "", item.text), createEl("span", "", when));

    button.append(chip, text);
    li.append(button);
    upcomingList.append(li);
  });
}

function renderNoteList() {
  noteList.replaceChildren();
  const notes = [...notesFor(activeKey)].sort(byTime);

  if (!notes.length) {
    const li = createEl("li");
    li.append(createEl("p", "empty-line", "No notes for this day yet."));
    noteList.append(li);
    return;
  }

  notes.forEach((note) => {
    const li = createEl("li", "note-item");
    const body = createEl("span", "note-item-text");
    if (note.time) body.append(createEl("span", "note-item-time", note.time));
    body.append(document.createTextNode(note.text));

    const del = createEl("button", "note-delete");
    del.type = "button";
    del.dataset.delete = note.id;
    del.setAttribute("aria-label", "Delete note");
    del.innerHTML = TRASH_ICON;

    li.append(body, del);
    noteList.append(li);
  });
}

function showNoteStatus(message) {
  noteStatus.textContent = message;
  noteStatus.hidden = !message;
}

function openNoteDialog(key) {
  activeKey = key;
  noteTitle.textContent = keyToDate(key).toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  renderNoteList();
  showNoteStatus("");
  noteForm.reset();

  if (typeof noteDialog.showModal === "function") noteDialog.showModal();
  else noteDialog.setAttribute("open", ""); // very old browsers: show without the modal backdrop
  noteText.focus();
}

function closeNoteDialog() {
  if (typeof noteDialog.close === "function") noteDialog.close();
  else noteDialog.removeAttribute("open");
}

// Click a date (event delegation on the grid)
calGrid.addEventListener("click", (event) => {
  const day = event.target.closest(".cal-day");
  if (day) openNoteDialog(day.dataset.date);
});

// Click an upcoming reminder to edit that date
upcomingList.addEventListener("click", (event) => {
  const item = event.target.closest(".upcoming-item");
  if (!item) return;
  const target = keyToDate(item.dataset.date);
  viewDate = new Date(target.getFullYear(), target.getMonth(), 1);
  renderCalendar();
  openNoteDialog(item.dataset.date);
});

byId("cal-prev").addEventListener("click", () => {
  viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1);
  renderCalendar();
});

byId("cal-next").addEventListener("click", () => {
  viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1);
  renderCalendar();
});

byId("cal-today").addEventListener("click", () => {
  const now = new Date();
  viewDate = new Date(now.getFullYear(), now.getMonth(), 1);
  renderCalendar();
});

// Save a note
noteForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = noteText.value.trim();
  if (!text || !activeKey) return;

  (notesByDate[activeKey] ||= []).push({ id: uid(), text, time: noteTime.value || "" });
  persistNotes();

  renderNoteList();
  renderCalendar();
  renderUpcoming();
  noteForm.reset();
  showNoteStatus("Note saved.");
  noteText.focus();
});

// Delete a note
noteList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-delete]");
  if (!button || !activeKey) return;

  notesByDate[activeKey] = notesFor(activeKey).filter((note) => note.id !== button.dataset.delete);
  if (!notesByDate[activeKey].length) delete notesByDate[activeKey];
  persistNotes();

  renderNoteList();
  renderCalendar();
  renderUpcoming();
  showNoteStatus("Note deleted.");
});

byId("note-close").addEventListener("click", closeNoteDialog);
byId("note-done").addEventListener("click", closeNoteDialog);

// Click on the dark backdrop closes the dialog
noteDialog.addEventListener("click", (event) => {
  if (event.target === noteDialog) closeNoteDialog();
});

// Return focus to the date that was open
noteDialog.addEventListener("close", () => {
  const button = calGrid.querySelector(`[data-date="${activeKey}"]`);
  if (button) button.focus();
});

/* ---------- Document storage (simulated: files are never uploaded anywhere) ---------- */

const MB = 1024 * 1024;
const STORAGE_CAPACITY = 100 * MB; // pretend free plan: 100 MB
const UPLOAD_MS = 1200;

const daysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
};

// Demo files that add up to 90 MB, so the meter starts at 90%
let docs = [
  { id: uid(), name: "Retainer agreement.pdf", size: Math.round(12.4 * MB), added: daysAgo(3) },
  { id: uid(), name: "Tenancy evidence photos.zip", size: Math.round(48.1 * MB), added: daysAgo(6) },
  { id: uid(), name: "Witness statements.docx", size: Math.round(8.2 * MB), added: daysAgo(9) },
  { id: uid(), name: "Court filing scans.pdf", size: Math.round(21.3 * MB), added: daysAgo(14) },
];

const docList = byId("doc-list");
const docInput = byId("doc-file-input");
const storagePercent = byId("storage-percent");
const storageDetail = byId("storage-detail");
const storageMeter = byId("storage-meter");
const storageFill = byId("storage-fill");
const storageNote = byId("storage-note");
const upgradeBanner = byId("upgrade-banner");
const upgradeNote = byId("upgrade-note");

const totalBytes = () => docs.reduce((sum, doc) => sum + doc.size, 0);

function formatSize(bytes) {
  if (bytes <= 0) return "0 KB";
  if (bytes >= 1024 * MB) return `${(bytes / (1024 * MB)).toFixed(1)} GB`;
  if (bytes >= MB) return `${(bytes / MB).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

function setStorageNote(message, isError) {
  storageNote.textContent = message;
  storageNote.classList.toggle("is-error", Boolean(isError));
}

function renderStorage() {
  const used = totalBytes();
  const ratio = Math.min(1, used / STORAGE_CAPACITY);
  const percent = Math.round(ratio * 100);

  storagePercent.textContent = `${percent}% Storage Used`;
  storageDetail.textContent = `${formatSize(used)} of ${formatSize(STORAGE_CAPACITY)}`;
  storageFill.style.width = `${ratio * 100}%`;
  storageMeter.setAttribute("aria-valuenow", String(percent));
  storageMeter.classList.toggle("is-warn", percent >= 85);
  storageMeter.classList.toggle("is-full", percent >= 100);
}

function renderDocs() {
  docList.replaceChildren();

  if (!docs.length) {
    const li = createEl("li");
    li.append(createEl("p", "empty-line", "No documents yet. Use Upload document to add your first file."));
    docList.append(li);
    return;
  }

  [...docs]
    .sort((a, b) => b.added - a.added)
    .forEach((doc) => {
      const li = createEl("li", "doc-item");

      const ext = (doc.name.includes(".") ? doc.name.split(".").pop() : "file").slice(0, 4).toUpperCase();
      const info = createEl("div", "doc-info");
      info.append(createEl("p", "doc-name", doc.name));

      if (doc.uploading) {
        info.append(createEl("p", "doc-meta", `Uploading · ${formatSize(doc.size)}`));
        const bar = createEl("div", "doc-progress");
        const fill = createEl("span", "doc-progress-fill");
        fill.style.setProperty("--elapsed", `-${Date.now() - doc.startedAt}ms`);
        bar.append(fill);
        info.append(bar);
        li.append(createEl("span", "doc-type", ext), info);
      } else {
        const added = doc.added.toLocaleDateString(undefined, { day: "numeric", month: "short" });
        info.append(createEl("p", "doc-meta", `${formatSize(doc.size)} · Added ${added}`));

        const remove = createEl("button", "doc-remove");
        remove.type = "button";
        remove.dataset.remove = doc.id;
        remove.setAttribute("aria-label", `Remove ${doc.name}`);
        remove.innerHTML = TRASH_ICON;

        li.append(createEl("span", "doc-type", ext), info, remove);
      }

      docList.append(li);
    });
}

function highlightUpgrade() {
  upgradeBanner.classList.remove("is-highlight");
  void upgradeBanner.offsetWidth; // restart the animation
  upgradeBanner.classList.add("is-highlight");
  setTimeout(() => upgradeBanner.classList.remove("is-highlight"), 1900);
}

function handleFiles(files) {
  const rejected = [];
  let accepted = 0;

  files.forEach((file) => {
    const free = STORAGE_CAPACITY - totalBytes();
    if (file.size > free) {
      rejected.push({ name: file.name, size: file.size, free });
      return;
    }

    const doc = {
      id: uid(),
      name: file.name,
      size: file.size,
      added: new Date(),
      uploading: true,
      startedAt: Date.now(),
    };
    docs.push(doc);
    accepted++;

    // Simulated upload: nothing is sent anywhere, the file just "finishes" after a moment
    setTimeout(() => {
      doc.uploading = false;
      renderDocs();
    }, UPLOAD_MS);
  });

  renderStorage();
  renderDocs();

  if (rejected.length) {
    const first = rejected[0];
    const extra = rejected.length > 1 ? ` (and ${rejected.length - 1} more)` : "";
    setStorageNote(
      `"${first.name}" is ${formatSize(first.size)} but only ${formatSize(first.free)} is free${extra}. Upgrade to Premium to unlock extra storage space.`,
      true
    );
    highlightUpgrade();
  } else if (accepted) {
    const free = STORAGE_CAPACITY - totalBytes();
    setStorageNote(`${accepted} ${accepted === 1 ? "file" : "files"} added. ${formatSize(free)} free.`, false);
  }
}

byId("doc-upload-btn").addEventListener("click", () => docInput.click());

docInput.addEventListener("change", () => {
  const files = Array.from(docInput.files);
  docInput.value = ""; // lets the same file be picked again
  if (files.length) handleFiles(files);
});

docList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-remove]");
  if (!button) return;
  const doc = docs.find((d) => d.id === button.dataset.remove);
  docs = docs.filter((d) => d.id !== button.dataset.remove);
  renderStorage();
  renderDocs();
  if (doc) setStorageNote(`Removed "${doc.name}". ${formatSize(STORAGE_CAPACITY - totalBytes())} free.`, false);
});

byId("upgrade-btn").addEventListener("click", () => {
  upgradeNote.textContent = "Thanks for your interest. Premium upgrades are coming soon.";
  upgradeNote.hidden = false;
});

renderCalendar();
renderUpcoming();
renderStorage();
renderDocs();
setStorageNote(`${formatSize(STORAGE_CAPACITY - totalBytes())} free. Upload a document to try the storage limit.`, false);

/* ==========================================================
   Toast + Personal Chat
   ========================================================== */

/* ---------- Toast: "feature coming soon" ---------- */

const toastEl = byId("toast");
let toastTimer;

function showToast(message) {
  toastEl.textContent = message;
  toastEl.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove("is-visible"), 2400);
}

// Any element with data-soon="Name" shows "<Name>: feature coming soon" when clicked
document.querySelectorAll("[data-soon]").forEach((el) => {
  el.addEventListener("click", () => showToast(`${el.dataset.soon}: feature coming soon`));
});

/* ---------- Personal Chat (mock conversations, nothing is sent anywhere) ---------- */

// from: "them" = the client, "me" = the lawyer
const conversations = [
  {
    id: "4821",
    topic: "Tenancy",
    online: true,
    unread: 0,
    messages: [
      { from: "them", text: "Hi, thanks for taking my question about the deposit.", time: "10:02" },
      { from: "me", text: "Happy to help. Do you have the signed tenancy agreement and your move-out photos?", time: "10:05" },
      { from: "them", text: "Yes, I have both. The photos are timestamped.", time: "10:07" },
      { from: "me", text: "Perfect. Send them over when you can and I will review everything tonight.", time: "10:09" },
    ],
  },
  {
    id: "3307",
    topic: "Employment",
    online: true,
    unread: 2,
    messages: [
      { from: "them", text: "I received the termination letter this morning.", time: "09:12" },
      { from: "them", text: "It says my role was made redundant, but nobody else was let go.", time: "09:13" },
    ],
  },
  {
    id: "9154",
    topic: "Consumer",
    online: false,
    unread: 0,
    messages: [
      { from: "me", text: "Please send the written agreement you signed with the contractor.", time: "Yesterday" },
      { from: "them", text: "Will do, I will scan it tonight.", time: "Yesterday" },
    ],
  },
  {
    id: "6612",
    topic: "Family",
    online: false,
    unread: 1,
    messages: [{ from: "them", text: "Is it better to agree on custody before or after we file?", time: "Mon" }],
  },
];

let activeChatId = conversations[0].id;

const chatList = byId("chat-list");
const chatThread = byId("chat-thread");
const chatSearch = byId("chat-search");
const chatForm = byId("chat-form");
const chatInput = byId("chat-input");
const chatSend = byId("chat-send");

const activeConversation = () => conversations.find((c) => c.id === activeChatId);
const lastMessage = (conv) => conv.messages[conv.messages.length - 1];

function scrollChatToBottom() {
  chatThread.scrollTop = chatThread.scrollHeight;
}

function renderChatList() {
  const query = chatSearch.value.trim().toLowerCase();
  const matches = conversations.filter((conv) => {
    if (!query) return true;
    const haystack = `anon #${conv.id} ${conv.topic} ${lastMessage(conv)?.text || ""}`.toLowerCase();
    return haystack.includes(query);
  });

  chatList.replaceChildren();

  if (!matches.length) {
    const li = createEl("li");
    li.append(createEl("p", "chat-empty", "No conversations found."));
    chatList.append(li);
    return;
  }

  matches.forEach((conv) => {
    const last = lastMessage(conv);
    const li = createEl("li");

    const button = createEl("button", "chat-item" + (conv.id === activeChatId ? " is-active" : ""));
    button.type = "button";
    button.dataset.chatId = conv.id;
    if (conv.id === activeChatId) button.setAttribute("aria-current", "true");

    const body = createEl("span", "chat-item-body");
    body.append(
      createEl("span", "chat-item-name", `Anon #${conv.id}`),
      createEl("span", "chat-item-preview", last ? (last.from === "me" ? "You: " : "") + last.text : "No messages yet")
    );

    const meta = createEl("span", "chat-item-meta");
    meta.append(createEl("span", "", last ? last.time : ""));
    if (conv.unread > 0) meta.append(createEl("span", "chat-unread", String(conv.unread)));

    button.append(createEl("span", "chat-avatar-sm", conv.id.slice(0, 2)), body, meta);
    li.append(button);
    chatList.append(li);
  });
}

function renderChatHeader() {
  const conv = activeConversation();
  byId("chat-avatar").textContent = conv.id.slice(0, 2);
  byId("chat-name").textContent = `Anon #${conv.id}`;

  const sub = byId("chat-sub");
  sub.replaceChildren(
    createEl("span", "status-dot" + (conv.online ? " is-online" : "")),
    document.createTextNode(`${conv.online ? "Online" : "Away"} · ${conv.topic}`)
  );
}

function renderChatThread() {
  const conv = activeConversation();
  chatThread.replaceChildren(createEl("span", "chat-day", "Today"));

  conv.messages.forEach((message) => {
    const row = createEl("div", `msg ${message.from === "me" ? "msg-out" : "msg-in"}`);
    row.append(createEl("p", "msg-bubble", message.text), createEl("span", "msg-time", message.time));
    chatThread.append(row);
  });

  scrollChatToBottom();
}

function selectConversation(id) {
  activeChatId = id;
  activeConversation().unread = 0;
  renderChatList();
  renderChatHeader();
  renderChatThread();
}

chatList.addEventListener("click", (event) => {
  const item = event.target.closest(".chat-item");
  if (item) selectConversation(item.dataset.chatId);
});

chatSearch.addEventListener("input", renderChatList);

chatInput.addEventListener("input", () => {
  chatSend.disabled = chatInput.value.trim() === "";
});

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = chatInput.value.trim();
  if (!text) return;

  const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  activeConversation().messages.push({ from: "me", text, time });

  chatInput.value = "";
  chatSend.disabled = true;
  renderChatList();
  renderChatThread();
  chatInput.focus();
});

renderChatList();
renderChatHeader();
renderChatThread();

/* ==========================================================
   Truth Hub + AI Summarize
   ========================================================== */

// Truth Hub: submit a rumor for lawyers to check (prototype: nothing is sent anywhere)
byId("truth-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const input = byId("truth-input");
  if (!input.value.trim()) return;
  showToast("Rumor sent to lawyers for review");
  input.value = "";
});

// Personal Chat: AI Summarize button
byId("btn-ai-summarize").addEventListener("click", () => {
  showToast("Summarizing case...");
});

/* ==========================================================
   Truth Hub Requests (lawyer side)
   ========================================================== */

const trGrid = byId("tr-grid");
const trCount = byId("tr-count");
const trAllClear = byId("tr-allclear");

const TR_CHECK_ICON =
  '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9.5" /><path d="M8.5 12.5l2.5 2.5 4.5-5" /></svg>';
const TR_CROSS_ICON =
  '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9.5" /><path d="M9 9l6 6M15 9l-6 6" /></svg>';

function updateTruthRequestCount() {
  const pending = trGrid.querySelectorAll(".tr-card:not(.is-verified)").length;
  trCount.textContent = pending ? `${pending} pending` : "All caught up";
  trCount.classList.toggle("is-clear", pending === 0);
  trAllClear.hidden = pending !== 0;
}

// Mark as True / Mark as Fake (event delegation on the grid)
trGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-verdict]");
  if (!button) return;

  const card = button.closest(".tr-card");
  if (!card || card.classList.contains("is-verified")) return;

  const isTrue = button.dataset.verdict === "true";
  const label = isTrue ? "Verified True" : "Verified Fake";

  // Card status
  card.classList.add("is-verified", isTrue ? "is-true" : "is-fake");
  card.querySelector(".tr-status").textContent = "Verified";

  // Swap the two buttons for the verdict
  const result = createEl("div", `verdict ${isTrue ? "verdict-true" : "verdict-fake"} tr-result`);
  const badge = createEl("span", "verdict-badge");
  badge.innerHTML = isTrue ? TR_CHECK_ICON : TR_CROSS_ICON;
  badge.append(document.createTextNode(label));

  const by = createEl("span", "tr-by");
  by.append(document.createTextNode("Checked by "), createEl("strong", "", byId("nav-name").textContent), document.createTextNode(" · just now"));

  result.append(badge, by);
  card.querySelector(".tr-actions").replaceWith(result);

  updateTruthRequestCount();
  showToast(`${card.dataset.requestId} marked as ${isTrue ? "True" : "Fake"}`);
});

updateTruthRequestCount();

/* ==========================================================
   Authentication: landing, sign in, sign up
   ========================================================== */

// Landing buttons
byId("btn-signin").addEventListener("click", () => showScreen("signin"));
byId("btn-signup").addEventListener("click", () => showScreen("welcome"));

const signinForm = byId("signin-form");
const signinNote = byId("signin-note");
const pwInput = byId("signin-password");
const pwToggle = byId("pw-toggle");

function showSigninNote(message) {
  signinNote.textContent = message;
  signinNote.hidden = !message;
}

function setPasswordVisible(visible) {
  pwInput.type = visible ? "text" : "password";
  pwToggle.textContent = visible ? "Hide" : "Show";
  pwToggle.setAttribute("aria-label", visible ? "Hide password" : "Show password");
  pwToggle.setAttribute("aria-pressed", String(visible));
}

pwToggle.addEventListener("click", () => setPasswordVisible(pwInput.type === "password"));
signinForm.addEventListener("input", () => showSigninNote(""));

// Login (prototype: any email and password work, nothing is checked or sent anywhere)
signinForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(signinForm);
  const email = String(data.get("email") || "").trim();
  const password = String(data.get("password") || "");
  const role = data.get("role") === "lawyer" ? "lawyer" : "client";

  if (!email || !password) {
    showSigninNote("Enter your email and password.");
    return;
  }

  signinForm.reset();
  setPasswordVisible(false);
  showSigninNote("");

  if (role === "lawyer") {
    byId("profile-email").textContent = email;
    showScreen("dashboard");
  } else {
    showScreen("home");
  }
  showToast("Signed in. Welcome back.");
});

/* ---------- Start ---------- */

renderFeed();
showScreen("landing");