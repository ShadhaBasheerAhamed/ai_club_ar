export interface Student {
  id: string;
  name: string;
  slug: string;
  modelGlb: string;
}

const STUDENT_MODELS = ['/teddy.glb', '/flower.glb', '/box.glb', '/damaged.glb'];

export const STUDENTS: Student[] = [
  { id: '1', name: 'Smruthi V', slug: 'smruthi-v', modelGlb: STUDENT_MODELS[0] },
  { id: '2', name: 'Muzhummathi A', slug: 'muzhummathi-a', modelGlb: STUDENT_MODELS[1] },
  { id: '3', name: 'Jumanah R', slug: 'jumanah-r', modelGlb: STUDENT_MODELS[2] },
  { id: '4', name: 'Gokula Kanna A', slug: 'gokula-kanna-a', modelGlb: STUDENT_MODELS[3] },
  { id: '5', name: 'Shiva Karthikeyan S', slug: 'shiva-karthikeyan-s', modelGlb: STUDENT_MODELS[0] },
  { id: '6', name: 'Samyuktha P', slug: 'samyuktha-p', modelGlb: STUDENT_MODELS[1] },
  { id: '7', name: 'Maria M', slug: 'maria-m', modelGlb: STUDENT_MODELS[2] },
  { id: '8', name: 'Sanav V. N', slug: 'sanav-v-n', modelGlb: STUDENT_MODELS[3] },
  { id: '9', name: 'Gourish A', slug: 'gourish-a', modelGlb: STUDENT_MODELS[0] },
  { id: '10', name: 'Om Aswanthran T', slug: 'om-aswanthran-t', modelGlb: STUDENT_MODELS[1] },
  { id: '11', name: 'Mano Praveen M', slug: 'mano-praveen-m', modelGlb: STUDENT_MODELS[2] },
  { id: '12', name: 'Kishore S', slug: 'kishore-s', modelGlb: STUDENT_MODELS[3] },
  { id: '13', name: 'P. Vishnu Maharaj', slug: 'p-vishnu-maharaj', modelGlb: STUDENT_MODELS[0] },
  { id: '14', name: 'S. Vidyuth', slug: 's-vidyuth', modelGlb: STUDENT_MODELS[1] },
  { id: '15', name: 'Pranav Sudhan', slug: 'pranav-sudhan', modelGlb: STUDENT_MODELS[2] },
  { id: '16', name: 'N. Niranjana', slug: 'n-niranjana', modelGlb: STUDENT_MODELS[3] },
  { id: '17', name: 'Sahana P.', slug: 'sahana-p', modelGlb: STUDENT_MODELS[0] },
  { id: '18', name: 'Varun Bose', slug: 'varun-bose', modelGlb: STUDENT_MODELS[1] },
  { id: '19', name: 'Karthikeyan', slug: 'karthikeyan', modelGlb: STUDENT_MODELS[2] },
];

export const CAMPAIGN_INFO = {
  title: "A BLOOM JUST FOR YOU",
  heading: "HAPPY CHILDREN'S DAY 2026!",
  subheading: "Every great innovation starts with curiosity. Keep dreaming, keep exploring, and keep creating!",
  footer: "Shadha Basheer Ahamed maam , AI CLUB ❤️",
  bouquetModelGlb: "/roses.glb",
  bouquetModelUsdz: "",
};

export function getStudentBySlug(slug: string): Student | undefined {
  const normalized = slug.toLowerCase().trim();
  return STUDENTS.find((s) => s.slug === normalized);
}
