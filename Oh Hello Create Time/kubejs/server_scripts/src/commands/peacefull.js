// priority: 0

const players = [];

ServerEvents.commandRegistry((event) => {
  const { commands: Commands, arguments: Arguments } = event;

  event.register(
    Commands.literal("peacefull").executes((c) => peacefull(c.source.player))
  );

  let peacefull = (player) => {
    if (players.includes(player.username)) {
      players.splice(players.indexOf(player.username), 1);
      player.displayClientMessage(
        Component.gold("Peaceful: ").append(Component.red("disabled")),
        true
      );
    } else {
      players.push(player.username);
      player.displayClientMessage(
        Component.gold("Peaceful: ").append(Component.green("enabled")),
        true
      );
    }
    return 1;
  };
});

EntityEvents.hurt((event) => {
  const player = event.entity;
  if (!player.isPlayer()) return;

  if (players.includes(player.username)) {
    const source = event.source;

    source.actual && !source.actual.isPlayer();
    source.actual.setPosition(source.actual.x, -70, source.actual.z);

    if (source.getType() === "onFire") player.extinguishFire();
    event.cancel();
  }
});
