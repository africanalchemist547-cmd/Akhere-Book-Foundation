import { useState, useEffect, useCallback } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import { ASSETS } from "../components/mockups/_shared";

// ─── DATA INTERFACES ──────────────────────────────────────────

export interface DbProjectImage {
  id: string;
  project_id: string;
  image_url: string;
  caption?: string | null;
  display_order: number;
  created_at?: string;
}

export interface DbProject {
  id: string;
  title: string;
  slug: string;
  status: "pending" | "in_progress" | "finished";
  short_description: string;
  full_description: string;
  location: string;
  start_date?: string | null;
  completion_date?: string | null;
  cover_image: string;
  youtube_url?: string | null;
  featured: boolean;
  display_order: number;
  project_images?: DbProjectImage[];
  created_at?: string;
  updated_at?: string;
}

export interface DbPost {
  id: string;
  title: string;
  slug: string;
  category: "projects" | "events" | "news_impact";
  excerpt: string;
  content: string;
  cover_image: string;
  gallery_images?: string[];
  youtube_url?: string | null;
  published_at: string;
  published: boolean;
  featured: boolean;
  project_id?: string | null;
  author: string;
  created_at?: string;
  updated_at?: string;
}

export interface DbTeamMember {
  id: string;
  name: string;
  slug: string;
  role: string;
  short_bio: string;
  full_story: string;
  image_url: string;
  featured: boolean;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface DbPartner {
  id: string;
  name: string;
  logo_url: string;
  website_url?: string | null;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface DbStatistic {
  id: string;
  metric_key: string;
  label: string;
  value: string;
  description?: string | null;
  display_order: number;
  updated_at?: string;
}

// ─── STATIC SEED FALLBACKS (Used ONLY on offline/network failure) ───

export const STATIC_SEED_PROJECTS: DbProject[] = [
  {
    id: "azu-ogbunike-library",
    title: "Azu-Ogbunike Community Library",
    slug: "azu-ogbunike-community-library",
    status: "finished",
    short_description: "A community library created to give children, students and community members greater access to books, learning resources and a place to read, research and study.",
    full_description: "ABF commissioned and completed the Azu-Ogbunike Community Library to serve as a functional, clean, and inspiring hub for study and literacy. The project transformed a local space into a structured environment filled with books, homework desks, research tables, and reference materials.\n\nABF ensures the library remains in excellent physical condition and is actively stocked with diverse reading books, textbooks, dictionaries, and novels. Field representatives verify that the space continues to be supervised, accessible, and functional for daily readers.",
    location: "Ogbunike, Anambra State",
    cover_image: ASSETS.library,
    youtube_url: null,
    featured: true,
    display_order: 1,
    project_images: [
      {
        id: "img-1",
        project_id: "azu-ogbunike-library",
        image_url: ASSETS.library,
        caption: "Main Reading Room & Study Tables",
        display_order: 1,
      },
      {
        id: "img-2",
        project_id: "azu-ogbunike-library",
        image_url: ASSETS.ig1,
        caption: "Library Bookshelf Collections",
        display_order: 2,
      },
      {
        id: "img-3",
        project_id: "azu-ogbunike-library",
        image_url: ASSETS.ig2,
        caption: "Students Reading & Homework Session",
        display_order: 3,
      }
    ]
  }
];

export const STATIC_SEED_POSTS: DbPost[] = [
  {
    id: "grace-story",
    title: "Sometimes Impact Begins Quietly: A Child, A Book, A New Possibility",
    slug: "a-child-a-book-a-new-possibility",
    category: "news_impact",
    excerpt: "Grace was a quiet junior secondary student who discovered the library. Through access to books, her curiosity grew, leading her to write her own stories.",
    content: "At Akhere Book Foundation, we believe that access to books is not just about reading—it is about intellectual curiosity and expanding horizons. The stories of individual growth that emerge from our community library projects are powerful evidence of this belief.\n\nGrace is a quiet junior secondary student who lives in the local community of Ogbunike. Before the Azu-Ogbunike Community Library was commissioned by ABF, she had very limited access to books beyond her basic school textbooks. The opening of the library provided a new, quiet, supervised space right in her neighborhood.\n\nGrace began visiting the library regularly after school. Page by page, she began exploring different sections, moving from simple children's storybooks to more advanced historical novels and reference books. The librarians noticed her quiet dedication as she spent hours absorbed in reading.\n\nThis consistent access unlocked something new. She began asking questions, discussing ideas, and writing down her thoughts. Eventually, this curiosity turned into creation: Grace started writing her own short, imaginative stories. A library did not just give her a space to read; it gave her a voice to write.",
    cover_image: ASSETS.ig13,
    gallery_images: [ASSETS.ig13, ASSETS.ig1, ASSETS.ig2],
    published_at: "2025-07-15T10:00:00Z",
    published: true,
    featured: true,
    author: "Akhere Book Foundation",
  },
  {
    id: "library-one-year-later",
    title: "One Year Later: The Library Is Still Growing",
    slug: "one-year-later",
    category: "projects",
    excerpt: "A year after the commissioning of the Azu-Ogbunike Community Library, the space remains in excellent physical condition, clean, and actively used by local students.",
    content: "One year ago, ABF commissioned its first major project: the Azu-Ogbunike Community Library. The goal was simple but ambitious: to build a lasting, functional community study space that would remain active and useful for years to come.\n\nToday, we are proud to report that the library is still fully functional, clean, and regularly used by students from multiple primary and secondary schools in the local government area. The desks are full, the shelves are supervised, and children are actively reading, preparing for WAEC/NECO exams, and doing homework.\n\nA key focus of ABF's operational strategy is optimization on the ground. We work closely with community representatives to ensure that books are well cared for, reference materials remain complete, and the space remains a safe, encouraging environment for all visitors.",
    cover_image: ASSETS.ig12,
    gallery_images: [ASSETS.ig12, ASSETS.library],
    published_at: "2025-08-01T10:00:00Z",
    published: true,
    featured: false,
    author: "Akhere Book Foundation",
  },
  {
    id: "when-schools-are-attacked-post",
    title: "When Schools Are Attacked, The Future Is Attacked Too",
    slug: "when-schools-are-attacked",
    category: "news_impact",
    excerpt: "Schools must remain safe zones. ABF stands in solidarity with teachers and children affected by attacks on educational institutions.",
    content: "Education is a fundamental right, and schools should be safe sanctuaries for growth, hope, and learning. When educational institutions are attacked, it is not just buildings that are damaged—the future of children and communities is attacked as well.\n\nABF stands in firm solidarity with every child, teacher, and family affected by attacks on schools. We believe that protecting access to learning requires protecting the safety of the spaces where learning happens.\n\nOur advocacy focus remains on raising awareness of school safety, supporting local educational resilience, and ensuring that children have safe, stable pathways to continue their reading and development without fear.",
    cover_image: ASSETS.schoolAttacks1,
    gallery_images: [ASSETS.schoolAttacks1, ASSETS.schoolAttacks2],
    published_at: "2025-06-10T10:00:00Z",
    published: true,
    featured: false,
    author: "Akhere Book Foundation",
  },
  {
    id: "we-need-story-books-post",
    title: "We Need Story Books: Expanding Our Collections",
    slug: "we-need-story-books",
    category: "news_impact",
    excerpt: "As reading habits grow, so does the demand for fresh content. We are seeking donations of children's storybooks and novels to stock our shelves.",
    content: "The success of the Azu-Ogbunike Library has created a wonderful challenge: our regular readers are consuming books faster than ever. Children who once had very little reading experience are now avid readers looking for new adventures and stories.\n\nTo keep this enthusiasm alive, ABF is launching a dedicated book collection effort focused on high-quality storybooks, children's literature, and local fiction. Fresh stories keep children returning to the library and help them continuously build their vocabulary and reading confidence.\n\nIf you have storybooks in good condition that you'd like to donate, please use our book donation modal to let us know. A small collection of books can open new worlds for dozens of children.",
    cover_image: ASSETS.ig7,
    gallery_images: [ASSETS.ig7, ASSETS.bookDrive],
    published_at: "2025-05-20T10:00:00Z",
    published: true,
    featured: false,
    author: "Akhere Book Foundation",
  }
];

export const STATIC_SEED_TEAM: DbTeamMember[] = [
  {
    id: "oluwatosin-aina",
    name: "Oluwatosin Aina",
    slug: "oluwatosin-aina",
    role: "ABF Team Member",
    short_bio: "A familiar presence in ABF's journey from the very beginning — part of the vision, part of the work happening today.",
    full_story: "Oluwatosin has been a key part of the Akhere Book Foundation journey since its initial planning stages. Believing that every child deserves a chance to discover their potential through reading, Oluwatosin has helped shape the foundation's vision of providing community-level access to books and learning spaces. By coordinating with local coordinators and tracking project progress, Oluwatosin works to make sure the foundation's plans translate into real, operational opportunities for children.",
    image_url: ASSETS.ig10,
    featured: true,
    display_order: 1,
  },
  {
    id: "jennifer-odimgbe-james",
    name: "Jennifer Odimgbe-James",
    slug: "jennifer-odimgbe-james",
    role: "ABF Team Member",
    short_bio: "One of the dedicated people behind ABF's everyday effort to make books and learning more accessible to children and communities.",
    full_story: "Jennifer plays an active role in the daily coordination and logistics of Akhere Book Foundation's programs. From sorting book donations to liaising with volunteers and community representatives, Jennifer works to keep ABF's reading spaces active and stocked. Jennifer believes that the simple presence of a storybook can spark a lifelong love for learning, and is committed to making sure those books reach the hands of children who need them.",
    image_url: ASSETS.ig5,
    featured: true,
    display_order: 2,
  }
];

export const STATIC_SEED_PARTNERS: DbPartner[] = [
  {
    id: "azu-ogbunike-partner",
    name: "Azu-Ogbunike Library Project",
    logo_url: "",
    website_url: null,
    display_order: 1,
  },
  {
    id: "st-thomas-partner",
    name: "St. Thomas Comprehensive Secondary School",
    logo_url: "",
    website_url: null,
    display_order: 2,
  }
];

export const STATIC_SEED_STATISTICS: DbStatistic[] = [
  {
    id: "stat-schools",
    metric_key: "schools_reached",
    label: "Schools / Communities Reached",
    value: "[XX+]",
    description: "figures to be confirmed",
    display_order: 1,
  },
  {
    id: "stat-books",
    metric_key: "books_available",
    label: "Books Made Available",
    value: "[XX+]",
    description: "figures to be confirmed",
    display_order: 2,
  },
  {
    id: "stat-people",
    metric_key: "people_reached",
    label: "Children & Community Members Reached",
    value: "[XX+]",
    description: "figures to be confirmed",
    display_order: 3,
  },
  {
    id: "stat-users",
    metric_key: "library_users",
    label: "Library Users",
    value: "[XX+]",
    description: "figures to be confirmed",
    display_order: 4,
  },
  {
    id: "stat-monthly-hours",
    metric_key: "monthly_hours",
    label: "Monthly Usage Hours",
    value: "[XX]",
    description: "figures to be confirmed",
    display_order: 5,
  },
];

// ─── CMS STATE INTERFACE ─────────────────────────────────────
export interface CmsState<T> {
  data: T[];
  loading: boolean;
  error: Error | null;
  isFallback: boolean;
  refetch: () => Promise<void>;
}

// ─── 1. PUBLIC PROJECTS HOOK ─────────────────────────────────
export function usePublicProjects(): CmsState<DbProject> {
  const [data, setData] = useState<DbProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isFallback, setIsFallback] = useState(false);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (!isSupabaseConfigured()) {
      setData(STATIC_SEED_PROJECTS);
      setIsFallback(true);
      setLoading(false);
      return;
    }

    try {
      const { data: rows, error: queryError } = await supabase
        .from("projects")
        .select("*, project_images(*)")
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (queryError) {
        // Fallback to basic query if project_images relation not present
        const { data: fallbackRows, error: fallbackError } = await supabase
          .from("projects")
          .select("*")
          .order("display_order", { ascending: true })
          .order("created_at", { ascending: false });

        if (fallbackError) {
          setData(STATIC_SEED_PROJECTS);
          setError(new Error(fallbackError.message));
          setIsFallback(true);
        } else {
          setData(fallbackRows || []);
          setIsFallback(false);
        }
      } else {
        setData(rows || []);
        setIsFallback(false);
      }
    } catch (err: any) {
      setData(STATIC_SEED_PROJECTS);
      setError(err instanceof Error ? err : new Error(String(err)));
      setIsFallback(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return { data, loading, error, isFallback, refetch: fetchProjects };
}

// ─── 2. PUBLIC POSTS HOOK (With Multiple Images Parsing) ─────

// Helper to extract embedded gallery from post content
export function parsePostGallery(post: DbPost): string[] {
  if (post.gallery_images && post.gallery_images.length > 0) {
    return post.gallery_images;
  }
  if (!post.content) return [post.cover_image].filter(Boolean);

  const match = post.content.match(/<!-- GALLERY:([\s\S]*?) -->/);
  if (match && match[1]) {
    try {
      const parsed = JSON.parse(match[1]);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch {
      // ignore parse errors
    }
  }
  return [post.cover_image].filter(Boolean);
}

// Helper to strip gallery marker from displayed text
export function stripGalleryMarker(content: string): string {
  if (!content) return "";
  return content.replace(/<!-- GALLERY:[\s\S]*? -->/, "").trim();
}

export function usePublicPosts(categoryFilter?: string): CmsState<DbPost> {
  const [data, setData] = useState<DbPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isFallback, setIsFallback] = useState(false);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (!isSupabaseConfigured()) {
      let filtered = STATIC_SEED_POSTS.filter((p) => p.published);
      if (categoryFilter && categoryFilter !== "ALL") {
        const catNormalized = categoryFilter.toLowerCase().replace(/[^a-z0-9]/g, "_");
        filtered = filtered.filter((p) => p.category.toLowerCase().includes(catNormalized) || catNormalized.includes(p.category.toLowerCase()));
      }
      setData(filtered);
      setIsFallback(true);
      setLoading(false);
      return;
    }

    try {
      let query = supabase
        .from("posts")
        .select("*")
        .eq("published", true)
        .order("published_at", { ascending: false });

      if (categoryFilter && categoryFilter !== "ALL") {
        const catMap: Record<string, string> = {
          "PROJECTS": "projects",
          "EVENTS": "events",
          "NEWS & IMPACT": "news_impact",
        };
        const mapped = catMap[categoryFilter] || categoryFilter.toLowerCase();
        query = query.eq("category", mapped);
      }

      const { data: rows, error: queryError } = await query;

      if (queryError) {
        let filtered = STATIC_SEED_POSTS.filter((p) => p.published);
        setData(filtered);
        setError(new Error(queryError.message));
        setIsFallback(true);
      } else {
        const processedRows: DbPost[] = (rows || []).map((row: DbPost) => ({
          ...row,
          gallery_images: parsePostGallery(row),
        }));
        setData(processedRows);
        setIsFallback(false);
      }
    } catch (err: any) {
      setData(STATIC_SEED_POSTS.filter((p) => p.published));
      setError(err instanceof Error ? err : new Error(String(err)));
      setIsFallback(true);
    } finally {
      setLoading(false);
    }
  }, [categoryFilter]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return { data, loading, error, isFallback, refetch: fetchPosts };
}

// ─── 3. PUBLIC TEAM HOOK ─────────────────────────────────────
export function usePublicTeam(): CmsState<DbTeamMember> {
  const [data, setData] = useState<DbTeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isFallback, setIsFallback] = useState(false);

  const fetchTeam = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (!isSupabaseConfigured()) {
      setData(STATIC_SEED_TEAM);
      setIsFallback(true);
      setLoading(false);
      return;
    }

    try {
      const { data: rows, error: queryError } = await supabase
        .from("team_members")
        .select("*")
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (queryError) {
        setData(STATIC_SEED_TEAM);
        setError(new Error(queryError.message));
        setIsFallback(true);
      } else {
        setData(rows || []);
        setIsFallback(false);
      }
    } catch (err: any) {
      setData(STATIC_SEED_TEAM);
      setError(err instanceof Error ? err : new Error(String(err)));
      setIsFallback(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTeam();
  }, [fetchTeam]);

  return { data, loading, error, isFallback, refetch: fetchTeam };
}

// ─── 4. PUBLIC PARTNERS HOOK ─────────────────────────────────
export function usePublicPartners(): CmsState<DbPartner> {
  const [data, setData] = useState<DbPartner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isFallback, setIsFallback] = useState(false);

