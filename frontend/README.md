# Frontend Architecture

This app uses a Feature-Based Modular Architecture with layered design and Repository pattern.

## Structure
- `src/app` – App shell and routing
- `src/shared` – Cross-cutting concerns (config, http client, utilities)
- `src/features/<feature>/domain` – Entities and repository interfaces
- `src/features/<feature>/infra` – Repository implementations (HTTP)
- `src/features/<feature>/application` – Use-cases / orchestrations
- `src/features/<feature>/ui` – React components

## Example Features
- Projects: lists public projects via `ProjectRepository`
- Resume: shows active resume via `ResumeRepository`
