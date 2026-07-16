"use client"

import { useEffect, useState } from "react"
import { Bot, Save, Loader2 } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { getSession } from "@/app/action/auth"

const API = process.env.NEXT_PUBLIC_API_URL

type AiSettings = {
  context: string
  persona: string
  greeting: string
  isEnabled: boolean
}

export default function AiAssistantPage() {
  const [settings, setSettings] = useState<AiSettings>({
    context: "",
    persona: "",
    greeting: "",
    isEnabled: true,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState<{ type: "ok" | "err"; msg: string } | null>(null)

  useEffect(() => {
    ;(async () => {
      try {
        const session = await getSession()
        const res = await fetch(`${API}/ai/settings`, {
          headers: session?.token ? { Authorization: `${session.token}` } : undefined,
          credentials: "include",
          cache: "no-store",
        })
        const data = await res.json()
        if (data?.data) {
          setSettings({
            context: data.data.context || "",
            persona: data.data.persona || "",
            greeting: data.data.greeting || "",
            isEnabled: !!data.data.isEnabled,
          })
        }
      } catch {
        setStatus({ type: "err", msg: "Could not load AI settings." })
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const save = async () => {
    setSaving(true)
    setStatus(null)
    try {
      const session = await getSession()
      const res = await fetch(`${API}/ai/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(session?.token ? { Authorization: `${session.token}` } : {}),
        },
        credentials: "include",
        body: JSON.stringify(settings),
      })
      if (!res.ok) throw new Error("save failed")
      setStatus({ type: "ok", msg: "Saved! The chat assistant is updated." })
    } catch {
      setStatus({ type: "err", msg: "Failed to save. Are you logged in as admin?" })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-green-700">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading AI settings…
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-700">
          <Bot className="h-6 w-6" />
        </span>
        <div>
          <h1 className="text-2xl font-bold text-green-900">AI Assistant</h1>
          <p className="text-sm text-green-600">
            Teach the chat assistant about you. It answers visitors using only what you write here.
          </p>
        </div>
      </div>

      {/* Enabled toggle */}
      <label className="flex cursor-pointer items-center justify-between rounded-xl border border-green-200 bg-white p-4">
        <span>
          <span className="block font-medium text-green-900">Enable the chat assistant</span>
          <span className="block text-sm text-green-600">
            When off, the widget tells visitors to use the contact page.
          </span>
        </span>
        <input
          type="checkbox"
          checked={settings.isEnabled}
          onChange={(e) => setSettings((s) => ({ ...s, isEnabled: e.target.checked }))}
          className="h-5 w-9 accent-green-600"
        />
      </label>

      {/* Greeting */}
      <div className="space-y-2">
        <label className="block font-medium text-green-900">Greeting message</label>
        <input
          value={settings.greeting}
          onChange={(e) => setSettings((s) => ({ ...s, greeting: e.target.value }))}
          placeholder="Hi! Ask me anything about Amdadul."
          className="w-full rounded-lg border border-green-200 bg-white px-3 py-2 text-green-900 outline-none focus:border-green-500"
        />
        <p className="text-xs text-green-600">The first message visitors see when they open the chat.</p>
      </div>

      {/* Persona (optional) */}
      <div className="space-y-2">
        <label className="block font-medium text-green-900">
          Persona / tone <span className="text-green-500">(optional)</span>
        </label>
        <textarea
          value={settings.persona}
          onChange={(e) => setSettings((s) => ({ ...s, persona: e.target.value }))}
          rows={3}
          placeholder="Leave blank for the default friendly assistant, or set a custom tone/instructions."
          className="w-full resize-y rounded-lg border border-green-200 bg-white px-3 py-2 text-green-900 outline-none focus:border-green-500"
        />
      </div>

      {/* Context — the knowledge base */}
      <div className="space-y-2">
        <label className="block font-medium text-green-900">Context about you (the AI's knowledge)</label>
        <textarea
          value={settings.context}
          onChange={(e) => setSettings((s) => ({ ...s, context: e.target.value }))}
          rows={14}
          placeholder={
            "Write everything the AI should know:\n" +
            "• Who you are, your role, and a short bio\n" +
            "• Skills & tech stack (frontend, backend, DevOps, design)\n" +
            "• Notable projects (name, what it does, tech used, links)\n" +
            "• Experience & education\n" +
            "• Availability, rates, and how you like to be contacted"
          }
          className="w-full resize-y rounded-lg border border-green-200 bg-white px-3 py-2 font-mono text-sm leading-relaxed text-green-900 outline-none focus:border-green-500"
        />
        <p className="text-xs text-green-600">
          {settings.context.length} characters. The more detail, the better the answers.
        </p>
      </div>

      {/* Save */}
      <div className="flex items-center gap-4">
        <Button onClick={save} disabled={saving} className="bg-green-600 text-white hover:bg-green-700">
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          {saving ? "Saving…" : "Save changes"}
        </Button>
        {status && (
          <span className={status.type === "ok" ? "text-sm text-green-700" : "text-sm text-red-600"}>
            {status.msg}
          </span>
        )}
      </div>

      <p className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
        💡 The AI replies live on your portfolio site. It also forwards &quot;contact me&quot; messages to your
        Telegram — set a free <code>GEMINI_API_KEY</code> (from aistudio.google.com) and the Telegram vars in the
        backend <code>.env</code> to turn it on.
      </p>
    </div>
  )
}
