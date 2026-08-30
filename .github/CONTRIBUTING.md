# Contributing to balajitechlab.com

Thank you for your interest in contributing to **balajitechlab.com**! 

## Code Standards & Guidelines

1. **Commit Messages**: Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:
   - `feat:` New features or enhancements
   - `fix:` Bug fixes
   - `refactor:` Code restructuring without functional changes
   - `perf:` Performance optimizations
   - `docs:` Documentation improvements
   - `chore:` Tooling, workflow, or dependency updates

2. **Clean Code & Human Craftsmanship**:
   - Write clean, self-documenting code.
   - Avoid noise comments that merely repeat what the code does.
   - Keep components modular, accessible, and performant.

3. **Development Workflow**:
   ```bash
   pnpm install
   pnpm dev
   ```

4. **Pre-Submission Verification**:
   Ensure all checks pass locally before opening a pull request:
   ```bash
   pnpm exec tsc --noEmit
   pnpm run lint
   pnpm run build
   ```

## Pull Request Process

1. Fork the repository and create your branch from `main`.
2. Ensure your code passes all type checks and linting rules.
3. Open a Pull Request with a clear summary of your changes.
