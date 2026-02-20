---
name: Troubleshooting Master
description: Master error handling patterns across languages including exceptions, Result types, error propagation, and graceful degradation to build resilient applications.
---

# Troubleshooting Master Skill

Build resilient applications with robust error handling strategies that gracefully handle failures and provide excellent debugging experiences.

## When to Use This Skill
- Implementing error handling in new features
- Designing error-resilient APIs
- Debugging production issues
- Improving application reliability
- Creating better error messages for users and developers
- Implementing retry and circuit breaker patterns
- Handling async/concurrent errors
- Building fault-tolerant distributed systems

## Core Concepts

### 1. Error Handling Philosophies
- **Exceptions**: Traditional try-catch, disrupts control flow. Use for unexpected errors, exceptional conditions.
- **Result Types**: Explicit success/failure, functional approach. Use for expected errors, validation failures.
- **Error Codes**: C-style, requires discipline.
- **Option/Maybe Types**: For nullable values.
- **Panics/Crashes**: Unrecoverable errors, programming bugs.

### 2. Error Categories
- **Recoverable Errors**: Network timeouts, Missing files, Invalid user input, API rate limits.
- **Unrecoverable Errors**: Out of memory, Stack overflow, Programming bugs (null pointer, etc.).

## Language-Specific Patterns

### Python Error Handling
- **Custom Exception Hierarchy**: Define base application errors.
- **Context Managers**: Use for resource cleanup (`with` statement).
- **Retry with Exponential Backoff**: Decorator pattern for transient failures.

### TypeScript/JavaScript Error Handling
- **Custom Error Classes**: Extend `Error` with status codes and details.
- **Result Type Pattern**: Use `{ ok: true; value: T } | { ok: false; error: E }` for explicit handling.
- **Async Error Handling**: Handle Promise rejections and async/await errors properly.

### Rust Error Handling
- **Result and Option Types**: Propagate errors with `?` operator.
- **Custom Error Enums**: Define strongly typed error variants.

### Go Error Handling
- **Explicit Error Returns**: Multiple return values `(value, error)`.
- **Sentinel Errors**: Predefined variables for comparison (`errors.Is`).
- **Error Wrapping**: Provide context with `fmt.Errorf("...: %w", err)`.

## Universal Patterns

### Pattern 1: Circuit Breaker
Prevent cascading failures in distributed systems by failing fast when a dependency is down.

### Pattern 2: Error Aggregation
Collect multiple errors (e.g., validation) instead of failing on the first one.

### Pattern 3: Graceful Degradation
Provide fallback functionality when primary services fail (e.g., cache fallback).

## Best Practices
1. **Fail Fast**: Validate input early.
2. **Preserve Context**: Include stack traces, metadata, timestamps.
3. **Meaningful Messages**: Explain what happened and how to fix it.
4. **Log Appropriately**: Differentiate between expected failures and system errors.
5. **Handle at Right Level**: Catch where you can handle; propagate otherwise.
6. **Clean Up Resources**: Always use finally/defer.
7. **Don't Swallow Errors**: Log or re-throw.
8. **Type-Safe Errors**: Use typed errors when possible.

## Common Pitfalls
- Catching too broadly (`except Exception`).
- Empty catch blocks.
- Logging and re-throwing (duplicate logs).
- Poor error messages "Error occurred".
- Returning error codes instead of exceptions/Results.
- Ignoring async errors (unhandled promise rejections).
