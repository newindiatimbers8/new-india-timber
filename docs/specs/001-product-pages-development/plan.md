
# Implementation Plan: Product Pages Development

**Branch**: `001-product-pages-development` | **Date**: 2025-01-27 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-product-pages-development/spec.md`

## Execution Flow (/plan command scope)
```
1. Load feature spec from Input path
   → If not found: ERROR "No feature spec at {path}"
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Detect Project Type from context (web=frontend+backend, mobile=app+api)
   → Set Structure Decision based on project type
3. Fill the Constitution Check section based on the content of the constitution document.
4. Evaluate Constitution Check section below
   → If violations exist: Document in Complexity Tracking
   → If no justification possible: ERROR "Simplify approach first"
   → Update Progress Tracking: Initial Constitution Check
5. Execute Phase 0 → research.md
   → If NEEDS CLARIFICATION remain: ERROR "Resolve unknowns"
6. Execute Phase 1 → contracts, data-model.md, quickstart.md, agent-specific template file (e.g., `CLAUDE.md` for Claude Code, `.github/copilot-instructions.md` for GitHub Copilot, `GEMINI.md` for Gemini CLI, `QWEN.md` for Qwen Code or `AGENTS.md` for opencode).
7. Re-evaluate Constitution Check section
   → If new violations: Refactor design, return to Phase 1
   → Update Progress Tracking: Post-Design Constitution Check
8. Plan Phase 2 → Describe task generation approach (DO NOT create tasks.md)
9. STOP - Ready for /tasks command
```

**IMPORTANT**: The /plan command STOPS at step 7. Phases 2-4 are executed by other commands:
- Phase 2: /tasks command creates tasks.md
- Phase 3-4: Implementation execution (manual or via tools)

## Summary
Develop comprehensive product pages for 6 premium timber products (Red Sal, Australia Honne, Red Meranti Sal, Mahogany, Benin Teak, Tanzania Teak) with detailed specifications, high-quality images, and SEO optimization. Implement responsive design with mobile-first approach, performance optimization, and accessibility compliance.

## Technical Context
**Language/Version**: TypeScript 5.x, React 18.x, Vite 5.x  
**Primary Dependencies**: React Router, Tailwind CSS, Lucide React, React Hook Form  
**Storage**: JSON files (products.json), static image assets  
**Testing**: Vitest, React Testing Library, Playwright  
**Target Platform**: Web browsers (mobile-first responsive design)  
**Project Type**: web (frontend-only e-commerce application)  
**Performance Goals**: <3s page load on 3G, 90+ Lighthouse performance score, <1s image load  
**Constraints**: Mobile-first design, WCAG 2.1 AA compliance, SEO optimization required  
**Scale/Scope**: 6 product pages, 5-8 images per product, comprehensive SEO content

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Initial Check**: PASS - No constitutional violations detected
- Single project structure (web frontend)
- Standard React/TypeScript stack
- Clear performance and accessibility requirements
- No complex architectural decisions required

**Post-Design Check**: TBD - Will re-evaluate after Phase 1 design

## Project Structure

### Documentation (this feature)
```
specs/[###-feature]/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)
```
# Current structure (web frontend application)
src/
├── components/
│   ├── products/
│   ├── seo/
│   └── ui/
├── pages/
│   └── ProductDetailPage.tsx
├── data/
│   └── products.json
├── types/
└── utils/

public/
├── images/
│   └── products/
└── data/
    └── products.json

tests/
├── components/
└── pages/
```

**Structure Decision**: Option 2 (Web application) - Frontend-only e-commerce application

## Phase 0: Outline & Research
1. **Extract unknowns from Technical Context** above:
   - For each NEEDS CLARIFICATION → research task
   - For each dependency → best practices task
   - For each integration → patterns task

2. **Generate and dispatch research agents**:
   ```
   For each unknown in Technical Context:
     Task: "Research {unknown} for {feature context}"
   For each technology choice:
     Task: "Find best practices for {tech} in {domain}"
   ```

3. **Consolidate findings** in `research.md` using format:
   - Decision: [what was chosen]
   - Rationale: [why chosen]
   - Alternatives considered: [what else evaluated]

**Output**: research.md with all NEEDS CLARIFICATION resolved

## Phase 1: Design & Contracts
*Prerequisites: research.md complete*

1. **Extract entities from feature spec** → `data-model.md`:
   - Entity name, fields, relationships
   - Validation rules from requirements
   - State transitions if applicable

2. **Generate API contracts** from functional requirements:
   - For each user action → endpoint
   - Use standard REST/GraphQL patterns
   - Output OpenAPI/GraphQL schema to `/contracts/`

3. **Generate contract tests** from contracts:
   - One test file per endpoint
   - Assert request/response schemas
   - Tests must fail (no implementation yet)

4. **Extract test scenarios** from user stories:
   - Each story → integration test scenario
   - Quickstart test = story validation steps

5. **Update agent file incrementally** (O(1) operation):
   - Run `.specify/scripts/bash/update-agent-context.sh windsurf`
     **IMPORTANT**: Execute it exactly as specified above. Do not add or remove any arguments.
   - If exists: Add only NEW tech from current plan
   - Preserve manual additions between markers
   - Update recent changes (keep last 3)
   - Keep under 150 lines for token efficiency
   - Output to repository root

**Output**: data-model.md, /contracts/*, failing tests, quickstart.md, agent-specific file

## Phase 2: Task Planning Approach
*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy**:
- Load `.specify/templates/tasks-template.md` as base
- Generate tasks from Phase 1 design docs (contracts, data model, quickstart)
- Each product → data enhancement task [P]
- Each component → component development task [P]
- Each SEO requirement → SEO implementation task [P]
- Each performance goal → optimization task
- Integration tests for user stories
- Validation and testing tasks

**Ordering Strategy**:
- Data first: Enhance products.json and types
- Components second: Build reusable product components
- SEO third: Implement meta tags and structured data
- Performance fourth: Optimize images and loading
- Testing throughout: Unit, integration, and e2e tests
- Mark [P] for parallel execution (independent files)

**Estimated Output**: 30-35 numbered, ordered tasks in tasks.md covering:
- Data model enhancement (6 product data tasks)
- Component development (8-10 component tasks)
- SEO implementation (6 SEO optimization tasks)
- Performance optimization (4-5 optimization tasks)
- Testing and validation (8-10 testing tasks)

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation
*These phases are beyond the scope of the /plan command*

**Phase 3**: Task execution (/tasks command creates tasks.md)  
**Phase 4**: Implementation (execute tasks.md following constitutional principles)  
**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)

## Complexity Tracking
*Fill ONLY if Constitution Check has violations that must be justified*

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |


## Progress Tracking
*This checklist is updated during execution flow*

**Phase Status**:
- [x] Phase 0: Research complete (/plan command)
- [x] Phase 1: Design complete (/plan command)
- [x] Phase 2: Task planning complete (/plan command - describe approach only)
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved
- [x] Complexity deviations documented

---
*Based on Constitution v2.1.1 - See `/memory/constitution.md`*
