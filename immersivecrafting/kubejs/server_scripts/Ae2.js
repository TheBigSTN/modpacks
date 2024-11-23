//Ae2 recipe Removing
ServerEvents.recipes(event => {[
    "ae2:inscriber/logic_processor",
    "ae2:inscriber/calculation_processor",
    "ae2:inscriber/engineering_processor",
    "ae2:inscriber/silicon_print",
    "ae2:inscriber/logic_processor_print",
    "ae2:inscriber/calculation_processor_print",
    "ae2:inscriber/engineering_processor_print",
    "ae2:inscriber/silicon_press",
    "ae2:inscriber/logic_processor_press",
    "ae2:inscriber/calculation_processor_press",
    "ae2:inscriber/engineering_processor_press",
    ].forEach((recipeID) => event.remove({id: recipeID}));
})

ServerEvents.recipes(e =>{
    //Processors
    inscriber_sequence(e,"ae2:logic_processor","kubejs:liquid_redstone","ae2:printed_logic_processor","kubejs:incomplete_logic_processor","ae2:printed_silicon")
    inscriber_sequence(e,"ae2:calculation_processor","kubejs:liquid_redstone","ae2:printed_calculation_processor","kubejs:incomplete_calculation_processor","ae2:printed_silicon")
    inscriber_sequence(e,"ae2:engineering_processor","kubejs:liquid_redstone","ae2:printed_engineering_processor","kubejs:incomplete_engineering_processor","ae2:printed_silicon")
    //Intermediary Processors
    inscriber_sequence(e,"ae2:printed_silicon",undefined,"ae2:silicon_press","kubejs:incomplete_printed_silicon","ae2:silicon")
    inscriber_sequence(e,"ae2:printed_logic_processor",undefined,"ae2:logic_processor_press","kubejs:incomplete_printed_logic_circuit","minecraft:gold_ingot")
    inscriber_sequence(e,"ae2:printed_calculation_processor",undefined,"ae2:calculation_processor_press","kubejs:incomplete_printed_calculation_processor","ae2:certus_quartz_crystal")
    inscriber_sequence(e,"ae2:printed_engineering_processor",undefined,"ae2:engineering_processor_press","kubejs:","minecraft:diamond")
    //Presses
    inscriber_sequence(e,"ae2:silicon_press",undefined,"ae2:silicon_press","kubejs:incomplete_silicon_press","minecraft:iron_block")
    inscriber_sequence(e,"ae2:logic_processor_press","minecraft:water","ae2:logic_processor_press","kubejs:incomplete_logic_processor_press","minecraft:iron_block")
    inscriber_sequence(e,"ae2:calculation_processor_press","minecraft:water","ae2:calculation_processor_press","kubejs:incomplete_calculation_processor_press","minecraft:iron_block")
    inscriber_sequence(e,"ae2:engineering_processor_press","minecraft:water","ae2:engineering_processor_press","kubejs:incomplete_engineering_processor_press","minecraft:iron_block")
})

function inscriber_sequence(e,output,filinginter,deployinter,inter,input) {
    if(filinginter) {
        e.recipes.create.sequenced_assembly(
            [output],input,[
                e.recipes.createFilling(inter, [inter, Fluid.of(filinginter, 100)]),
                e.recipes.createDeploying(inter , [inter,deployinter]).keepHeldItem(),
                e.recipes.createPressing(inter , inter)
            ]
        ).transitionalItem(inter).loops(1)
    } else {
        e.recipes.create.sequenced_assembly(
            [output],input,[
                e.recipes.createDeploying(inter , [inter,deployinter]).keepHeldItem(),
                e.recipes.createPressing(inter , inter)
            ]
        ).transitionalItem(inter).loops(1)
    }
}