  const fetchPartners = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (!isSupabaseConfigured()) {
      setData(STATIC_SEED_PARTNERS);
      setIsFallback(true);
      setLoading(false);
      return;
    }

    try {
      const { data: rows, error: queryError } = await supabase
        .from("partners")
        .select("*")
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (queryError) {
        setData(STATIC_SEED_PARTNERS);
        setError(new Error(queryError.message));
        setIsFallback(true);
      } else {
        setData(rows || []);
        setIsFallback(false);
      }
    } catch (err: any) {
      setData(STATIC_SEED_PARTNERS);
      setError(err instanceof Error ? err : new Error(String(err)));
      setIsFallback(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPartners();
  }, [fetchPartners]);

  return { data, loading, error, isFallback, refetch: fetchPartners };
}

// ─── 5. PUBLIC STATISTICS HOOK & SMART MATCHER ───────────────
export function usePublicStatistics(): CmsState<DbStatistic> {
  const [data, setData] = useState<DbStatistic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isFallback, setIsFallback] = useState(false);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (!isSupabaseConfigured()) {
      setData(STATIC_SEED_STATISTICS);
      setIsFallback(true);
      setLoading(false);
      return;
    }

    try {
      const { data: rows, error: queryError } = await supabase
        .from("library_statistics")
        .select("*")
        .order("display_order", { ascending: true });

      if (queryError) {
        setData(STATIC_SEED_STATISTICS);
        setError(new Error(queryError.message));
        setIsFallback(true);
      } else {
        setData(rows || []);
        setIsFallback(false);
      }
    } catch (err: any) {
      setData(STATIC_SEED_STATISTICS);
      setError(err instanceof Error ? err : new Error(String(err)));
      setIsFallback(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { data, loading, error, isFallback, refetch: fetchStats };
}

/**
 * Universal matcher for impact statistics.
 * Matches by primaryKey, aliases (e.g. books_made_available vs books_available), or keyword.
 */
export function findMatchingStatistic(
  stats: DbStatistic[],
  matchCriteria: {
    primaryKey: string;
    aliases?: string[];
    labelIncludes?: string[];
  },
  fallbackLabel: string,
  fallbackVal: string = "[XX+]",
  fallbackDesc: string = "(figures to be confirmed)"
): { label: string; value: string; description: string; isPending: boolean } {
  if (!stats || stats.length === 0) {
    return {
      label: fallbackLabel,
      value: fallbackVal,
      description: fallbackDesc,
      isPending: true,
    };
  }

  // 1. Exact match on metric_key
  let found = stats.find(
    (s) => s.metric_key && s.metric_key.toLowerCase() === matchCriteria.primaryKey.toLowerCase()
  );

  // 2. Match on aliases
  if (!found && matchCriteria.aliases) {
    found = stats.find(
      (s) =>
        s.metric_key &&
        matchCriteria.aliases!.some(
          (alias) => s.metric_key.toLowerCase() === alias.toLowerCase()
        )
    );
  }

  // 3. Match on label keyword or metric_key substring
  if (!found && matchCriteria.labelIncludes) {
    found = stats.find(
      (s) =>
        matchCriteria.labelIncludes!.some((keyword) => {
          const k = keyword.toLowerCase();
          return (
            (s.label && s.label.toLowerCase().includes(k)) ||
            (s.metric_key && s.metric_key.toLowerCase().includes(k))
          );
        })
    );
  }

  if (found) {
    const isPending =
      found.value.includes("[") ||
      found.value.toLowerCase().includes("pending") ||
      found.value.toLowerCase().includes("to be confirmed");
    return {
      label: found.label || fallbackLabel,
      value: found.value,
      description: found.description || (isPending ? fallbackDesc : ""),
      isPending,
    };
  }

  return {
    label: fallbackLabel,
    value: fallbackVal,
    description: fallbackDesc,
    isPending: true,
  };
}

/**
 * Splits plain text content with blank lines into paragraphs, or preserves existing HTML tags.
 */
export function formatCmsParagraphs(content: string): string[] {
  if (!content) return [];
  // Strip gallery marker if present
  const cleanContent = stripGalleryMarker(content);
  // If content contains standard HTML tags, return as single block for safe rendering
  if (/<[a-z][\s\S]*>/i.test(cleanContent)) {
    return [cleanContent];
  }
  return cleanContent
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}
