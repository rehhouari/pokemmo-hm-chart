import hmons from '../data/hmons.json'
import t from '../data/types.json'
import type { AlpineComponent } from 'alpinejs'

type HMons = {
  id: string,
  name: string,
  moves: number[],
  sprite: string,
  types: string[]
}[]

export const hmonsData: HMons = hmons
export const types: { [key: string]: string } = t

export const hms_info = [
  { id: 15, name: "Cut" },
  { id: 19, name: "Fly" },
  { id: 57, name: "Surf" },
  { id: 70, name: "Strength" },
  { id: 148, name: "Flash" },
  { id: 249, name: "Rock Smash" },
  { id: 127, name: "Waterfall" },
  { id: 291, name: "Dive" },
  { id: 432, name: "Defog" },
  { id: 431, name: "Rock Climb" },
  { id: 250, name: "Whirlwind" },
]

export const hmIds = hms_info.map(m => m.id)

export default (): AlpineComponent<any> => ({
  search: '',
  filters: [] as number[],
  type: '',
  page: 1,
  pageSize: 50,
  moveMap: {} as Record<string, Set<number>>,
  hms_info: hms_info,
  sortBy: 'dex' as 'dex' | 'count',
  sortDir: 'asc' as 'asc' | 'dec',
  init() {
    this.$watch('search', () => this.page = 1)
    this.$watch('type', () => this.page = 1)
    this.$watch('filters', () => this.page = 1)
    this.$watch('sortBy', () => this.page = 1)
    this.$watch('sortDir', () => this.page = 1)

    this.moveMap = Object.fromEntries(
      hmonsData.map(mon => [mon.id, new Set(mon.moves)])
    )
  },
  get paginatedResult(): HMons {
    const start = (this.page - 1) * this.pageSize
    return this.result.slice(start, start + this.pageSize) as HMons
  },
  get totalPages(): number {
    return Math.max(1, Math.ceil(this.result.length / this.pageSize))
  },
  get result(): HMons {
    let res: HMons = hmonsData
    if (this.search.length) {
      const q = this.search.toLowerCase().trim()
      res = res.filter(mon => mon.name.toLowerCase().startsWith(q))
    }
    if (!this.filters.length) {
      res = res.filter(mon => hmIds.some(move =>
        mon.moves.includes(move)))
    } else {
      res = res.filter(mon => this.filters.every((move: number) => mon.moves.includes(move)))
    }

    if (this.type != '') {
      res = res.filter(mon => mon.types.includes(this.type.toUpperCase()))
    }

    res = res.sort((a, b) => {
      if (this.sortBy == 'count') {
        const diff = a.moves.length - b.moves.length
        return this.sortDir == 'asc' ? diff : -diff
      }
      const diff = Number(a.id) - Number(b.id)
      return this.sortDir == 'asc' ? diff : -diff
    })
    return res
  },
  getType(name: string): string {
    return types[name.toLowerCase()]
  },
  toggle(move: number) {
    if (this.filters.includes(move)) {
      this.filters = this.filters.filter((v: number) => v != move)
    } else {
      this.filters.push(move)
    }
  },
  hasMove(monId: string, moveId: number): boolean {
    return this.moveMap[monId]?.has(moveId) ?? false
  },

  prevPage() {
    this.page = Math.max(1, this.page - 1)
  },
  nextPage() {
    this.page = Math.min(this.totalPages, this.page + 1)
  },
  setSort(field: 'dex' | 'count') {
    if (this.sortBy === field) {
      this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc'
    } else {
      this.sortBy = field
      this.sortDir = 'asc'
    }
    this.page = 1
  },

})

