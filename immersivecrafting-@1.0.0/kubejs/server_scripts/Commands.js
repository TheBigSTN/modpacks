ServerEvents.commandRegistry(event => {
    const { commands: Commands, arguments: Arguments } = event

        event.register(Commands.literal("night_vision")
            .requires(s => s.hasPermission(0))
            .executes(context => vision(context.source.player))
            .then(Commands.argument("target", Arguments.PLAYER.create(event))
                .executes(context => vision(Arguments.PLAYER.getResult(context, "target")))
            )
        )
        event.register(Commands.literal('fly') // The name of the command
            .requires(s => s.hasPermission(2)) // Check if the player has operator privileges
            .executes(c => fly(c.source.player)) // Toggle flight for the player that ran the command if the `target` argument isn't included
            .then(Commands.argument('target', Arguments.PLAYER.create(event))
                .executes(c => fly(Arguments.PLAYER.getResult(c, 'target'))) // Toggle flight for the player included in the `target` argument
            )
        )
        event.register(
            Commands
                .literal('invsee')
                .requires(s => s.hasPermission(4))
                .executes(context => context.source.sendMessage(Text.red("You need to specify a player name")))
                .then(Commands.argument("target", Arguments.PLAYER.create(event))
                    .executes(context => invsee(context.source.player,Arguments.PLAYER.getResult(context, "target")))
                )
        )
        
        // Helper functions
        let invsee = (player, target) => {
            if(!player || !target) {
                player.sendMessage(Text.red("This command can only be run by a player!"))
                return 1
            }

            // Create a new inventory object with 41 slots
            let inventorySize = 41;
            let inventory = Server.createInventory(commandSender, 'Player Inventory', inventorySize)

            // Copy items from target player's inventory to the custom inventory
            let targetInventory = target.getInventory();
            for (let i = 0; i < inventorySize; i++) {
                let sourceSlot;
                if (i < 27) {
                    sourceSlot = i + 9; // Main inventory
                } else if (i < 36) {
                    sourceSlot = i - 27; // Hotbar
                } else if (i < 40) {
                    sourceSlot = i - 36; // Armor (adjust for inventory version)
                } else {
                sourceSlot = 0; // Off-hand
                }
                inventory.setItem(i, targetInventory.getItem(sourceSlot));
            }

            // Open the custom inventory for the command sender
            player.openInventory(inventory);

            // Setup custom GUI with adjusted slot positions and backgrounds
            player.openScreen('Player Inventory', gui => {
                gui.background('minecraft:textures/gui/container/inventory.png');

                // All inventory slots (including armor and off-hand)
                for (let i = 0; i < inventorySize; i++) {
                    let x, y;
                    if (i < 27) {
                        x = 8 + (i % 9) * 18;
                                y = 84 + Math.floor(i / 9) * 18;
                    } else if (i < 36) {
                        x = 8 + (i - 27) * 18;
                        y = 142;
                    } else if (i < 40) {
                        x = 8;
                        y = 8 + (i - 36) * 18; // Adjust for inventory version
                        gui.slot(i, x, y, { background: 'minecraft:textures/item/empty_armor.png' });
                    } else {
                        x = 80;
                        y = 62;
                        gui.slot(i, x, y, { background: 'minecraft:textures/item/empty_shield.png' });
                    }
                    gui.slot(i, x, y); // Base slot definition
                }
            })
        }   
        let fly = (player) => {
            console.log(player)
            
            if (!player) {
                player.sendMessage(Text.red("This command can only be run by a player!"));
                return 1
            }

            if (player.abilities.mayfly) {
                player.abilities.mayfly = false
                player.abilities.flying = false
                player.displayClientMessage(Component.gold('Flying: ').append(Component.red('disabled')), true)
            } else {
                player.abilities.mayfly = true
                player.displayClientMessage(Component.gold('Flying: ').append(Component.green('enabled')), true)
            }
            player.onUpdateAbilities()
            return 1
        }
        var vision = (player) => {

            if (!player) {
                player.sendMessage(Text.red("This command can only be run by a player!"));
                return;
            }


            if (player.hasEffect("night_vision")) {
                // Remove night vision if already active
                player.removeEffect("night_vision")
                player.displayClientMessage(Component.gold('Night Vision: ').append(Component.red('disabled')), true)
            } else {
                // Apply night vision if not active/
                player.potionEffects.add("night_vision", -1, 0, false, false)
                player.displayClientMessage(Component.gold('Night Vision: ').append(Component.green('enabled')), true)
            }
            return 1
        }
})