---
title: "Performance & tuning"
description: "Measure a dacha game and tune the settings that matter."
---

Most performance work on a dacha game comes down to three things: how much the renderer is
asked to draw, how often the fixed step runs, and how much work each system does per
query. This page covers measuring before changing anything.

## What this page will cover

- Measuring with the built-in statistics meter
- The performance options and what each one costs
- Choosing a fixed update rate
- Capping frame rate, and when it helps
- Keeping actor queries cheap
- Reducing draw calls
- What interpolation costs
