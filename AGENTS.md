
- Agent MCP server lives in src/lib/mcp (one tool per file, public read-only tools using anon client); generated supabase/functions/mcp is SDK-owned — never hand-edit. Why: MCP function is bundled by mcpPlugin and deployed on publish.
