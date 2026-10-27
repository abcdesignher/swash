# Prompt Log: JSON to CSS Variables

## Prompt Used
The prompt I used to instruct the AI agent (verbatim).
👇

> # Task: Convert the Complete Design Tokens to CSS Variables
>
> Read `06-tokens-complete.json` and convert its design tokens into CSS custom properties.
>
> ## Instructions
>
> 1. **Inspect the source first**
>    - Read `06-tokens-complete.json` and understand its structure, collections, variable names, values, and references.
>    - Identify the primitive colour collection and the existing colour roles in the reference collection.
>    - Inspect the project structure and identify the appropriate location for the CSS variables.
>    - Do not modify unrelated files or generate interface components as part of this task.
>
> 2. **Preserve the design system**
>    - Convert the exported design tokens into CSS custom properties.
>    - Preserve the original token values, names, and references wherever the JSON provides them.
>    - Preserve the distinction between primitive colours and the colour roles already assigned in the reference collection.
>    - Where a reference role points to a primitive colour, preserve that relationship using CSS custom-property references.
>    - Do not invent missing tokens or silently change values. If a token or reference cannot be converted reliably, document the issue and ask for clarification.
>
> 3. **Use the existing colour roles on the interface**
>    - **Use the colour roles already assigned in the reference collection**, such as Primary colour, On primary colour, and Inverse primary colour.
>    - Do not invent new roles or replace my existing role-assignment convention with another naming system.
>    - Primitive colours define the palette; reference roles define how those colours are used.
>    - Interface styling must use the existing reference roles wherever applicable, not primitive colours directly.
>    - For example, a primary button must use the CSS variable generated from my existing Primary colour role for its background and the variable generated from On primary colour for its text or icons.
>    - If a required role is missing, report it rather than bypassing the design system with a primitive colour or hardcoded value.
>
>    **The design system must remain the single source of truth.** Changes to primitive colours should flow through their assigned reference roles to the interface without requiring individual components to be edited.
>
> 4. **Organise the CSS variables**
>    - Place the variables in the appropriate global stylesheet, following the existing project structure.
>    - Group primitive colours, reference colour roles, typography, and shadows logically.
>    - Use clear CSS variable names that preserve the names and relationships from the exported tokens.
>    - Avoid unnecessary duplication or a competing source of truth.
>
> 5. **Verify the conversion**
>    - Check that all applicable tokens in `06-tokens-complete.json` have been accounted for.
>    - Confirm that reference roles point to the appropriate primitive variables.
>    - Search the interface code for hardcoded colours and direct primitive-colour usage. Save the search command and full output, even if empty, in `evidence/07-raw-value-search.txt`.
>    - Report unresolved references, unsupported tokens, and any interface styling that bypasses the existing roles.
>    - Do not claim verification is complete unless you have performed it.
>
> ## Deliverables
>
> - The CSS file containing the converted design tokens.
> - A brief mapping of the JSON tokens to CSS variable names.
> - Any unsupported, missing, or ambiguous tokens.
> - Verification results, including hardcoded colours and direct primitive-colour usage found in interface styling.
>
> ## Constraints
>
> - Do not redesign the system or invent a new palette.
> - Do not change my existing colour-role assignments or naming convention.
> - Do not use primitive colour variables directly in interface styling when an assigned reference role exists.
> - Keep `06-tokens-complete.json` as the source of truth for the exported values and relationships.
> - Do not modify unrelated files.
>
> First inspect the JSON and project structure. Explain your planned changes before editing files. If the token structure or references are ambiguous, stop and ask rather than guessing.

## Parts That Did Not Work
Nothing. The prompt worked.

## Changes Made to the Prompt
None.

## Outcome
CSS variables were created from `06-tokens-complete.json`.