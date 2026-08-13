"use client"

import { useEffect, useState } from "react"
import { FileText, Save, Loader2 } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { getSession } from "@/app/action/auth"

const API = process.env.NEXT_PUBLIC_API_URL

type SiteSettings = {
  resumeLink: string
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>({ resumeLink: "" })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState<{ type: "ok" | "err"; msg: string } | null>(null)

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch(`${API}/settings`, { cache: "no-store" })
        const data = await res.json()
        if (data?.data) {
          setSettings({ resumeLink: data.data.resumeLink || "" })
        }
      } catch {
        setStatus({ type: "err", msg: "Could not load site settings." })
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
      const res = await fetch(`${API}/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(session?.token ? { Authorization: `${session.token}` } : {}),
        },
        credentials: "include",
        body: JSON.stringify(settings),
      })
      if (!res.ok) throw new Error("save failed")
      setStatus({ type: "ok", msg: "Saved! The hero section's Resume button is updated." })
    } catch {
      setStatus({ type: "err", msg: "Failed to save. Are you logged in as admin, and is the link a valid URL?" })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-green-700">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading settings…
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-700">
          <FileText className="h-6 w-6" />
        </span>
        <div>
          <h1 className="text-2xl font-bold text-green-900">Site Settings</h1>
          <p className="text-sm text-green-600">Control site-wide details shown on your public portfolio.</p>
        </div>
      </div>

      {/* Resume link */}
      <div className="space-y-2">
        <label className="block font-medium text-green-900">Resume link</label>
        <input
          value={settings.resumeLink}
          onChange={(e) => setSettings((s) => ({ ...s, resumeLink: e.target.value }))}
          placeholder="https://drive.google.com/file/d/…/view"
          className="w-full rounded-lg border border-green-200 bg-white px-3 py-2 text-green-900 outline-none focus:border-green-500"
        />
        <p className="text-xs text-green-600">
          Shown as the &quot;Resume&quot; button on the hero section of your public portfolio. Leave blank to hide the button.
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
    </div>
  )
}
