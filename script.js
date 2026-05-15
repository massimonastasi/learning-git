/* =========================================================
   Git cheat sheet — GSAP animations
   One timeline per concept, auto-played when in view, and
   replayable via the "Replay" button under each visual.
   ========================================================= */

(function () {
  if (!window.gsap) {
    console.warn("GSAP failed to load — animations will not run.");
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- helpers ---------- */
  const $ = (sel, scope) => (scope || document).querySelector(sel);
  const $$ = (sel, scope) => Array.from((scope || document).querySelectorAll(sel));

  // Mirror any SVG attribute opacity="0" into CSS opacity so GSAP reads/writes
  // the same value across browsers and won't get fooled by presentation
  // attributes vs inline styles.
  $$("[opacity='0']").forEach((el) => gsap.set(el, { opacity: 0 }));

  /* ---------- per-concept builders ---------- */
  const builders = {
    /* ---------------- 01 Repository ---------------- */
    repository(section) {
      const files = $$(".repo-file", section);
      const targets = [
        { x: 140, y: 210 },
        { x: 198, y: 200 },
        { x: 256, y: 210 },
      ];
      files.forEach((f, i) => {
        gsap.set(f, {
          x: targets[i].x,
          y: targets[i].y - 220,
          rotation: -10 + i * 8,
          opacity: 0,
          transformOrigin: "50% 50%",
        });
      });

      const tl = gsap.timeline({ paused: true });
      tl.from($(".repo-folder", section), {
        scale: 0.85,
        opacity: 0,
        transformOrigin: "50% 100%",
        duration: 0.5,
        ease: "back.out(1.6)",
      })
        .to(
          files,
          {
            y: (i) => targets[i].y,
            rotation: 0,
            opacity: 1,
            duration: 0.55,
            ease: "back.out(1.4)",
            stagger: 0.18,
          },
          "-=0.1"
        )
        .fromTo(
          $(".repo-cloud", section),
          { opacity: 0, y: 10 },
          { opacity: 1, y: -6, duration: 0.45, ease: "power2.out" },
          "-=0.3"
        )
        .to(
          $(".repo-line", section),
          { opacity: 1, duration: 0.4 },
          "-=0.2"
        )
        .fromTo(
          $(".repo-tag", section),
          { opacity: 0, x: 40 },
          { opacity: 1, x: 0, duration: 0.45, ease: "power3.out" },
          "-=0.2"
        );
      return tl;
    },

    /* ---------------- 02 Clone ---------------- */
    clone(section) {
      const arrow = $(".clone-arrow", section);
      const head = $(".clone-arrowhead", section);
      const packets = $$(".clone-pkt", section);

      const arrowLen = 160;
      gsap.set(arrow, { strokeDasharray: arrowLen, strokeDashoffset: arrowLen });
      gsap.set(head, { opacity: 0 });
      packets.forEach((p, i) => {
        gsap.set(p, { opacity: 0, x: 210, y: 156 + i * 16 });
      });

      const tl = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 0.6 });
      tl.from($(".clone-remote", section), {
        opacity: 0,
        x: -30,
        duration: 0.5,
        ease: "power2.out",
      })
        .from(
          $(".clone-laptop", section),
          { opacity: 0, x: 30, duration: 0.5, ease: "power2.out" },
          "<"
        )
        .to(arrow, {
          strokeDashoffset: 0,
          duration: 0.5,
          ease: "power2.out",
        })
        .to(head, { opacity: 1, duration: 0.15 }, "-=0.1")
        .to(packets, {
          x: 410,
          opacity: 1,
          duration: 0.9,
          stagger: 0.22,
          ease: "power2.inOut",
        })
        .to(packets, { opacity: 0, duration: 0.25 }, "-=0.05");
      return tl;
    },

    /* ---------------- 03 Branch ---------------- */
    branch(section) {
      const mainCommits = $$(".branch-main-commits .bc", section);
      const subRail = $(".branch-sub-rail", section);
      const subCommits = $$(".branch-sub-commits .bsc", section);

      gsap.set(mainCommits, {
        scale: 0,
        opacity: 0,
        transformOrigin: "50% 50%",
      });
      gsap.set(subRail, { opacity: 0 });
      gsap.set(subCommits, {
        scale: 0,
        opacity: 0,
        transformOrigin: "50% 50%",
      });

      // length-based dash trick for "draw" effect
      const rail = $(".branch-rail", section);
      const railLen = 500;
      gsap.set(rail, {
        strokeDasharray: railLen,
        strokeDashoffset: railLen,
      });

      const subLen = 380;
      gsap.set(subRail, {
        strokeDasharray: subLen,
        strokeDashoffset: subLen,
        opacity: 1,
      });

      const tl = gsap.timeline({ paused: true });
      tl.to(rail, { strokeDashoffset: 0, duration: 0.7, ease: "power2.inOut" })
        .to(
          mainCommits.slice(0, 2),
          {
            scale: 1,
            opacity: 1,
            duration: 0.35,
            stagger: 0.15,
            ease: "back.out(1.7)",
          },
          "-=0.4"
        )
        .to(subRail, {
          strokeDashoffset: 0,
          duration: 0.6,
          ease: "power2.inOut",
        })
        .to(subCommits, {
          scale: 1,
          opacity: 1,
          duration: 0.35,
          stagger: 0.2,
          ease: "back.out(1.7)",
        })
        .to(
          mainCommits.slice(2),
          {
            scale: 1,
            opacity: 1,
            duration: 0.35,
            stagger: 0.2,
            ease: "back.out(1.7)",
          },
          "-=0.3"
        );
      return tl;
    },

    /* ---------------- 04 Commit ---------------- */
    commit(section) {
      const lines = $$(".commit-code .cl", section);
      gsap.set(lines, { scaleX: 0, transformOrigin: "0% 50%" });

      const tl = gsap.timeline({ paused: true });
      tl.from($(".commit-code rect", section), {
        scale: 0.92,
        opacity: 0,
        transformOrigin: "50% 50%",
        duration: 0.45,
        ease: "power2.out",
      })
        .to(lines, {
          scaleX: 1,
          duration: 0.4,
          stagger: 0.08,
          ease: "power2.out",
        })
        .to(
          $(".commit-frame", section),
          { opacity: 1, duration: 0.25 },
          "+=0.1"
        )
        .to($(".commit-flash", section), {
          opacity: 0.85,
          duration: 0.12,
          ease: "power1.in",
        })
        .to($(".commit-flash", section), {
          opacity: 0,
          duration: 0.35,
          ease: "power2.out",
        })
        .fromTo(
          $(".commit-dot", section),
          { opacity: 0, scale: 0, transformOrigin: "50% 50%" },
          {
            opacity: 1,
            scale: 1,
            duration: 0.45,
            ease: "back.out(2)",
          },
          "-=0.15"
        )
        .fromTo(
          $(".commit-bubble", section),
          { opacity: 0, x: -20 },
          { opacity: 1, x: 0, duration: 0.4, ease: "power2.out" }
        )
        .to($(".commit-sha", section), { opacity: 1, duration: 0.3 }, "-=0.1");
      return tl;
    },

    /* ---------------- 05 Push / Pull ---------------- */
    pushpull(section) {
      const push = $(".pp-push-pkt", section);
      const pull = $(".pp-pull-pkt", section);

      gsap.set(push, { opacity: 0, x: 210, y: 156 });
      gsap.set(pull, { opacity: 0, x: 376, y: 200 });

      const tl = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 0.4 });
      tl.to(push, { opacity: 1, duration: 0.2 })
        .to(push, {
          x: 376,
          duration: 1,
          ease: "power2.inOut",
        })
        .to(push, { opacity: 0, duration: 0.2 })
        .to(pull, { opacity: 1, duration: 0.2 }, "+=0.2")
        .to(pull, {
          x: 210,
          duration: 1,
          ease: "power2.inOut",
        })
        .to(pull, { opacity: 0, duration: 0.2 });
      return tl;
    },

    /* ---------------- 06 Diff ---------------- */
    diff(section) {
      const leftTexts = $$(".diff-left-lines text", section);
      const rightTexts = $$(".diff-right-lines text", section);
      const leftBars = $$(".diff-left-lines .dl", section);
      const rightBars = $$(".diff-right-lines .dr", section);

      gsap.set([...leftTexts, ...rightTexts], { opacity: 0, x: -8 });
      gsap.set([...leftBars, ...rightBars], { scaleX: 0, transformOrigin: "0% 50%" });

      const tl = gsap.timeline({ paused: true });
      tl.to(leftTexts, {
        opacity: 1,
        x: 0,
        duration: 0.3,
        stagger: 0.06,
        ease: "power2.out",
      })
        .to(
          rightTexts,
          {
            opacity: 1,
            x: 0,
            duration: 0.3,
            stagger: 0.06,
            ease: "power2.out",
          },
          "-=0.5"
        )
        .to(
          leftBars,
          {
            opacity: 0.55,
            scaleX: 1,
            duration: 0.35,
            stagger: 0.1,
            ease: "power2.out",
          },
          "+=0.1"
        )
        .to(
          rightBars,
          {
            opacity: 0.55,
            scaleX: 1,
            duration: 0.35,
            stagger: 0.1,
            ease: "power2.out",
          },
          "<"
        )
        .to(
          $(".diff-pointer", section),
          { opacity: 1, duration: 0.3 },
          "-=0.1"
        );
      return tl;
    },

    /* ---------------- 07 Merge ---------------- */
    merge(section) {
      const mainCommits = $$(".mc", section);
      const featureCommits = $$(".fc", section);
      const rail = $(".merge-feature-rail", section);

      gsap.set([...mainCommits, ...featureCommits], {
        scale: 0,
        opacity: 0,
        transformOrigin: "50% 50%",
      });

      rail.setAttribute("pathLength", "100");
      gsap.set(rail, { strokeDasharray: 100, strokeDashoffset: 100 });

      const tl = gsap.timeline({ paused: true });
      tl.to(mainCommits, {
        scale: 1,
        opacity: 1,
        duration: 0.35,
        stagger: 0.2,
        ease: "back.out(1.6)",
      })
        .to(rail, {
          strokeDashoffset: 60,
          duration: 0.55,
          ease: "power2.inOut",
        })
        .to(featureCommits, {
          scale: 1,
          opacity: 1,
          duration: 0.35,
          stagger: 0.2,
          ease: "back.out(1.6)",
        })
        .to(rail, {
          strokeDashoffset: 0,
          duration: 0.55,
          ease: "power2.inOut",
        })
        .fromTo(
          $(".merge-commit", section),
          { opacity: 0, scale: 0, transformOrigin: "520px 220px" },
          {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            ease: "back.out(1.8)",
          }
        );
      return tl;
    },

    /* ---------------- 08 Rebase ---------------- */
    rebase(section) {
      const old = $(".rebase-old", section);
      const rail = $(".rebase-new-rail", section);
      const newCommits = $$(".rebase-new circle", section);
      const label = $(".rebase-label", section);

      gsap.set(newCommits, { opacity: 0, scale: 0, transformOrigin: "50% 50%" });
      const railLen = 240;
      gsap.set(rail, {
        strokeDasharray: railLen,
        strokeDashoffset: railLen,
        opacity: 1,
      });

      const tl = gsap.timeline({ paused: true });
      tl.from(old, { opacity: 0, duration: 0.5 })
        .to({}, { duration: 0.4 })
        .to(old, { opacity: 0.25, duration: 0.5 })
        .to(rail, {
          strokeDashoffset: 0,
          duration: 0.6,
          ease: "power2.inOut",
        })
        .to(newCommits, {
          opacity: 1,
          scale: 1,
          duration: 0.4,
          stagger: 0.2,
          ease: "back.out(1.7)",
        })
        .to(label, { opacity: 1, duration: 0.3 }, "-=0.1");
      return tl;
    },

    /* ---------------- 09 Merge conflict ---------------- */
    conflict(section) {
      const left = $(".conf-leftline", section);
      const right = $(".conf-rightline", section);
      const leftLen = 320;
      const rightLen = 320;
      gsap.set(left, { strokeDasharray: leftLen, strokeDashoffset: leftLen });
      gsap.set(right, { strokeDasharray: rightLen, strokeDashoffset: rightLen });

      const tl = gsap.timeline({ paused: true });
      tl.to([left, right], {
        strokeDashoffset: 0,
        duration: 0.7,
        ease: "power2.inOut",
      })
        .fromTo(
          $(".conf-spark", section),
          { opacity: 0, scale: 0, transformOrigin: "300px 180px" },
          {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            ease: "back.out(2)",
          }
        )
        .to($(".conf-spark", section), {
          rotation: 18,
          transformOrigin: "300px 180px",
          duration: 0.18,
          yoyo: true,
          repeat: 3,
        })
        .fromTo(
          $(".conf-box", section),
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" }
        )
        .to(
          $(".conf-strike", section),
          { opacity: 1, duration: 0.3 },
          "+=0.3"
        )
        .to($(".conf-final", section), { opacity: 1, duration: 0.4 }, "+=0.1")
        .to(
          $(".conf-final-sub", section),
          { opacity: 0.8, duration: 0.4 },
          "-=0.2"
        );
      return tl;
    },

    /* ---------------- 10 Pull Request ---------------- */
    pr(section) {
      const card = $(".pr-card", section);
      const checks = $$(".pr-check", section);
      const btn = $(".pr-merge-btn", section);

      gsap.set(checks, { opacity: 0, x: -16 });
      gsap.set(btn, { opacity: 0, y: 14 });

      const tl = gsap.timeline({ paused: true });
      tl.fromTo(
        card,
        { opacity: 0, scale: 0.96, transformOrigin: "50% 50%" },
        { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.4)" }
      )
        .to(checks, {
          opacity: 1,
          x: 0,
          duration: 0.35,
          stagger: 0.35,
          ease: "power2.out",
        })
        .to(btn, { opacity: 1, y: 0, duration: 0.4, ease: "back.out(1.6)" })
        .to(
          btn,
          {
            scale: 1.04,
            transformOrigin: "420px 283px",
            duration: 0.4,
            yoyo: true,
            repeat: 1,
            ease: "power1.inOut",
          }
        );
      return tl;
    },

    /* ---------------- 11 Issue ---------------- */
    issue(section) {
      const card = $(".issue-card", section);
      const labels = $$(".issue-label", section);
      const assignee = $(".issue-assignee", section);
      const comments = $(".issue-comments", section);

      gsap.set(labels, { opacity: 0, y: 10 });
      gsap.set(assignee, { opacity: 0, x: -10 });
      gsap.set(comments, { opacity: 0, y: 16 });

      const tl = gsap.timeline({ paused: true });
      tl.fromTo(
        card,
        { opacity: 0, scale: 0.95, transformOrigin: "50% 50%" },
        { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.4)" }
      )
        .to(labels, {
          opacity: 1,
          y: 0,
          duration: 0.35,
          stagger: 0.15,
          ease: "back.out(1.7)",
        })
        .to(assignee, {
          opacity: 1,
          x: 0,
          duration: 0.4,
          ease: "power2.out",
        })
        .to(comments, {
          opacity: 1,
          y: 0,
          duration: 0.45,
          ease: "power2.out",
        });
      return tl;
    },
  };

  /* ---------- bind every section ---------- */
  const timelines = new Map();

  $$("[data-anim]").forEach((section) => {
    const key = section.dataset.anim;
    const build = builders[key];
    if (!build) return;

    let tl;
    try {
      tl = build(section);
    } catch (err) {
      console.error(`Failed to build animation for "${key}"`, err);
      return;
    }
    timelines.set(key, tl);

    if (prefersReducedMotion) {
      // Snap to final state without animating
      tl.progress(1).pause();
      return;
    }

    ScrollTrigger.create({
      trigger: section,
      start: "top 70%",
      onEnter: () => tl.play(0),
      onEnterBack: () => tl.play(0),
    });
  });

  /* ---------- replay buttons ---------- */
  $$(".replay").forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.target;
      const tl = timelines.get(key);
      if (tl) tl.restart();
    });
  });
})();
