// ─── Personal Information ──────────────────────────────────────────────────────
export interface PersonalInfo {
  fullName: string;
  jobTitle: string;
  dob: string;
  gender: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  avatar: string | null;
}

// ─── Section Item Types ────────────────────────────────────────────────────────
export interface EducationItem {
  id: string;
  startDate: string;
  endDate: string;
  school: string;
  major: string;
  description: string;
}

export interface ExperienceItem {
  id: string;
  startDate: string;
  endDate: string;
  company: string;
  position: string;
  description: string;
}

export interface ActivityItem {
  id: string;
  startDate: string;
  endDate: string;
  organization: string;
  role: string;
  description: string;
}

export interface CertificateItem {
  id: string;
  date: string;
  name: string;
}

export interface AwardItem {
  id: string;
  date: string;
  name: string;
}

export interface SkillItem {
  id: string;
  name: string;
  description: string;
}

// ─── Section Types (discriminated union) ──────────────────────────────────────
export type SectionType =
  | "career-goal"
  | "education"
  | "experience"
  | "activity"
  | "certificate"
  | "award"
  | "skill";

export interface CareerGoalSection {
  id: string;
  type: "career-goal";
  title: string;
  visible: boolean;
  content: string;
}

export interface EducationSection {
  id: string;
  type: "education";
  title: string;
  visible: boolean;
  items: EducationItem[];
}

export interface ExperienceSection {
  id: string;
  type: "experience";
  title: string;
  visible: boolean;
  items: ExperienceItem[];
}

export interface ActivitySection {
  id: string;
  type: "activity";
  title: string;
  visible: boolean;
  items: ActivityItem[];
}

export interface CertificateSection {
  id: string;
  type: "certificate";
  title: string;
  visible: boolean;
  items: CertificateItem[];
}

export interface AwardSection {
  id: string;
  type: "award";
  title: string;
  visible: boolean;
  items: AwardItem[];
}

export interface SkillSection {
  id: string;
  type: "skill";
  title: string;
  visible: boolean;
  items: SkillItem[];
}

export type CVSection =
  | CareerGoalSection
  | EducationSection
  | ExperienceSection
  | ActivitySection
  | CertificateSection
  | AwardSection
  | SkillSection;

// ─── Root CV Type ──────────────────────────────────────────────────────────────
export interface CVData {
  personal: PersonalInfo;
  sections: CVSection[];
}

// ─── Item templates for adding new items ──────────────────────────────────────
export const ITEM_TEMPLATES: Record<string, object> = {
  education: { startDate: "", endDate: "", school: "", major: "", description: "" } satisfies Omit<EducationItem, "id">,
  experience: { startDate: "", endDate: "", company: "", position: "", description: "" } satisfies Omit<ExperienceItem, "id">,
  activity: { startDate: "", endDate: "", organization: "", role: "", description: "" } satisfies Omit<ActivityItem, "id">,
  certificate: { date: "", name: "" } satisfies Omit<CertificateItem, "id">,
  award: { date: "", name: "" } satisfies Omit<AwardItem, "id">,
  skill: { name: "", description: "" } satisfies Omit<SkillItem, "id">,
};

// ─── Default CV ───────────────────────────────────────────────────────────────
export const DEFAULT_CV: CVData = {
  personal: {
    fullName: "Full Name",
    jobTitle: "Job Title",
    dob: "",
    gender: "",
    phone: "0123 456 789",
    email: "yourname@example.com",
    website: "linkedin.com/in/yourprofile",
    address: "District A, Ho Chi Minh City",
    avatar: null,
  },
  sections: [
    {
      id: "career-goal",
      type: "career-goal",
      title: "CAREER GOALS",
      visible: true,
      content:
        "Your career objective, including short-term and long-term professional goals.",
    },
    {
      id: "education",
      type: "education",
      title: "EDUCATION",
      visible: true,
      items: [
        {
          id: "edu-1",
          startDate: "Sep 2018",
          endDate: "Jun 2022",
          school: "University Name",
          major: "Major / Field of Study",
          description: "Describe your academic achievements, GPA, or notable activities.",
        },
      ],
    },
    {
      id: "experience",
      type: "experience",
      title: "WORK EXPERIENCE",
      visible: true,
      items: [
        {
          id: "exp-1",
          startDate: "Jan 2023",
          endDate: "Present",
          company: "Company Name",
          position: "Job Position",
          description: "Describe your responsibilities and key achievements in this role.",
        },
        {
          id: "exp-2",
          startDate: "Jun 2022",
          endDate: "Dec 2022",
          company: "Company Name",
          position: "Job Position",
          description: "Describe your responsibilities and key achievements in this role.",
        },
      ],
    },
    {
      id: "activity",
      type: "activity",
      title: "ACTIVITIES",
      visible: true,
      items: [
        {
          id: "act-1",
          startDate: "2020",
          endDate: "2022",
          organization: "Organization Name",
          role: "Your Role",
          description: "Describe your contributions and impact in this activity.",
        },
      ],
    },
    {
      id: "certificate",
      type: "certificate",
      title: "CERTIFICATIONS",
      visible: true,
      items: [
        { id: "cert-1", date: "2023", name: "Certificate Name" },
        { id: "cert-2", date: "2022", name: "Certificate Name" },
      ],
    },
    {
      id: "award",
      type: "award",
      title: "AWARDS & HONORS",
      visible: true,
      items: [{ id: "award-1", date: "2022", name: "Award Name" }],
    },
    {
      id: "skill",
      type: "skill",
      title: "SKILLS",
      visible: true,
      items: [
        { id: "skill-1", name: "Technical Skills", description: "React, TypeScript, Node.js, SQL" },
        { id: "skill-2", name: "Soft Skills", description: "Team leadership, Communication, Problem-solving" },
      ],
    },
  ],
};