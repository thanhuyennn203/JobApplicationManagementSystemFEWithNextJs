"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  getCandidateProfileById,
  updateCandidate,
} from "@/services/candidate/candidate.service";
import { Candidate, CandidateUpdatePayload } from "@/types/candidate";
import "@/styles/candidate/ProfilePage.css";

const emptyForm: CandidateUpdatePayload = {
  first_name: "",
  last_name: "",
  headline: "",
  bio: "",
  phone: "",
  gender: "",
  dOB: "",
  profileUrl: "",
};

const toDateInputValue = (value?: string) => {
  if (!value) return "";
  return value.includes("T") ? value.split("T")[0] : value;
};

export default function UserProfile() {
  const auth = useAuth();
  const candidateId = auth?.user?.candidateId;

  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [form, setForm] = useState<CandidateUpdatePayload>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const displayEmail = useMemo(
    () => candidate?.email || auth?.user?.email || "",
    [candidate?.email, auth?.user?.email]
  );

  const syncForm = (data: Candidate) => {
    setForm({
      first_name: data.first_name || "",
      last_name: data.last_name || "",
      headline: data.headline || "",
      bio: data.bio || "",
      phone: data.phone || "",
      gender: data.gender || "",
      dOB: toDateInputValue(data.dOB),
      profileUrl: data.profileUrl || "",
    });
  };

  useEffect(() => {
    const fetchCandidate = async () => {
      if (!candidateId) {
        setError("Candidate profile is missing candidateId");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");
        const data = await getCandidateProfileById(Number(candidateId));
        setCandidate(data);
        console.log(data);
        syncForm(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Cannot load profile");
      } finally {
        setLoading(false);
      }
    };

    if (!auth?.loading) {
      fetchCandidate();
    }
  }, [auth?.loading, candidateId]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    if (candidate) syncForm(candidate);
    setEditing(false);
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!candidateId) {
      setError("Candidate profile is missing candidateId");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");
      const updated = await updateCandidate(Number(candidateId), form);
      setCandidate(updated);
      syncForm(updated);
      setEditing(false);
      setSuccess("Profile updated successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (auth?.loading || loading) {
    return (
      <main className="profile-page">
        <div className="profile-shell">
          <p className="profile-state">Loading profile...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="profile-page">
      <div className="profile-shell">
        <section className="profile-summary">
          <img
            src={candidate?.profileUrl || "/images/default-avatar.jpg"}
            alt="Candidate avatar"
            className="profile-avatar"
          />
          <div>
            <h1>
              {[candidate?.first_name, candidate?.last_name]
                .filter(Boolean)
                .join(" ") || "Candidate Profile"}
            </h1>
            <p>{candidate?.headline || displayEmail}</p>
          </div>
          {!editing && (
            <button
              type="button"
              className="profile-edit-btn"
              onClick={() => setEditing(true)}
            >
              <i className="fa-solid fa-pen"></i>
              Edit profile
            </button>
          )}
        </section>

        {error && <div className="profile-alert profile-alert-error">{error}</div>}
        {success && (
          <div className="profile-alert profile-alert-success">{success}</div>
        )}

        <form className="profile-form" onSubmit={handleSubmit}>
          <div className="profile-grid">
            <label>
              <span>First name</span>
              <input
                name="first_name"
                value={form.first_name}
                onChange={handleChange}
                disabled={!editing || saving}
                placeholder="Your first name"
              />
            </label>

            <label>
              <span>Last name</span>
              <input
                name="last_name"
                value={form.last_name}
                onChange={handleChange}
                disabled={!editing || saving}
                placeholder="Your last name"
              />
            </label>

            <label>
              <span>Email</span>
              <input value={displayEmail} disabled />
            </label>

            <label>
              <span>Headline</span>
              <input
                name="headline"
                value={form.headline}
                onChange={handleChange}
                disabled={!editing || saving}
                placeholder="Your professional headline"
              />
            </label>

            <label>
              <span>Phone</span>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                disabled={!editing || saving}
                placeholder="Your phone number"
              />
            </label>

            <label>
              <span>Gender</span>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                disabled={!editing || saving}
              >
                <option value="">Not specified</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </label>

            <label>
              <span>Date of birth</span>
              <input
                type="date"
                name="dOB"
                value={form.dOB}
                onChange={handleChange}
                disabled={!editing || saving}
              />
            </label>

            <label className="profile-field-wide">
              <span>Profile URL</span>
              <input
                name="profileUrl"
                value={form.profileUrl}
                onChange={handleChange}
                disabled={!editing || saving}
                placeholder="https://..."
              />
            </label>

            <label className="profile-field-wide">
              <span>Bio</span>
              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                disabled={!editing || saving}
                placeholder="Tell employers about yourself"
                rows={5}
              />
            </label>
          </div>

          {editing && (
            <div className="profile-actions">
              <button type="button" onClick={handleCancel} disabled={saving}>
                Cancel
              </button>
              <button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save changes"}
              </button>
            </div>
          )}
        </form>
      </div>
    </main>
  );
}
