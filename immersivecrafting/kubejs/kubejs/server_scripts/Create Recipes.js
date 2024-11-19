// priority: 0

// Visit the wiki for more info - https://kubejs.com/


ServerEvents.recipes(e => {
    let inter = 'kubejs:unfinished_slimeball'
    e.recipes.create.sequenced_assembly(
        [Item.of('slime_ball', 8 )],'minecraft:slime_ball',[
            e.recipes.createFilling(inter, [inter, Fluid.water(100)]),
            e.recipes.createDeploying(inter,[inter,'#minecraft:leaves']),
            e.recipes.createDeploying(inter,[inter,'create:wheat_flour'])
        ]).transitionalItem(inter).loops(1)
})
