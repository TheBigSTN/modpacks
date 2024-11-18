const endings = ['_log','_wood']
const weirdendings = ['_stem','_hyphae']
const biomeslogs = [
    'fir', 
    'redwood', 
    'mahogany', 
    'jacaranda', 
    'palm', 
    'willow', 
    'dead', 
    'magic',
    'umbran',
    'hellbark'
]
const astralogs =  [
    'glacian'
]
const minecraftlogs = [
    'oak',
    'spruce',
    'birch',
    'jungle',
    'acacia',
    'dark_oak',
    'mangrove',
    'cherry'
]
const weirdnames = [
    'crimson',
    'warped'
]
ServerEvents.recipes(event => {
    minecraftlogs.forEach((recipeID) => event.remove({id: recipeID}))
    endings.forEach((ending) => {
        minecraftlogs.forEach((element) => {
            event.remove({id: `farmersdelight:cutting/${element+ending}`})
        })
    })
    weirdendings.forEach((ending) => {
        weirdnames.forEach((element) => {
            event.remove({id: `farmersdelight:cutting/${element+ending}`})
        })
    })
})
ServerEvents.recipes(event => {
    endings.forEach(ending => {
        biomeslogs.forEach(element => {
            event.custom({
                type: 'farmersdelight:cutting',
                ingredients: [{ item: `biomesoplenty:${element+ending}` }],
                tool: { tag: 'forge:tools/axes' },
                result: [
                  { item: `biomesoplenty:stripped_${element+ending}`, count: 1 },
                  { item: 'farmersdelight:tree_bark', count: 1 }
                ]
            })
        })
        astralogs.forEach(element => {
            event.custom({
                type: 'farmersdelight:cutting',
                ingredients: [{ item: `ad_astra:${element+ending}` }],
                tool: { tag: 'forge:tools/axes' },
                result: [
                  { item: `ad_astra:stripped_${element+ending}`, count: 1 },
                  { item: 'farmersdelight:tree_bark', count: 1 }
                ]
            })
        })
        minecraftlogs.forEach(element => {
            event.custom({
                type: 'farmersdelight:cutting',
                ingredients: [{ item: `minecraft:${element+ending}` }],
                tool: { tag: 'forge:tools/axes' },
                result: [
                  { item: `minecraft:stripped_${element+ending}`, count: 1 },
                  { item: 'farmersdelight:tree_bark', count: 1 }
                ]
            })
        })
    })
    weirdendings.forEach(ending => {
        weirdnames.forEach(element => {
            event.custom({
                type: 'farmersdelight:cutting',
                ingredients: [{ item: `minecraft:${element+ending}` }],
                tool: { tag: 'forge:tools/axes' },
                result: [
                  { item: `minecraft:stripped_${element+ending}`, count: 1 },
                  { item: 'farmersdelight:tree_bark', count: 1 }
                ]
            })
        });
    });
})