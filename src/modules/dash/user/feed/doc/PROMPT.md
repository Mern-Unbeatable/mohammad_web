# Feed Module — Deep Architecture Audit & Production-Grade Improvement

Act as a Senior Frontend Engineer and Software Architect. Perform a comprehensive code-level audit of the existing Feed module, covering both its architecture and implementation. Then implement safe, evidence-based improvements where necessary.

## 1. Investigation First — No Blind Refactoring

Before changing any code:

- Inspect the entire Feed module, its imports, exports, hooks, components, utilities, constants, tests, and related API integrations.
- Trace how the feed works from data fetching to rendering and user interactions.
- Identify every external consumer of shared components, including profiles, supplier advertisements, and the activity tab.
- Inspect relevant Redux slices, API services, backend endpoints, data models, and authorization rules whenever they affect Feed behavior.
- Review the existing Git changes and avoid overwriting unrelated user modifications.
- Establish the current baseline by running the available lint, type-check, test, and build commands.

Do not assume the existing architecture is correct simply because the files are organized or existing tests pass.

## 2. Audit the Architecture

Evaluate the following areas:

### Component architecture

- Single Responsibility Principle and component cohesion.
- Component size and unnecessary nesting.
- Reusability without excessive abstraction or prop drilling.
- Separation between UI rendering, state management, API communication, and business logic.
- Public component props and callback contracts.

### Hooks and state management

- Validate state ownership and avoid unnecessary duplicated state.
- Review hook dependencies, stale closures, cleanup, and lifecycle behavior.
- Inspect state updates during render, especially in `usePostEngagement`.
- Check whether state resets correctly when post IDs, props, or modal visibility change.
- Review optimistic updates, rollback logic, concurrent requests, and server-response reconciliation.
- Prevent one post's state from leaking into another post's component instance.
- Verify that failed actions preserve user input when appropriate.

### API and data flow

- Trace feed fetching, filtering, pagination, refreshing, and load-more behavior.
- Check request cancellation, duplicate requests, race conditions, and stale responses.
- Ensure API calls and error handling follow the project's existing conventions.
- Keep network communication separate from pure utility functions.
- Check pagination consistency when posts are created, deleted, edited, or reposted.

### Comments and interactions

- Validate nested comment and reply operations.
- Verify comment tree updates, root comment identification, preview selection, and deletion.
- Check add, edit, delete, like, reply, mention, and expanded-thread behavior.
- Verify reaction mapping, counts, and optimistic rollback.
- Check repost creation, undo repost, copied links, and reporting flows.
- Confirm permissions are enforced by the backend, not merely hidden in the frontend.

### Performance and accessibility

- Identify unnecessary rerenders, unstable props, expensive calculations, and redundant network requests.
- Use memoization only when profiling or code inspection justifies it.
- Review list rendering keys and component remounting.
- Check image rendering, attachment handling, and large comment threads.
- Verify keyboard navigation, focus management, modal behavior, accessible names, and loading/error feedback.

## 3. Enforce Clear Module Boundaries

Review and refine the current structure without introducing unnecessary layers.

- `components/`: presentation and UI-level interaction.
- `hooks/`: React state, UI-related orchestration, and lifecycle-dependent logic.
- `utils/`: pure, independently testable functions.
- `constants.js`: shared static values and limits.
- `index.js`: the stable public API for external consumers.
- Existing API/service layers: server communication and shared request handling.

Rules:

- Components must not dispatch Redux thunks directly for Feed post/comment actions when the established architecture routes them through hooks.
- Avoid circular dependencies and unintended deep imports from outside the module.
- Preserve existing public exports and prop contracts unless a change is demonstrably necessary.
- If a public contract must change, update every consumer and its tests in the same change.
- Do not create abstractions, folders, hooks, or wrapper components without a clear architectural benefit.

## 4. Improve Test Coverage

Inspect existing tests and add focused tests for actual risks and uncovered behavior.

Prioritize:

