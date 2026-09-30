# Project basics

Use when a beginner confuses source files, Git/GitHub, local execution, deployment, or the live product.

## Minimal mental model

```
project files on a computer
        ↓
version history (Git)
        ↓
optional remote code host (for example GitHub)
        ↓
deployment/hosting
        ↓
live URL
```

These are different things.

## Explain only the distinction needed now

- **Project files:** the files that make the product.
- **Git:** version history and recovery.
- **GitHub:** one place Git repositories can live online.
- **Local:** running on the builder's machine.
- **Deployment:** putting the product on infrastructure that can serve it.
- **Live URL:** an address other people may be able to open.

A GitHub repository is not automatically the running product. A localhost URL is not normally usable by someone on another device.

Do not teach the full toolchain unless the user asks.
