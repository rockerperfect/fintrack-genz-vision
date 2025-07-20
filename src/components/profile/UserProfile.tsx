/**
 * UserProfile.tsx
 *
 * Displays user profile information and settings.
 * - Shows avatar, name, email, and editable profile fields.
 * - Responsive and accessible design.
 *
 * Dependencies:
 * - React
 * - UI primitives: Card, Avatar
 *
 * TODO: Add authentication, backend integration, and settings management.
 */
import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const mockUser = {
  name: "Alex GenZ",
  email: "alex.genz@example.com",
  avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg"
}

const LOCAL_KEY = 'userProfile'
function getLocalProfile() {
  return JSON.parse(localStorage.getItem(LOCAL_KEY) || 'null') || mockUser
}

export function UserProfile() {
  const [profile, setProfile] = React.useState(getLocalProfile())
  const [editing, setEditing] = React.useState(false)
  const [form, setForm] = React.useState(profile)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSave() {
    setProfile(form)
    localStorage.setItem(LOCAL_KEY, JSON.stringify(form))
    setEditing(false)
  }

  return (
    <Card className="mt-6 max-w-md mx-auto">
      <CardHeader>
        <CardTitle>User Profile</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <img
          src={profile.avatarUrl}
          alt="User Avatar"
          className="w-20 h-20 rounded-full border"
        />
        {editing ? (
          <>
            <input
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              className="input input-bordered text-lg font-semibold"
            />
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="input input-bordered text-sm text-muted-foreground"
            />
            <input
              name="avatarUrl"
              type="text"
              value={form.avatarUrl}
              onChange={handleChange}
              className="input input-bordered"
            />
            <button className="mt-4 px-4 py-2 bg-primary text-white rounded-lg" onClick={handleSave}>Save</button>
          </>
        ) : (
          <>
            <div className="text-lg font-semibold">{profile.name}</div>
            <div className="text-sm text-muted-foreground">{profile.email}</div>
            <button className="mt-4 px-4 py-2 bg-primary text-white rounded-lg" onClick={() => setEditing(true)}>Edit Profile</button>
          </>
        )}
      </CardContent>
    </Card>
  )
}
