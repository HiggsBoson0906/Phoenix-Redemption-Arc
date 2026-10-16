// src/content/cs-fundamentals/os/articles/processes.ts

import type { Article } from "@/types";

const processesArticle: Article = {
  slug: "processes",
  title: "Processes",
  summary:
    "A process is a program in execution — the OS's unit of resource allocation and the foundation everything else in this subject builds on.",
  readingTimeMins: 9,
  beginnerExplanation:
    "A program is a passive set of instructions sitting on disk (like an .exe or a compiled binary). A process is what you get when the OS loads that program into memory and starts running it — it's \"alive\": it has its own memory space, its own copy of variables, and the CPU is actively executing its instructions (or it's waiting its turn to).\n\nThink of a recipe (the program) versus a chef actually cooking it (the process). You can have the same recipe open in five kitchens at once — five separate processes, each with its own ingredients (memory), even though they're following identical instructions.",
  detailedBreakdown:
    "Every process the OS manages has a Process Control Block (PCB) — a kernel data structure that stores everything the OS needs to manage that process: process ID (PID), process state, program counter, CPU registers, CPU scheduling info (priority, etc.), memory management info (page tables, base/limit registers), accounting info, and I/O status (open file descriptors, allocated devices).\n\nA process's memory is divided into four classic segments: the Text segment (compiled code, read-only), the Data segment (global/static variables, split into initialized and uninitialized/BSS), the Heap (dynamically allocated memory that grows upward via malloc/new), and the Stack (function call frames, local variables, grows downward). The gap between heap and stack is free address space either can grow into.\n\nA process moves through a well-defined state machine: New (being created) → Ready (loaded, waiting for CPU) → Running (currently executing on a CPU core) → Waiting/Blocked (waiting on I/O or an event) → Terminated. On a single core, only one process is Running at any instant; the rest of the runnable ones sit in the Ready queue.\n\nProcesses are created via system calls — fork() on Unix creates a near-identical child process (duplicating the parent's address space, copy-on-write in practice), and exec() replaces a process's memory image with a new program. Windows uses CreateProcess() to do both in one step. A parent can wait() on a child to reap its exit status; a child whose parent hasn't reaped it yet after exiting becomes a zombie, and one whose parent dies first becomes an orphan (reparented to init/systemd on Unix).",
  realWorldExamples:
    "Open Task Manager or `ps aux` on any machine and every row is a process — your browser, each browser tab (Chrome deliberately runs each tab as a separate process for isolation and crash containment), your IDE, background services. When you run `python script.py`, the shell forks a child process and execs Python into it. Docker containers are, at the OS level, just regular Linux processes isolated using namespaces and cgroups — there's no separate \"container process\" concept in the kernel.",
  useCases: [
    "Isolating independent programs from each other's memory and failures (a crash in one process can't corrupt another's memory)",
    "Running multiple instances of the same program safely (each gets its own address space)",
    "Building multi-process architectures like browsers (one process per tab) or web servers (worker processes per request)",
  ],
  advantages: [
    "Strong memory isolation — one process cannot accidentally (or maliciously) read/write another's memory",
    "A crash in one process doesn't take down others",
    "The OS can independently schedule, prioritize, and resource-limit each process",
  ],
  disadvantages: [
    "Creating a process and switching between processes is relatively expensive (full address space setup, TLB/cache effects)",
    "Inter-process communication (IPC) needs explicit mechanisms (pipes, sockets, shared memory) since memory isn't shared by default",
    "Higher memory overhead than threads since each process duplicates its own code/data mappings and kernel bookkeeping",
  ],
  commonMisconceptions: [
    "\"A process and a program are the same thing\" — a program is static code on disk; a process is a running instance with its own state.",
    "\"fork() copies the entire parent memory immediately\" — modern Unix uses copy-on-write, so pages are only duplicated when either process writes to them.",
    "\"More processes always means more parallelism\" — on a single-core CPU you still get only one Running process at a time; the OS is time-slicing, not parallelizing.",
  ],
  interviewPerspective:
    "Interviewers use \"what is a process\" as a warm-up to gauge whether you actually understand OS fundamentals versus having memorized definitions. Be ready to draw the process state diagram from memory, explain what's in a PCB and why context switching needs it, and clearly distinguish fork()/exec()/wait() semantics — this trio is asked constantly at both service-based and product-based companies. Zombie vs orphan process is also a very common rapid-fire follow-up.",
  oaPerspective:
    "OA rounds test this as conceptual MCQs: state-transition validity (\"can a process go directly from Running to Ready?\" — yes, on preemption), what's stored in a PCB, and fork() return-value semantics (0 in the child, child's PID in the parent, negative on failure). Expect \"how many processes does this fork() code create\" puzzle questions — these are genuinely common and testable with a quick 2^n rule of thumb for n sequential forks.",
  keyTakeaways: [
    "A process = program + execution state (memory, registers, open files, PCB entry).",
    "Process states: New → Ready → Running → Waiting → Terminated, tracked via the PCB.",
    "fork() duplicates a process (copy-on-write); exec() replaces the program image; wait() reaps exit status.",
    "A zombie has exited but not been reaped; an orphan's parent has exited before it did.",
  ],
  summaryClosing:
    "Processes are the OS's fundamental abstraction for isolated, independently-schedulable execution. Everything else in this subject — threads, scheduling, synchronization, memory management — exists to manage processes (or the lighter-weight threads inside them) more efficiently.",
  relatedTopics: ["Threads", "Context Switching", "Scheduling Algorithms"],
  furtherReading: [
    { label: "OSTEP: Process Abstraction", note: "Free online OS textbook chapter, the clearest treatment of this topic available." },
    { label: "man 2 fork / man 2 execve", note: "Read the actual Linux man pages for exact semantics." },
  ],
};

export default processesArticle;
