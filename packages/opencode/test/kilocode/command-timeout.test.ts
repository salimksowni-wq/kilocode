import { afterEach, describe, expect, test } from "bun:test"
import { Effect } from "effect"
import { Flag } from "@opencode-ai/core/flag/flag"
import { CrossSpawnSpawner } from "@opencode-ai/core/cross-spawn-spawner"
import { CommandTimeout } from "@/kilocode/command-timeout"
import { testEffect } from "../lib/effect"

const max = process.env.KILO_COMMAND_TIMEOUT_MAX_MS
const msg = process.env.KILO_COMMAND_TIMEOUT_MAX_MS_MESSAGE
const it = testEffect(CrossSpawnSpawner.defaultLayer)

afterEach(() => {
  if (max === undefined) delete process.env.KILO_COMMAND_TIMEOUT_MAX_MS
  else process.env.KILO_COMMAND_TIMEOUT_MAX_MS = max
  if (msg === undefined) delete process.env.KILO_COMMAND_TIMEOUT_MAX_MS_MESSAGE
  else process.env.KILO_COMMAND_TIMEOUT_MAX_MS_MESSAGE = msg
})

describe("CommandTimeout", () => {
  test("reads positive command caps dynamically", () => {
    delete process.env.KILO_COMMAND_TIMEOUT_MAX_MS
    expect(Flag.KILO_COMMAND_TIMEOUT_MAX_MS).toBeUndefined()

    process.env.KILO_COMMAND_TIMEOUT_MAX_MS = "0"
    expect(Flag.KILO_COMMAND_TIMEOUT_MAX_MS).toBeUndefined()

    process.env.KILO_COMMAND_TIMEOUT_MAX_MS = "-1"
    expect(Flag.KILO_COMMAND_TIMEOUT_MAX_MS).toBeUndefined()

    process.env.KILO_COMMAND_TIMEOUT_MAX_MS = "abc"
    expect(Flag.KILO_COMMAND_TIMEOUT_MAX_MS).toBeUndefined()

    process.env.KILO_COMMAND_TIMEOUT_MAX_MS = "250"
    expect(Flag.KILO_COMMAND_TIMEOUT_MAX_MS).toBe(250)
  })

  test("clamps deadlines and formats environment timeout notes", () => {
    process.env.KILO_COMMAND_TIMEOUT_MAX_MS = "250"
    process.env.KILO_COMMAND_TIMEOUT_MAX_MS_MESSAGE = "You're running in a sandbox with a fixed timeout."

    expect(CommandTimeout.clamp(500)).toEqual({ timeout: 250, capped: true })
    expect(CommandTimeout.clamp(250)).toEqual({ timeout: 250, capped: true })
    expect(CommandTimeout.clamp(200)).toEqual({ timeout: 200, capped: false })

    const limit = CommandTimeout.env()
    expect(limit).toEqual({ timeout: 250, capped: true })
    if (!limit) throw new Error("missing timeout cap")
    expect(CommandTimeout.note(limit, "shell tool terminated command")).toBe(
      "shell tool terminated command after exceeding environment timeout 250 ms. You're running in a sandbox with a fixed timeout.",
    )
  })

  it.live("preserves uncapped shell expansion output", () =>
    Effect.gen(function* () {
      const shell = Bun.which("bash")
      if (!shell) return
      delete process.env.KILO_COMMAND_TIMEOUT_MAX_MS

      const text = yield* CommandTimeout.text("[[ 1 -eq 1 ]] && printf configured", shell)
      expect(text).toBe("configured")
    }),
  )

  it.live("terminates capped shell expansion output", () =>
    Effect.gen(function* () {
      const shell = Bun.which("sh")
      if (!shell) return
      process.env.KILO_COMMAND_TIMEOUT_MAX_MS = "500"
      process.env.KILO_COMMAND_TIMEOUT_MAX_MS_MESSAGE = "You're running in a sandbox with a fixed timeout."

      const text = yield* CommandTimeout.text("printf before; sleep 30", shell)
      expect(text).toContain("before")
      expect(text).toContain("shell command terminated after exceeding environment timeout 500 ms.")
      expect(text).toContain("You're running in a sandbox with a fixed timeout.")
    }),
  )
})
