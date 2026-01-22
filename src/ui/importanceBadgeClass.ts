type Importance = 'necessary' | 'important' | 'unnecessary' | 'unassigned' | string

export function importanceBadgeClass(importance: Importance) {
  switch (importance) {
    case 'necessary':
      return 'border-emerald-200 bg-emerald-50 text-emerald-800'
    case 'important':
      return 'border-sky-200 bg-sky-50 text-sky-800'
    case 'unnecessary':
      return 'border-rose-200 bg-rose-50 text-rose-800'
    case 'unassigned':
      return 'border-slate-200 bg-slate-50 text-slate-700'
    default:
      return 'border-slate-200 bg-slate-50 text-slate-700'
  }
}
