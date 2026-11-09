export interface Student {
  id: string;
  name: string;
  slug: string;
}

export const STUDENTS: Student[] = [
  { id: '1', name: 'Smruthi V', slug: 'smruthi-v' },
  { id: '2', name: 'Muzhummathi A', slug: 'muzhummathi-a' },
  { id: '3', name: 'Jumanah R', slug: 'jumanah-r' },
  { id: '4', name: 'Gokula Kanna A', slug: 'gokula-kanna-a' },
  { id: '5', name: 'Shiva Karthikeyan S', slug: 'shiva-karthikeyan-s' },
  { id: '6', name: 'Samyuktha P', slug: 'samyuktha-p' },
  { id: '7', name: 'Maria M', slug: 'maria-m' },
  { id: '8', name: 'Sanav V. N', slug: 'sanav-v-n' },
  { id: '9', name: 'Gourish A', slug: 'gourish-a' },
  { id: '10', name: 'Om Aswanthran T', slug: 'om-aswanthran-t' },
  { id: '11', name: 'Mano Praveen M', slug: 'mano-praveen-m' },
  { id: '12', name: 'Kishore S', slug: 'kishore-s' },
  { id: '13', name: 'P. Vishnu Maharaj', slug: 'p-vishnu-maharaj' },
  { id: '14', name: 'S. Vidyuth', slug: 's-vidyuth' },
  { id: '15', name: 'Pranav Sudhan', slug: 'pranav-sudhan' },
  { id: '16', name: 'N. Niranjana', slug: 'n-niranjana' },
  { id: '17', name: 'Sahana P.', slug: 'sahana-p' },
  { id: '18', name: 'Varun Bose', slug: 'varun-bose' },
  { id: '19', name: 'Karthikeyan', slug: 'karthikeyan' },
];

export const CAMPAIGN_INFO = {
  title: "A BLOOM JUST FOR YOU",
  heading: "HAPPY CHILDREN'S DAY 2026!",
  subheading: "Every great innovation starts with curiosity. Keep dreaming, keep exploring, and keep creating!",
  footer: "With Love, AI CLUB ❤️",
  bouquetModelGlb: "/bouquet.glb",
  bouquetModelUsdz: "",
};

export function getStudentBySlug(slug: string): Student | undefined {
  const normalized = slug.toLowerCase().trim();
  return STUDENTS.find((s) => s.slug === normalized);
}