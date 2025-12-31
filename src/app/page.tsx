import FamilyTree from '@/components/FamilyTree';
import familyData from '@/data/familyData.json';
import { FamilyData } from '@/types/family';

/**
 * Home Page - Family Tree Entry Point
 *
 * This is the main page of the Family Tree application.
 * It uses Static Site Generation (SSG) to pre-render the page at build time.
 *
 * The family data is imported from a local JSON file,
 * making this a completely static, frontend-only application
 * with no backend, database, or API requirements.
 */
export default function Home() {
  // Cast the imported JSON to our typed interface
  const typedFamilyData = familyData as FamilyData;

  return (
    <main className="min-h-screen">
      <FamilyTree data={typedFamilyData} />
    </main>
  );
}
