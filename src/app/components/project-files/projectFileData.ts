export const fileRows = [
  { id: 'all', color: '#d91618', caption: '전체 프로젝트 / All Projects', keys: ['group-development', 'group-design', 'group-independent'] },
  { id: 'development', color: '#0d7868', caption: '개발 / Development', keys: ['devInteractiveRacingGroup', 'devAIVideoletterGroup', 'devARContentGroup', 'devAIGameGroup', 'devTaeanGroup', 'devGeumsanGroup', 'devWorkGroup'] },
  { id: 'design', color: '#581c70', caption: '디자인 / Design', keys: ['cafe', 'gamingroom', 'stage', 'jinu', 'glasses'] },
  { id: 'independent', color: '#2349d5', caption: '1인 개발 / Independent Development', keys: ['devPraynoteGroup', 'devPetChewGroup', 'devManittoGroup'] },
] as const;
export const tabNames: Record<string, string> = {
  allProjects: '전체 프로젝트', 'group-development': '개발', 'group-design': '디자인', 'group-independent': '1인 개발',
  devPraynoteGroup: '은혜의 바다', devPetChewGroup: 'Chap-Chew', devManittoGroup: 'Manitto',
  cafe: 'Cafe', gamingroom: 'Gaming Room', stage: 'Stage Design', jinu: 'Jinu', glasses: 'Glasses',
  devARContentGroup: 'AR Content', devAIGameGroup: 'AI Game', devInteractiveRacingGroup: 'Racing',
  devAIVideoletterGroup: 'AI Letter', devTaeanGroup: 'Taean', devGeumsanGroup: 'Geumsan', devWorkGroup: 'Process',
};
export const tabColors: Record<string, string> = {
  allProjects: '#d91618', 'group-development': '#0d7868', 'group-design': '#581c70', 'group-independent': '#2349d5',
  devPraynoteGroup: '#2349d5', devPetChewGroup: '#d91618', devManittoGroup: '#4c46bb',
  cafe: '#0d7868', gamingroom: '#316f45', stage: '#147f91',
  jinu: '#581c70', glasses: '#9b376a', devARContentGroup: '#fff22b', devAIGameGroup: '#141716',
  devInteractiveRacingGroup: '#bf321d', devAIVideoletterGroup: '#2349d5',
  devTaeanGroup: '#9c461d', devGeumsanGroup: '#aa2945', devWorkGroup: '#743846',
};
export type FileRow = (typeof fileRows)[number];
export function fileSelection(key: string) {
  if (key === 'allProjects' || (fileRows[0].keys as readonly string[]).includes(key)) return { row: 0, key };
  return { row: fileRows.findIndex(row => row.id !== 'all' && (row.keys as readonly string[]).includes(key)), key };
}
export const rowTabWidth = (item: { keys: readonly string[] }) => item.keys.length >= 7 ? `${100 / item.keys.length}%` : item.keys.length === 5 ? '18%' : item.keys.length === 4 ? '18%' : '22%';
