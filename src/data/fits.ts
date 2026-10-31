// "The Congregation": people wearing Pray For Us.
// Prototype content: broadcast stills the client approved for use, tagged by what is visible in each photo.
// Real customer fits (with consent, height and size worn) are added here, or in the database in the production build.

export interface Fit {
  id: string
  photo: string
  handle?: string
  caption: string
  context?: string
  credit?: string
  items: string[]
  height?: string
  sizeWorn?: string
  /** photo is wider than tall */
  landscape?: boolean
  /** CSS object-position for the arch crop, so the wearer stays in frame. */
  focus?: string
  /** Zoom in from the top so a broadcast name bar at the bottom of the still is cropped out. */
  hideBar?: boolean
}

export const fits: Fit[] = [
  {
    id: 'unibersikulo',
    photo: 'fit-stage-2',
    handle: 'FlipTop',
    caption: 'Prodigal Son, black. Camo cap, steady hands.',
    context: 'Unibersikulo 13',
    credit: 'FlipTop · Nina Sandejas',
    items: ['prodigal-son-tee'],
    landscape: true,
  },
  {
    id: 'second-sight',
    photo: 'fit-stage',
    handle: 'FlipTop',
    caption: 'THORNS on stage under red light.',
    context: 'Second Sight 15',
    credit: 'FlipTop',
    items: ['thorns-tee'],
    landscape: true,
  },
  {
    id: 'blitzen',
    photo: 'fit-fliptop-1',
    handle: 'Blitzen',
    caption: 'NITE (navy) in the crowd. Face to face.',
    context: 'FlipTop battle',
    credit: 'FlipTop',
    items: ['nite-tee'],
    landscape: true,
    focus: '78% 0%',
    hideBar: true,
  },
  {
    id: 'si7ick',
    photo: 'fit-fliptop-2',
    handle: 'Si7ick',
    caption: '444. Once a year, no restocks.',
    context: 'FlipTop battle',
    credit: 'FlipTop',
    items: ['444-tee'],
    landscape: true,
    focus: '86% 0%',
    hideBar: true,
  },
  {
    id: 'jabo',
    photo: 'fit-fliptop-3',
    handle: 'Jabo',
    caption: 'BLACK WIDOW, barbed-wire heart.',
    context: 'FlipTop battle',
    credit: 'FlipTop',
    items: ['black-widow-tee'],
    landscape: true,
    focus: '14% 0%',
    hideBar: true,
  },
  {
    id: 'night-walk',
    photo: 'fit-night',
    caption: 'Hoodie up, cap low. Night walk.',
    items: [],
    landscape: true,
  },
  {
    id: 'the-og-congregation',
    photo: 'fit-ring',
    caption: 'The OG congregation. Praying hard.',
    items: [],
    landscape: true,
  },
]