- `utils/commentTree.js`
- `utils/reactions.js`
- `hooks/usePostEngagement`
- `hooks/usePostCommentActions`
- `hooks/usePostDraft`
- Repost creation and cancellation.
- Optimistic update success and failure paths.
- Concurrent interactions and stale responses.
- Comment creation, nested replies, editing, deletion, and permissions.
- Feed filtering, pagination, empty states, and load-more behavior.
- Shared components used by profiles, supplier ads, and activity.
- Modal lifecycle, focus management, and draft preservation.

Use the project's existing test framework and conventions. Mock external dependencies appropriately, but do not replace meaningful integration coverage with excessive mocking.

Do not claim that a scenario is tested unless an actual test covers it.

## 5. Security and Data Integrity

- Check authorization-sensitive actions against server-side enforcement.
- Validate assumptions around post ownership, comment ownership, reporting, and repost permissions.
- Check how user-generated content, mentions, URLs, attachments, and uploaded files are handled.
- Avoid introducing unsafe HTML rendering or trusting client-supplied ownership data.
- Never expose secrets, tokens, or sensitive backend information in logs or error messages.
- Do not weaken authentication, authorization, validation, or existing security controls.

Fix frontend issues within scope. Report backend vulnerabilities separately if fixing them would require unrelated or risky backend changes.

## 6. Refactoring Rules

- Fix verified problems, not hypothetical ones.
- Preserve the existing UI, design, routes, API contracts, and user-visible behavior unless a bug fix requires a change.
- Avoid unnecessary rewrites and large-scale architectural migrations.
- Keep changes incremental, maintainable, and consistent with the existing codebase.
- Add regression tests for every meaningful behavior change.
- Do not suppress lint rules or weaken TypeScript checks merely to achieve a clean build.
- Do not introduce dependencies without a clear need.
- Never report a successful command, test, or build unless it was actually executed and passed.

If the audit finds no meaningful problem in a particular area, leave it unchanged and explain why.

## 7. Validation

After implementation:

1. Run the relevant Feed tests.
2. Run the full available test suite.
3. Run lint and type checking.
4. Run the production build.
5. Inspect the final diff for accidental changes, regressions, debug code, and unrelated modifications.
6. Verify public exports and all known shared-component consumers.
7. Clearly distinguish automated verification from scenarios requiring manual browser or authenticated API testing.

If a command fails, investigate the cause. Distinguish pre-existing failures from regressions introduced by your changes. Do not hide unresolved failures.

## 8. Required Final Report

Create a readable Markdown report at:

`docs/audits/feed-module-audit.md`

Include these sections:

1. Executive summary.
2. Existing architecture and actual data flow.
3. Module structure and dependency boundaries.
4. Findings table with severity, affected files, evidence, impact, and recommended fix.
5. Changes implemented and the rationale for each.
6. Issues intentionally left unchanged and why.
7. Test coverage added and results.
8. Lint, type-check, build, and regression verification results.
9. Compatibility assessment for profiles, supplier ads, and activity.
10. Remaining risks and recommended next steps.

Use the following finding severities:

- **Critical:** exploitable security issue or severe data integrity risk.
- **High:** significant functional defect or architectural problem.
- **Medium:** maintainability, reliability, or performance concern with meaningful impact.
- **Low:** minor improvement or cleanup.

Support findings with actual code references, such as file paths and function names. Do not invent line numbers, test results, or problems.

## Definition of Done

The task is complete only when:

- The existing module has been inspected beyond its folder structure.
- Verified issues have been fixed where safe and within scope.
- Existing behavior and external component contracts remain compatible.
- Relevant tests and validation commands have been executed.
- The Markdown audit report has been created.
- Remaining unverified areas, failures, and risks are clearly disclosed.

Start with investigation and baseline verification. Then implement the smallest set of changes that materially improves correctness, maintainability, reliability, and performance. Do not stop after producing recommendations if safe, necessary fixes can be implemented.
