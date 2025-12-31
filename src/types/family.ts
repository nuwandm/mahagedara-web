/**
 * Family Tree Type Definitions
 *
 * These types define the structure of the family tree data.
 * The data structure is recursive, allowing for unlimited depth/generations.
 *
 * Key Features:
 * - Recursive children arrays for unlimited nesting
 * - Support for married couples (spouse field)
 * - Flexible metadata (tags, bio, photos)
 * - Gender-aware styling support
 */

/**
 * Represents a single person in the family tree
 * Can have children who are also Person objects (recursive structure)
 */
export interface Person {
  /** Unique identifier for the person */
  id: string;

  /** Full name of the person */
  name: string;

  /** Gender for styling and filtering */
  gender?: 'male' | 'female' | 'other';

  /** Year of birth */
  birthYear?: number;

  /** Year of death (if deceased) */
  deathYear?: number;

  /** Path to profile photo */
  photo?: string;

  /** Tags for categorization (e.g., "Engineer", "Founder") */
  tags?: string[];

  /** Short biography or description */
  bio?: string;

  /** Spouse information (if married) */
  spouse?: Spouse;

  /**
   * RECURSIVE: Children of this person
   * Each child is also a Person, allowing for unlimited nesting depth
   */
  children?: Person[];

  /** Optional: Place of birth */
  birthPlace?: string;

  /** Optional: Current location */
  location?: string;

  /** Optional: Occupation or profession */
  occupation?: string;

  /** Optional: Email contact */
  email?: string;

  /** Optional: Phone number */
  phone?: string;
}

/**
 * Represents a spouse (partner) of a person
 * Simplified version of Person for married partners
 */
export interface Spouse {
  /** Unique identifier */
  id?: string;

  /** Full name */
  name: string;

  /** Gender */
  gender?: 'male' | 'female' | 'other';

  /** Year of birth */
  birthYear?: number;

  /** Year of death */
  deathYear?: number;

  /** Path to profile photo */
  photo?: string;

  /** Tags */
  tags?: string[];

  /** Biography */
  bio?: string;

  /** Place of birth */
  birthPlace?: string;

  /** Current location */
  location?: string;

  /** Occupation */
  occupation?: string;
}

/**
 * Represents the founding couple of the family tree
 * The root of the entire family hierarchy
 */
export interface RootCouple {
  /** The husband/first partner */
  husband: Person;

  /** The wife/second partner */
  wife: Person;

  /**
   * RECURSIVE: Children of the root couple
   * These are the first generation below the founders
   */
  children?: Person[];
}

/**
 * The complete family tree data structure
 * Entry point for all family data
 */
export interface FamilyData {
  /** Name of the family */
  familyName: string;

  /** Optional family motto or tagline */
  familyMotto?: string;

  /** Optional family crest/logo image */
  familyLogo?: string;

  /**
   * The root couple - founders of the family tree
   * All generations descend from here
   */
  rootCouple: RootCouple;

  /** Optional metadata about the family tree */
  metadata?: {
    createdAt?: string;
    updatedAt?: string;
    version?: string;
  };
}

/**
 * Filter options for the family tree
 */
export interface FilterOptions {
  /** Search query for name matching */
  searchQuery: string;

  /** Filter by gender */
  gender: 'all' | 'male' | 'female';

  /** Filter by generation level */
  generation: number | 'all';

  /** Filter by specific tags */
  tags: string[];

  /** Show only living members */
  livingOnly: boolean;
}

/**
 * State for tracking expanded/collapsed nodes
 */
export interface TreeState {
  /** Set of node IDs that are expanded */
  expandedNodes: Set<string>;

  /** Currently selected person ID */
  selectedPerson: string | null;

  /** IDs in the selected lineage path */
  highlightedLineage: string[];
}

/**
 * Represents a family event (past or future)
 */
export interface FamilyEvent {
  /** Unique identifier for the event */
  id: string;

  /** Event title */
  title: string;

  /** Event description */
  description: string;

  /** Event date (ISO string format) */
  date: string;

  /** Event location */
  location?: string;

  /** Event type/category */
  type: 'celebration' | 'reunion' | 'wedding' | 'birthday' | 'memorial' | 'holiday' | 'other';

  /** Whether event is upcoming or past */
  status: 'upcoming' | 'past';

  /** Cover image URL */
  coverImage?: string;

  /** Google Drive folder ID for event photos (for past events) */
  googleDriveFolderId?: string;

  /** Tags for the event */
  tags?: string[];

  /** Organizer name */
  organizer?: string;

  /** Number of attendees */
  attendeeCount?: number;
}

/**
 * Events data structure
 */
export interface EventsData {
  /** All family events */
  events: FamilyEvent[];
}
